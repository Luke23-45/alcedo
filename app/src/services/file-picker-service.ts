import * as DocumentPicker from 'expo-document-picker';
import { File } from 'expo-file-system';
export type PickedFile = {
  bytes: Uint8Array;
  name: string;
};

/**
 * Returned by {@link FilePickerService.pickFile} when the picked file exceeds the
 * caller's `maxBytes` — decided from the picker's reported size, without reading the
 * file's contents into memory.
 */
export const PICKED_FILE_TOO_LARGE = 'too-large';

export class FilePickerService {
  async pickFile(): Promise<PickedFile | undefined>;
  async pickFile(maxBytes: number): Promise<PickedFile | typeof PICKED_FILE_TOO_LARGE | undefined>;
  async pickFile(maxBytes?: number): Promise<PickedFile | typeof PICKED_FILE_TOO_LARGE | undefined> {
    const picked = await DocumentPicker.getDocumentAsync({
      copyToCacheDirectory: true,
      multiple: false,
    });
    if (picked.canceled) {
      return undefined;
    }
    const pickedItem = picked.assets[0];
    if (!pickedItem) {
      return undefined;
    }
    // The picker reports the size without touching the contents: reject an oversized
    // file before materializing it into memory. (Some platforms omit size; callers
    // still check bytes.length as a fallback after reading.)
    if (maxBytes !== undefined && pickedItem.size !== undefined && pickedItem.size > maxBytes) {
      return PICKED_FILE_TOO_LARGE;
    }
    const fileBytes = new File(pickedItem.uri).bytes();
    return { name: pickedItem.name, bytes: await fileBytes };
  }
}
