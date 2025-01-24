import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NotesModule } from './notes/notes.module';
import { SupabaseModule } from './supabase/supabase.module';

@Module({
  imports: [NotesModule, SupabaseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
