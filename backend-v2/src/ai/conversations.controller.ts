import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { Request, Response } from 'express';
import { CurrentUserSub } from '../common/decorators/current-user.decorator';
import { CoachStreamEvent, ConversationsService } from './conversations.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { PostMessageDto } from './dto/post-message.dto';

class ListQuery {
  @IsOptional()
  @IsString()
  cursor?: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  limit?: number;
}

class HistoryQuery {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  limit?: number;
}

/** Maps a thrown coded error to the SSE `error` event payload. */
function toSseError(err: unknown): { code: string; message: string } {
  if (err instanceof HttpException) {
    const body = err.getResponse();
    if (typeof body === 'object' && body !== null) {
      const b = body as Record<string, unknown>;
      return {
        code: typeof b.code === 'string' ? b.code : 'http_error',
        message: typeof b.message === 'string' ? b.message : 'Stream failed.',
      };
    }
    return { code: 'http_error', message: typeof body === 'string' ? body : 'Stream failed.' };
  }
  return { code: 'internal_error', message: 'Something went wrong.' };
}

@Controller('ai/conversations')
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@CurrentUserSub() googleSub: string, @Body() dto: CreateConversationDto) {
    return this.conversationsService.createConversation(googleSub, dto.title);
  }

  @Get()
  list(@CurrentUserSub() googleSub: string, @Query() query: ListQuery) {
    return this.conversationsService.listConversations(
      googleSub,
      query.limit ?? 20,
      query.cursor,
    );
  }

  @Get(':id/messages')
  history(
    @CurrentUserSub() googleSub: string,
    @Param('id') id: string,
    @Query() query: HistoryQuery,
  ) {
    return this.conversationsService.history(googleSub, id, query.limit ?? 50);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @CurrentUserSub() googleSub: string,
    @Param('id') id: string,
  ): Promise<void> {
    await this.conversationsService.deleteConversation(googleSub, id);
  }

  /** Model calls cost money: 30/min per user. */
  @Post(':id/messages')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 30, ttl: 60_000 } })
  postMessage(
    @CurrentUserSub() googleSub: string,
    @Param('id') id: string,
    @Body() dto: PostMessageDto,
  ) {
    return this.conversationsService.postMessage(
      googleSub,
      id,
      dto.content,
      dto.clientAiPlanVersion,
    );
  }

  /**
   * Streams the assistant reply as Server-Sent Events:
   * `event: start`          { conversationId, messageId }
   * `event: token`          { delta }
   * `event: plan`           { type: 'chatPlan', name, description, blueprint, version }
   * `event: updateRequired` { requiredVersion }
   * `event: done`           { replyMessageId, usage }
   * `event: error`          { code, message }
   *
   * `plan` events arrive progressively as the model streams the
   * create_workout_plan tool arguments; each is a refinement of the last.
   * `updateRequired` is sent instead of running the turn when the client's
   * AI plan version is behind the server's.
   *
   * Stricter throttle (20/min): streams hold a connection open.
   * A client disconnect aborts the upstream LiteLLM request.
   */
  @Post(':id/messages/stream')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 20, ttl: 60_000 } })
  async streamMessage(
    @CurrentUserSub() googleSub: string,
    @Param('id') id: string,
    @Body() dto: PostMessageDto,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');
    res.flushHeaders();

    const aborter = new AbortController();
    const onClose = (): void => aborter.abort();
    req.on('close', onClose);

    const send = (event: string, data: unknown): void => {
      if (!res.writableEnded && !aborter.signal.aborted) {
        res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
      }
    };

    const forward = (evt: CoachStreamEvent): void => {
      if (evt.type === 'start') {
        send('start', { conversationId: evt.conversationId, messageId: evt.messageId });
      } else if (evt.type === 'token') {
        send('token', { delta: evt.delta });
      } else if (evt.type === 'plan') {
        send('plan', evt.plan);
      } else if (evt.type === 'updateRequired') {
        send('updateRequired', { requiredVersion: evt.requiredVersion });
      } else {
        send('done', { replyMessageId: evt.replyMessageId, usage: evt.usage });
      }
    };

    try {
      await this.conversationsService.streamMessage(googleSub, id, dto.content, {
        clientAiPlanVersion: dto.clientAiPlanVersion,
        onEvent: forward,
        signal: aborter.signal,
      });
    } catch (err) {
      // Client already gone — nothing to send to.
      if (!aborter.signal.aborted) send('error', toSseError(err));
    } finally {
      req.off('close', onClose);
      if (!res.writableEnded) res.end();
    }
  }
}
