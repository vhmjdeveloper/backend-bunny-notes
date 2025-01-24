import { Module } from '@nestjs/common';
import { NotesService } from './notes.service';
import { NotesController } from './notes.controller';
import { SupabaseProvider } from '../supabase/supabase.provider';

@Module({
  providers: [NotesService, SupabaseProvider],
  controllers: [NotesController],
})
export class NotesModule {}
