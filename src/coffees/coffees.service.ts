import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { PatchCoffeeDto } from './dto/patch-coffee.dto';
import { Coffee } from './entity/coffee.entity';

@Injectable()
export class CoffeesService {
	private coffees: Coffee[] = [
		{
			id: 1,
			name: 'name',
			brand: 'brand',
			flavor: [ 'chocolat', 'vanilla' ]
		}
	];
	findAll() {
		return this.coffees;
	}

	findOne(id: number) {
		const coffee = this.coffees.find((coffee) => coffee.id === id);
		if (!coffee) throw new NotFoundException(`resource with ${id} not founds`);
	}
	create(createCoffeeDto: CreateCoffeeDto) {
		return 'create';
	}

	update(patchCoffeeDto: PatchCoffeeDto) {
		return 'patch';
	}
}
