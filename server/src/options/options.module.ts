import { Module } from '@nestjs/common';
import {
  OptionsController,
  OptionValuesController,
} from './options.controller';
import { OptionsService } from './options.service';

@Module({
  controllers: [OptionsController, OptionValuesController],
  providers: [OptionsService],
  exports: [OptionsService],
})
export class OptionsModule {}
