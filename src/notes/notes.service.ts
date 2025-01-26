import { Injectable } from '@nestjs/common';
import { SupabaseProvider } from '../supabase/supabase.provider';
import { WrapperResponse } from '../utils/WrapperResponse';
import { Notification } from '../utils/Notification';
import { CreateNoteRequest } from './dto/CreateNoteRequest';
import { ImagesService } from '../images/images.service';

@Injectable()
export class NotesService {
  constructor(
    private readonly supabaseProvider: SupabaseProvider,
    private readonly imageService: ImagesService,
  ) {}

  private static readonly TABLE_NOTES = 'notes';
  private static readonly TABLE_IMAGES: string = 'images';

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
    // get images urls
    const { data: images, error: errorImages } = await supabase
      .from(NotesService.TABLE_IMAGES)
      .select('path')
      .eq('note', noteId);
    if (errorImages) {
      console.log('Error al obtener las imágenes de la nota:', errorImages);
      return WrapperResponse.of(null, [
        Notification.error(
          'unsuccess',
          errorImages.code,
          errorImages.message,
          'ERROR',
        ),
      ]);
    }
    const imagesUrls = [];
    for (const image of images) {
      const url = await this.imageService.getSignedUrl(image.path);
      imagesUrls.push(url);
    }
    console.log('image:', imagesUrls);
    return {
      id: data.id,
      title: data.title,
      content: data.content,
      images: imagesUrls,
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

  async uploadNoteImage(noteId: string, file: Express.Multer.File) {
    const supabase = this.supabaseProvider.getClient();
    const path = `${noteId}/${Date.now()}-${file.originalname}`;
    await this.imageService.uploadImage(file, path);
    // save image path in database
    const { error } = await supabase
      .from(NotesService.TABLE_IMAGES)
      .insert([
        {
          note: noteId,
          path: path,
          name: file.originalname,
        },
      ])
      .select('*');
    if (error) {
      console.log('Error al subir la imagen:', error);
      return WrapperResponse.of(null, [
        Notification.error('unsuccess', error.code, error.message, 'ERROR'),
      ]);
    }
    // Get url of image
    return {url: await this.imageService.getSignedUrl(path)};
  }
}
