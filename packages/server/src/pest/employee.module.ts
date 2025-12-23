import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PestController } from 'src/pest/pest.controller';
import { Pest, PestSchema } from 'src/pest/pest.entity';
import { PestService } from 'src/pest/pest.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Pest.name, schema: PestSchema }]),
  ],
  controllers: [PestController],
  providers: [PestService],
  exports: [PestService],
})
export class PestModule {}
