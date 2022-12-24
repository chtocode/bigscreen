import { ApiProperty, PartialType } from '@nestjs/swagger';

export enum RiskType {
  firefighting = 'firefighting',
  traffic = 'traffic',
  industry = 'industry',
  building = 'building',
  engineering = 'engineering',
  slope = 'slope',
  decrepitHouse = 'decrepitHouse',
  waterPoint = 'waterPoint',
}

export class CreateRiskDto {
  @ApiProperty({ required: true })
  name: string;

  @ApiProperty()
  person: string;

  @ApiProperty()
  tel: string;

  @ApiProperty({ required: true })
  category: RiskType;

  @ApiProperty()
  address: string;

  @ApiProperty({ required: true })
  coordinate: string;

  @ApiProperty()
  detail: string;

  @ApiProperty()
  pictures: string[];
}

export class UpdateRiskDto extends PartialType(CreateRiskDto) {
  @ApiProperty({ required: true })
  id: number;
}
