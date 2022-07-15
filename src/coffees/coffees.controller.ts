/* eslint-disable prettier/prettier */
import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Patch,
	Post,
	Query,
	Res
} from '@nestjs/common';
import { CoffeesService } from './coffees.service';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { PatchCoffeeDto } from './dto/patch-coffee.dto';

@Controller('coffees')
export class CoffeesController {
	constructor(private readonly coffeService: CoffeesService) {}
	@Get('')
	findAll(@Query() paginationQuery) {
		const { limit, offset } = paginationQuery;
		return `limist ${limit} , offset ${offset}`;
	}

	@Get(':id')
	findOne(@Param('id') id: number) {
		return this.coffeService.findOne(id);
	}

	@Post('')
	create(@Body() CreateCoffeeDto: CreateCoffeeDto) {
		return this.coffeService.create(CreateCoffeeDto);
	}

	@Patch(':id')
	update(@Param('id') id: string, @Body() patchCoffeeDto: PatchCoffeeDto) {
		return this.coffeService.update(patchCoffeeDto);
	}

	@Delete(':id')
	delete(@Param('id') id: string) {
		return `delete id : ${id}`;
	}
}
