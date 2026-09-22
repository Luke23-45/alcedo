import { Injectable } from '@nestjs/common';

export interface OutputCheckResult {
  /** True when the text is safe to persist and show (after PII redaction). */
  safe: boolean;
  /** Machine-readable findings, e.g. 'prompt-leakage', 'pii:email', 'unsafe:ped-dosage'. */
  findings: string[];
  /** Sanitized content: redactions applied, or the tail replaced with a safe completion. */
  sanitized: string;
}

/** Used when the model output contains self-harm content. */
export const SELF_HARM_COMPLETION =
  "I'm really glad you told me. If you feel you might act on these thoughts, please contact your local emergency services or a crisis helpline right now. You deserve support from people trained for this — I'm here whenever you want to talk training.";

/** Generic fallback when the tail of a response has to be replaced. */
export const SAFE_FALLBACK_COMPLETION =
  "I can help with your training, nutrition for active people, and recovery. What would you like to work on?";

/** The model echoing its own instructions — never persist or show these. */
const PROMPT_LEAK_RES: RegExp[] = [
  /my system prompt/i,
  /my developer instructions/i,
  /system instructions/i,
  /reveal your (?:system )?prompt/i,
  /ignore (?:all |any )?previous instructions/i,
  /disregard (?:all )?previous instructions/i,
  /jailbreak/i,
];

const PED_SUBSTANCES =
  'testosterone|trenbolone|tren|anavar|oxandrolone|winstrol|stanozolol|clenbuterol|clen|' +
  'dianabol|methandrostenolone|nandrolone|deca|sustanon|hgh|anadrol|oxymetholone|' +
  'masteron|drostanolone|primobolan|methenolone|proviron|mesterolone|' +
  'anastrozole|arimidex|tamoxifen|nolvadex|hcg|clomid';

/**
 * PED dosing advice. The dose and the substance must appear in the SAME
 * sentence (no crossing . ! ? or newlines) to avoid flagging innocent
 * comparisons like "5mg of creatine ... unlike testosterone".
 */
const PED_RES: RegExp[] = [
  new RegExp(`\\b\\d+(?:\\.\\d+)?\\s?(?:mg|mcg|\\u00b5g|iu)\\b[^.!?\\n]{0,60}?\\b(?:${PED_SUBSTANCES})\\b`, 'i'),
  new RegExp(`\\b(?:${PED_SUBSTANCES})\\b[^.!?\\n]{0,60}?\\b\\d+(?:\\.\\d+)?\\s?(?:mg|mcg|\\u00b5g|iu)\\b`, 'i'),
  /steroid cycle/i,
  /anabolic steroids/i,
  new RegExp(`\\b(?:cycling|stacking)\\b[^.!?\\n]{0,40}?\\b(?:${PED_SUBSTANCES})\\b`, 'i'),
  /where (?:to|can i) buy (?:steroids|testosterone|tren|anavar|hgh)/i,
  /post cycle therapy/i,
];

const SELF_HARM_RES: RegExp[] = [
  /\bkilling myself\b/i,
  /\bkill myself\b/i,
  /\bkilling yourself\b/i,
  /\bkill yourself\b/i,
  /\bhurt yourself\b/i,
  /\bcutting yourself\b/i,
  /\bharm yourself\b/i,
  /\bsuicid(?:e|al)\b/i,
  /\bself[-\s]?harm\b/i,
  /\bend my life\b/i,
  /\bwant to die\b/i,
  /\bcutting myself\b/i,
  /\bhurt myself\b/i,
  /\bdon'?t want to live\b/i,
];

const EMAIL_RE = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,}/g;
const PHONE_RE = /(?:\+\d{1,3}[-.\s]?)?(?:\(?\d{2,4}\)?[-.\s]?){1,3}\d{3,4}\b/g;

/**
 * A phone-like match is only redacted when it has 7-15 digits AND either
 * contains a separator (so "3 sets of 12" and years are left alone) or is a
 * long bare digit run.
 */
function isPhoneLike(match: string): boolean {
  const digits = match.replace(/\D/g, '');
  if (digits.length < 7 || digits.length > 15) return false;
  if (/[+\-.\s()]/.test(match)) return true;
  return digits.length >= 10;
}

/**
 * Output checks run on the completed assistant text before it is persisted
 * (and as a tail correction on streams): prompt-leakage phrases, PED dosing
 * advice, and self-harm content are caught here, never trusted to the model.
 * PII is redacted in place; blocking findings replace the tail from the
 * first unsafe match with a safe completion.
 */
@Injectable()
export class OutputCheckService {
  checkOutput(text: string): OutputCheckResult {
    const findings: string[] = [];
    let firstUnsafeAt = -1;
    let unsafeTag: string | null = null;

    const scan = (patterns: RegExp[], tag: string): void => {
      for (const pattern of patterns) {
        pattern.lastIndex = 0;
        const match = pattern.exec(text);
        if (match) {
          if (!findings.includes(tag)) findings.push(tag);
          if (firstUnsafeAt === -1 || match.index < firstUnsafeAt) {
            firstUnsafeAt = match.index;
            unsafeTag = tag;
          }
        }
      }
    };

    scan(PROMPT_LEAK_RES, 'prompt-leakage');
    scan(PED_RES, 'unsafe:ped-dosage');
    scan(SELF_HARM_RES, 'self-harm');

    if (unsafeTag) {
      const fallback =
        unsafeTag === 'self-harm' ? SELF_HARM_COMPLETION : SAFE_FALLBACK_COMPLETION;
      const head = text.slice(0, firstUnsafeAt).trim();
      const sanitized = head.length > 40 ? `${head}\n\n${fallback}` : fallback;
      return { findings, safe: false, sanitized };
    }

    let sanitized = text;
    EMAIL_RE.lastIndex = 0;
    if (EMAIL_RE.test(sanitized)) {
      findings.push('pii:email');
      EMAIL_RE.lastIndex = 0;
      sanitized = sanitized.replace(EMAIL_RE, '[email redacted]');
    }
    PHONE_RE.lastIndex = 0;
    let phoneFound = false;
    let m: RegExpExecArray | null;
    while ((m = PHONE_RE.exec(sanitized)) !== null) {
      if (isPhoneLike(m[0])) {
        phoneFound = true;
        break;
      }
    }
    if (phoneFound) {
      findings.push('pii:phone');
      PHONE_RE.lastIndex = 0;
      sanitized = sanitized.replace(PHONE_RE, (match) =>
        isPhoneLike(match) ? '[phone redacted]' : match,
      );
    }

    return { findings, safe: true, sanitized };
  }
}
