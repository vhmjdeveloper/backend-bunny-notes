import { Injectable } from '@nestjs/common';
import { SupabaseProvider } from '../supabase/supabase.provider';
import { WrapperResponse } from '../utils/WrapperResponse';
import { Notification } from '../utils/Notification';
import { CreateNoteRequest } from './dto/CreateNoteRequest';

@Injectable()
export class NotesService {
  constructor(private readonly supabaseProvider: SupabaseProvider) {}
  private static readonly TABLE_NOTES = 'notes';

  async listNotes() {
    const supabase = this.supabaseProvider.getClient();
    const { data, error } = await supabase
      .from(NotesService.TABLE_NOTES)
      .select('id, title, created_at');
    if (error) {
      throw new Error(`Error al obtener las notas: ${error.message}`);
    }
    const response = [];
    data.map((note) => {
      response.push({
        id: note.id,
        title: note.title,
        updatedAt: note.created_at,
      });
    });
    return response;
  }
  async getNoteContent(noteId: string) {
    const supabase = this.supabaseProvider.getClient();
    const { data, error } = await supabase
      .from(NotesService.TABLE_NOTES)
      .select('id, title, content, created_at, updated_at')
      .eq('id', noteId)
      .single();
    if (error) {
      console.log('Error al obtener el contenido de la nota:', error);
      return WrapperResponse.of(null, [
        Notification.error('Bad Request', error.code, error.message, 'ERROR'),
      ]);
    }
    return {
      id: data.id,
      title: data.title,
      content: data.content,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }

  async createNote(createNoteRequest: CreateNoteRequest) {
    const supabase = this.supabaseProvider.getClient();
    const { data, error } = await supabase
      .from(NotesService.TABLE_NOTES)
      .insert([
        {
          title: createNoteRequest.title,
          content: createNoteRequest.content,
          created_at: createNoteRequest.createdAt,
          updated_at: createNoteRequest.updatedAt,
        },
      ])
      .select('*');
    console.log('createNote', data, error);
    if (error) {
      console.log('Error al crear la nota:', error);
      return WrapperResponse.of(null, [
        Notification.error('unsuccess', error.code, error.message, 'ERROR'),
      ]);
    }
    return {
      id: data[0].id,
      title: data[0].title,
      content: data[0].content,
      createdAt: data[0].created_at,
      updatedAt: data[0].updated_at,
    };
  }

  async updateNote(noteId: string, createNoteRequest: CreateNoteRequest) {
    const supabase = this.supabaseProvider.getClient();
    console.log('updateNote', noteId, createNoteRequest);
    const { data, error } = await supabase
      .from(NotesService.TABLE_NOTES)
      .update({
        title: createNoteRequest.title,
        content: createNoteRequest.content,
        updated_at: new Date(),
      })
      .eq('id', noteId)
      .select('*')
      .single();
    if (error) {
      console.log('Error al actualizar la nota:', error);
      return WrapperResponse.of(null, [
        Notification.error('unsuccess', error.code, error.message, 'ERROR'),
      ]);
    }
    return {
      id: data.id,
      title: data.title,
      content: data.content,
      updatedAt: data.updated_at,
    };
  }

  async deleteNote(noteId: string) {
    const supabase = this.supabaseProvider.getClient();
    const { data, error } = await supabase
      .from(NotesService.TABLE_NOTES)
      .delete()
      .eq('id', noteId)
      .single();
    if (error) {
      console.log('Error al eliminar la nota:', error);
      return WrapperResponse.of(null, [
        Notification.error('unsuccess', error.code, error.message, 'ERROR'),
      ]);
    }
    return data;
  }
}
