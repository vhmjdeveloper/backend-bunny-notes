import { Injectable } from '@nestjs/common';
import { SupabaseProvider } from '../supabase/supabase.provider';
import { storageConfig } from '../storage.config';

@Injectable()
export class ImagesService {
  constructor(private readonly supabaseProvider: SupabaseProvider) {}

  async uploadImage(file: Express.Multer.File, path: string) {
    const supabase = this.supabaseProvider.getClient();
    const { error } = await supabase.storage
      .from(storageConfig.bucketName)
      .upload(path, file.buffer, {
        contentType: file.mimetype,
        upsert: true,
      });

    if (error) {
      console.log('Error al subir la imagen:', error);
      throw new Error('Error al subir la imagen');
    }
    return path;
  }

  async getSignedUrl(path: string): Promise<string> {
    const supabase = this.supabaseProvider.getClient();
    const {
      data: { signedUrl },
    } = await supabase.storage
      .from(storageConfig.bucketName)
      .createSignedUrl(path, 7 * 24 * 60 * 60);
    console.log('signedUrl:', signedUrl);
    return signedUrl;
  }
}
