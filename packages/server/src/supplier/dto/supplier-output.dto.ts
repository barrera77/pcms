import { ApiProperty } from '@nestjs/swagger';
import { ISupplier } from '@pcms/pcms-common';

export class SupplierDto implements ISupplier {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  contactPerson?: string;

  @ApiProperty()
  email?: string;

  @ApiProperty()
  phone?: string;

  @ApiProperty()
  address?: string;
}
