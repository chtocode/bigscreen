import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { IApiTags } from '../config/api-tags';
import { CreateMonitorDto, UpdateMonitorDto } from './dto/monitor.dto';
import { MonitorService } from './monitor.service';

@Controller('monitor')
@ApiTags(IApiTags.Monitor)
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class MonitorController {
  constructor(private monitorService: MonitorService) {}

  @Post()
  create(@Body() data: CreateMonitorDto) {
    return this.monitorService.create(data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.monitorService.remove(+id);
  }

  @Put()
  update(@Body() data: UpdateMonitorDto) {
    return this.monitorService.update(data);
  }

  @ApiQuery({
    name: 'name',
    type: 'string',
    description: 'monitor name',
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
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
    @Query('name') name: string,
    // @Req() req,
  ) {
    const query = { name, page, limit };

    return this.monitorService.findAll(query);
  }
}
