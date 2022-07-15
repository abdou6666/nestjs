import { PartialType } from '@nestjs/mapped-types';
import { CreateCoffeeDto } from './create-coffee.dto';

export class PatchCoffeeDto extends PartialType(CreateCoffeeDto) {}
