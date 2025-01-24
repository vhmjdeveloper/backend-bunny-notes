import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { NotesService } from './notes.service';

import { CreateNoteRequest } from './dto/CreateNoteRequest';

@Controller('/v1/pages')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Get()
  async listNotes() {
    return await this.notesService.listNotes();
  }
  @Get(':id')
  async getNote(@Param('id') noteId: string) {
    return await this.notesService.getNoteContent(noteId);
  }
  @Post()
  async createNote(@Body() createNoteRequest: CreateNoteRequest) {
    return await this.notesService.createNote(createNoteRequest);
  }

  @Patch(':id')
  async updateNote(
    @Param('id') noteId: string,
    @Body() createNoteRequest: CreateNoteRequest,
  ) {
    return await this.notesService.updateNote(noteId, createNoteRequest);
  }

  @Delete(':id')
  async deleteNote(@Param('id') noteId: string) {
    return await this.notesService.deleteNote(noteId);
  }
}
