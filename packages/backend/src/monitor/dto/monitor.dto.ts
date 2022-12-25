import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateMonitorDto {
  @ApiProperty({ required: true })
  name: string;

  @ApiProperty()
  address: string;

  @ApiProperty({ required: true })
  coordinate: string;

  @ApiProperty()
  url: string;
}

export class UpdateMonitorDto extends PartialType(CreateMonitorDto) {
  @ApiProperty({ required: true })
  id: number;
}
