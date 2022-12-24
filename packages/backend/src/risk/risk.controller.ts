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
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { IApiTags } from '../config/api-tags';
import { CreateRiskDto, UpdateRiskDto } from './dto/risk.dto';
import { RiskService } from './risk.service';

@Controller('risk')
@ApiTags(IApiTags.Risk)
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class RiskController {
  constructor(private riskService: RiskService) {}

  @Post()
  create(@Body() data: CreateRiskDto) {
    return this.riskService.create(data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.riskService.remove(+id);
  }

  @Put()
  update(@Body() data: UpdateRiskDto) {
    return this.riskService.update(data);
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

    return this.riskService.findAll(query);
  }
}
