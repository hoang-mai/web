import { Command, CommandRunner } from 'nest-commander';
import { DatabaseSeederService } from './database-seeder.service';
import { Injectable } from '@nestjs/common';

@Injectable()
@Command({ name: 'seed', description: 'Seed the database with initial data' })
export class DatabaseSeederCommand extends CommandRunner {
  constructor(private readonly databaseSeederService: DatabaseSeederService) {
    super();
  }

  async run(): Promise<void> {
    try {
      console.log('Starting database seeding process...');
      await this.databaseSeederService.seed();
      console.log('Database seeding completed successfully!');
      process.exit(0);
    } catch (error) {
      console.error('Error while seeding the database:', error);
      process.exit(1);
    }
  }
}
