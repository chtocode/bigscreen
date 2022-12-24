import { ApiProperty, PartialType } from '@nestjs/swagger';

export enum RescueType {
  firefighting = 'firefighting',
  tinyFirefighting = 'tinyFirefighting',
  securityOfficer = 'securityOfficer',
  skyRescue = 'skyRescue',
}

export class CreateRescueDto {
  @ApiProperty({ required: true })
  name: string;

  @ApiProperty()
  person: string;

  @ApiProperty()
  tel: string;

  @ApiProperty({ required: true })
  category: RescueType;

  @ApiProperty()
  address: string;

  @ApiProperty({ required: true })
  coordinate: string;

  @ApiProperty()
  detail: string;

  @ApiProperty()
  pictures: string[];
}

export class UpdateRescueDto extends PartialType(CreateRescueDto) {
  @ApiProperty({ required: true })
  id: number;
}
