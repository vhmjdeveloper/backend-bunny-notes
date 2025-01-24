import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SupabaseProvider {
  private readonly supabase: SupabaseClient;

  constructor() {
    const url = process.env.SUPABASE_URL; // Configurado en el .env
    const key = process.env.SUPABASE_KEY; // Configurado en el .env

    if (!url || !key) {
      throw new Error(
        'Supabase URL o Key no están configurados en las variables de entorno.',
      );
    }

    this.supabase = createClient(url, key);
  }

  getClient(): SupabaseClient {
    return this.supabase;
  }
}
