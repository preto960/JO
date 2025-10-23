import { MigrationInterface, QueryRunner } from "typeorm";

export class MakeAuthorIdNullable1737595436000 implements MigrationInterface {
    name = 'MakeAuthorIdNullable1737595436000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "publisher_plugins" 
            ALTER COLUMN "author_id" DROP NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "publisher_plugins" 
            ALTER COLUMN "author_id" SET NOT NULL
        `);
    }
}