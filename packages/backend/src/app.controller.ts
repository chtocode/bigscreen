import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { AppService } from './app.service';

export class UploadDto {
  @ApiProperty({ required: true })
  name: string;
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('upload_token')
  async generateToken(@Body() upload: UploadDto): Promise<string> {
    return this.appService.upToken(upload.name);
  }
}
