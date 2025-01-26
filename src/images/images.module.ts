import { Module } from '@nestjs/common';
import { ImagesService } from './images.service';
import { ImagesController } from './images.controller';
import { SupabaseProvider } from "../supabase/supabase.provider";

@Module({
  providers: [ImagesService, SupabaseProvider],
  controllers: [ImagesController],
})
export class ImagesModule {}
