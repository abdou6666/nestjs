/* eslint-disable prettier/prettier */
import { DataSource } from 'typeorm';

export const connectionSource = new DataSource({
	type: 'postgres',
	host: 'localhost',
	port: 5432,
	username: 'postgres',
	password: 'pass123',
	database: 'postgres',
	logging: false,
	name: 'default',
	entities: [ 'src/**/*.entity{.ts,.js}' ],
	migrations: [ 'src/migrations/*{.ts,.js}' ],
	subscribers: [ 'src/subscriber/**/*{.ts,.js}' ]
});
