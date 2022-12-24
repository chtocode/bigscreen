import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateBuildingDto {
  @ApiProperty({ required: true })
  name: string;

  @ApiProperty()
  person: string;

  @ApiProperty()
  tel: string;

  @ApiProperty()
  address: string;

  @ApiProperty({ required: true })
  coordinate: string;

  @ApiProperty()
  totalFloors: number;

  @ApiProperty()
  subsurfaceFloors: number;

  @ApiProperty()
  floors: JSON;
}

export class UpdateBuildingDto extends PartialType(CreateBuildingDto) {
  @ApiProperty({ required: true })
  id: number;
}
