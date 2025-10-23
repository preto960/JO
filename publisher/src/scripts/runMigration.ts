import { PublisherDataSource } from '../config/database';
import { createConnection } from 'typeorm';

async function runMigration() {
    try {
        console.log('🔄 Running migration to make author_id nullable...');
        
        // Initialize database connection
        if (!PublisherDataSource.isInitialized) {
            await PublisherDataSource.initialize();
        }

        const queryRunner = PublisherDataSource.createQueryRunner();

        try {
            await queryRunner.connect();
            await queryRunner.query(`
                ALTER TABLE "publisher_plugins" 
                ALTER COLUMN "author_id" DROP NOT NULL
            `);
            console.log('✅ Migration completed successfully!');
        } finally {
            await queryRunner.release();
        }

        // Close database connection
        if (PublisherDataSource.isInitialized) {
            await PublisherDataSource.destroy();
        }

    } catch (error: any) {
        console.error('❌ Error running migration:', error.message);
        process.exit(1);
    }
}

// Run if called directly
if (require.main === module) {
    runMigration();
}

export default runMigration;