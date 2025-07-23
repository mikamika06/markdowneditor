import { testConnection } from '../config/database';
import * as initialSchema from './001_initial_schema';

async function runMigrations(direction: 'up' | 'down' = 'up') {
  try {
    const isConnected = await testConnection();
    if (!isConnected) {
      console.error('Database connection failed');
      process.exit(1);
    }

    if (direction === 'up') {
      await initialSchema.up();
    } else {
      await initialSchema.down();
    }
    
    console.log(`Migrations ${direction === 'up' ? 'applied' : 'rolled back'} successfully`);
  } catch (error) {
    console.error('Migration runner failed:', error);
    process.exit(1);
  }
}

const direction = process.argv[2] === 'down' ? 'down' : 'up';
runMigrations(direction);