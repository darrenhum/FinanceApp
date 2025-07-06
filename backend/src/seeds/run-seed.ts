import { DataSource } from 'typeorm';
import { InitialSeed } from './initial-seed';

async function runSeed() {
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT || '5432', 10),
    username: process.env.DATABASE_USERNAME || 'postgres',
    password: process.env.DATABASE_PASSWORD || 'postgres',
    database: process.env.DATABASE_NAME || 'financeapp_dev',
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: true,
    logging: false,
    ssl: process.env.DATABASE_HOST?.includes('amazonaws.com')
      ? { rejectUnauthorized: false }
      : false,
  });

  try {
    console.log('Connecting to database...');
    await dataSource.initialize();
    console.log('Database connected successfully!');

    const seeder = new InitialSeed(dataSource);
    await seeder.run();

    console.log('Seed completed successfully!');
  } catch (error) {
    console.error('Error running seed:', error);
    process.exit(1);
  } finally {
    await dataSource.destroy();
    console.log('Database connection closed.');
  }
}

import { config } from 'dotenv';

// Load environment variables
config();

// Run the seed
runSeed().catch((error) => {
  console.error('Failed to run seed:', error);
  process.exit(1);
});
