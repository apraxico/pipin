import { inject, Injectable } from '@angular/core';
import { Storage, ref, uploadBytes, getDownloadURL, deleteObject } from '@angular/fire/storage';

@Injectable({ providedIn: 'root' })
export class StorageService {
  private storage = inject(Storage);

  async upload(path: string, file: File): Promise<string> {
    const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_')}`;
    const fullPath = `${path}/${safeName}`;
    const r = ref(this.storage, fullPath);
    await uploadBytes(r, file, { contentType: file.type });
    return await getDownloadURL(r);
  }

  async uploadMany(path: string, files: File[]): Promise<string[]> {
    return Promise.all(files.map(f => this.upload(path, f)));
  }

  async remove(url: string): Promise<void> {
    try {
      const r = ref(this.storage, url);
      await deleteObject(r);
    } catch {
      // best-effort
    }
  }
}
