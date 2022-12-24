import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { IApiTags } from '../config/api-tags';
import { CreateRescueDto, UpdateRescueDto } from './dto/rescue.dto';
import { RescueService } from './rescue.service';

@Controller('rescue')
@ApiTags(IApiTags.Rescue)
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class RescueController {
  constructor(private rescueService: RescueService) {}

  @Post()
  create(@Body() data: CreateRescueDto) {
    return this.rescueService.create(data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rescueService.remove(+id);
  }

  @Put()
  update(@Body() data: UpdateRescueDto) {
    return this.rescueService.update(data);
  }

  @ApiQuery({
    name: 'name',
    type: 'string',
    description: 'risk name',
    required: false,
  })
  @ApiQuery({
    name: 'category',
    type: 'string',
    description: 'risk type name',
    required: false,
  })
  @ApiQuery({
    name: 'limit',
    type: 'number',
    description: 'query count. Required if page set.',
    required: true,
  })
  @ApiQuery({
    name: 'page',
    type: 'number',
    description: 'current page. first page: 1. Required if limit set',
    required: true,
  })
  @Get()
  async findAll(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('name') name: string,
    @Query('category') category: string,
    // @Req() req,
  ) {
    const query = { name, category, page, limit };

    return this.rescueService.findAll(query);
  }
}
