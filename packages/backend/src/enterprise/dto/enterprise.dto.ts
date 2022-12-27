import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateEnterpriseDto {
  @ApiProperty({ required: true })
  buildingId: number;

  @ApiProperty({ required: true })
  name: string;

  @ApiProperty()
  person: string;

  @ApiProperty()
  tel: string;

  @ApiProperty()
  address: string;

  @ApiProperty()
  detail: string;

  @ApiProperty()
  pictures: string[];

  @ApiProperty()
  floor: string;
}

export class UpdateEnterpriseDto extends PartialType(CreateEnterpriseDto) {
  @ApiProperty({ required: true })
  id: number;
}
