import {
  Controller, Param,
  Post,
  UploadedFile,
  UseInterceptors
} from "@nestjs/common";
import { ImagesService } from './images.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('/v1/images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Post(':id')
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File) {
    const path = `${id}/${Date.now()}-${file.originalname}`;
    return await this.imagesService.uploadImage(file, path);
  }
}
