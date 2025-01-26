import { Module } from '@nestjs/common';
import { NotesService } from './notes.service';
import { NotesController } from './notes.controller';
import { SupabaseProvider } from '../supabase/supabase.provider';
import { ImagesService } from "../images/images.service";

@Module({
  providers: [NotesService, ImagesService, SupabaseProvider],
  controllers: [NotesController],
})
export class NotesModule {}
