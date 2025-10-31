import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class UpdatePermissionsForPlugins1234567890000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // 1. Agregar nuevas columnas primero
        await queryRunner.addColumn('permissions', new TableColumn({
            name: 'pluginId',
            type: 'varchar',
            isNullable: true
        }));

        await queryRunner.addColumn('permissions', new TableColumn({
            name: 'isDynamic',
            type: 'boolean',
            default: false
        }));

        await queryRunner.addColumn('permissions', new TableColumn({
            name: 'resourceLabel',
            type: 'varchar',
            isNullable: true
        }));

        await queryRunner.addColumn('permissions', new TableColumn({
            name: 'resourceDescription',
            type: 'varchar',
            isNullable: true
        }));

        // 2. Crear una columna temporal para resource
        await queryRunner.addColumn('permissions', new TableColumn({
            name: 'resource_temp',
            type: 'varchar',
            length: '255',
            isNullable: true
        }));

        // 3. Copiar los valores del enum a la columna temporal
        await queryRunner.query(`
            UPDATE permissions 
            SET resource_temp = resource::text
        `);

        // 4. Eliminar la columna resource antigua (enum)
        await queryRunner.dropColumn('permissions', 'resource');

        // 5. Renombrar resource_temp a resource
        await queryRunner.renameColumn('permissions', 'resource_temp', 'resource');

        // 6. Hacer la columna NOT NULL ahora que tiene valores
        await queryRunner.query(`
            ALTER TABLE permissions 
            ALTER COLUMN resource SET NOT NULL
        `);

        // 7. Crear índice para pluginId
        await queryRunner.query(`
            CREATE INDEX "IDX_permissions_pluginId" ON "permissions" ("pluginId")
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Revertir cambios
        await queryRunner.query(`DROP INDEX "IDX_permissions_pluginId"`);
        
        await queryRunner.dropColumn('permissions', 'resourceDescription');
        await queryRunner.dropColumn('permissions', 'resourceLabel');
        await queryRunner.dropColumn('permissions', 'isDynamic');
        await queryRunner.dropColumn('permissions', 'pluginId');

        // Recrear enum y columna resource (esto es complicado, mejor no revertir)
        // En producción, las migraciones normalmente no se revierten
    }
}

