import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { query } from 'express';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { Event } from 'src/events/entities/event.entity';
import { DataSource as Connection, Repository } from 'typeorm';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { PatchCoffeeDto } from './dto/patch-coffee.dto';
import { Coffee } from './entities/coffee.entity';
import { Flavor } from './entities/flavor.entity';

@Injectable()
export class CoffeesService {
	constructor(
		@InjectRepository(Coffee) private readonly coffeeRepository: Repository<Coffee>,
		@InjectRepository(Flavor) private readonly flavorRepository: Repository<Flavor>,
		private readonly connection: Connection
	) {}

	async findAll(paginationQuery: PaginationQueryDto) {
		const { limit, offset } = paginationQuery;
		return await this.coffeeRepository.find({
			relations: [ 'flavors' ],
			skip: offset,
			take: limit
		});
	}

	async findOne(id: any) {
		const coffee = await this.coffeeRepository.find({
			where: { id },
			relations: [ 'flavors' ]
		});
		if (!coffee) throw new NotFoundException(`resource with ${id} not founds`);
		return coffee;
	}
	async create(createCoffeeDto: CreateCoffeeDto) {
		const flavors = await Promise.all(
			createCoffeeDto.flavors.map((flavor) => this.preloadFlavorByName(flavor.toString()))
		);
		const coffee = await this.coffeeRepository.create({ ...createCoffeeDto, flavors });
		return await this.coffeeRepository.save(coffee);
	}

	async update(id: any, patchCoffeeDto: PatchCoffeeDto) {
		const flavors =
			patchCoffeeDto.flavors &&
			(await Promise.all(
				patchCoffeeDto.flavors.map((flavor) => this.preloadFlavorByName(flavor.name))
			));

		const coffee = await this.coffeeRepository.preload({
			id: +id,
			...patchCoffeeDto
		});
		if (!coffee) throw new NotFoundException(`Coffee #${id} not found`);
		return this.coffeeRepository.save(coffee);
	}

	async remove(id: any) {
		const coffee = await this.coffeeRepository.findOneBy({ id });
		return this.coffeeRepository.remove(coffee);
	}
	async recommendCoffe(coffee: Coffee) {
		const queryRunner = this.connection.createQueryRunner();

		await queryRunner.connect();
		await queryRunner.startTransaction();
		try {
			coffee.recommendation++;
			const recommendEvent = new Event();
			recommendEvent.name = 'recommend coffee';
			recommendEvent.type = 'coffee';
			recommendEvent.payload = { coffeeId: coffee.id };

			await queryRunner.manager.save(coffee);
			await queryRunner.manager.save(recommendEvent);

			await queryRunner.commitTransaction();
		} catch (err) {
			await queryRunner.rollbackTransaction();
		} finally {
			await queryRunner.release();
		}
	}
	private async preloadFlavorByName(name: string): Promise<Flavor> {
		const existingFlavor = await this.flavorRepository.findOneBy({ name });
		if (existingFlavor) {
			return existingFlavor;
		}
		return this.flavorRepository.create({ name });
	}
}
