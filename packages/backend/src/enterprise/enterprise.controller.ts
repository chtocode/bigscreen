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
import { BuildingService } from './building.service';
import { CreateBuildingDto, UpdateBuildingDto } from './dto/building.dto';
import { CreateEnterpriseDto, UpdateEnterpriseDto } from './dto/enterprise.dto';
import { EnterpriseService } from './enterprise.service';

@Controller('enterprise')
@ApiTags(IApiTags.Enterprise)
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class EnterpriseController {
  constructor(private enterpriseService: EnterpriseService) {}

  @Post()
  create(@Body() data: CreateEnterpriseDto) {
    return this.enterpriseService.create(data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.enterpriseService.remove(+id);
  }

  @Put()
  update(@Body() data: UpdateEnterpriseDto) {
    return this.enterpriseService.update(data);
  }

  @ApiQuery({
    name: 'name',
    type: 'string',
    description: 'enterprise name',
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

    return this.enterpriseService.findAll(query);
  }
}

@Controller('building')
@ApiTags(IApiTags.Building)
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class BuildingController {
  constructor(private buildingService: BuildingService) {}

  @Post()
  create(@Body() data: CreateBuildingDto) {
    return this.buildingService.create(data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.buildingService.remove(+id);
  }

  @Put()
  update(@Body() data: UpdateBuildingDto) {
    return this.buildingService.update(data);
  }

  @ApiQuery({
    name: 'name',
    type: 'string',
    description: 'building name',
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

    return this.buildingService.findAll(query);
  }
}
