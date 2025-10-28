import { AppDataSource } from '../config/database';
import { InstalledPlugin } from '../models/InstalledPlugin';
import path from 'path';
import fs from 'fs/promises';

/**
 * Servicio para manejar las operaciones de base de datos de los plugins
 */
export class PluginDatabaseService {
  /**
   * Crea las tablas necesarias para un plugin
   */
  async createPluginTables(plugin: InstalledPlugin, pluginDir: string): Promise<void> {
    console.log(`🗄️  Creating database tables for plugin ${plugin.name}`);

    // Para Task Manager, crear las tablas manualmente
    if (plugin.slug === 'task-manager') {
      await this.createTaskManagerTables();
      return;
    }

    // Para otros plugins, intentar crear desde los modelos
    console.log(`⚠️  Generic table creation not yet implemented for ${plugin.name}`);
  }

  /**
   * Crea las tablas específicas del plugin Task Manager
   */
  private async createTaskManagerTables(): Promise<void> {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();

    try {
      // Crear tabla plugin_task_categories
      const categoriesTableExists = await queryRunner.hasTable('plugin_task_categories');
      if (!categoriesTableExists) {
        console.log('  ✓ Creating table: plugin_task_categories');
        await queryRunner.query(`
          CREATE TABLE "plugin_task_categories" (
            "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
            "name" varchar NOT NULL,
            "description" varchar,
            "color" varchar DEFAULT '#3B82F6',
            "icon" varchar,
            "position" integer DEFAULT 0,
            "isActive" boolean DEFAULT true,
            "createdAt" timestamp DEFAULT now(),
            "updatedAt" timestamp DEFAULT now()
          )
        `);
        console.log('    ✓ Table plugin_task_categories created');

        // Insertar categorías por defecto
        await queryRunner.query(`
          INSERT INTO "plugin_task_categories" ("name", "description", "color", "icon", "position")
          VALUES
            ('Personal', 'Personal tasks and reminders', '#3B82F6', '👤', 0),
            ('Work', 'Work-related tasks', '#10B981', '💼', 1),
            ('Urgent', 'Urgent and important tasks', '#EF4444', '🚨', 2),
            ('Ideas', 'Ideas and future projects', '#8B5CF6', '💡', 3)
        `);
        console.log('    ✓ Default categories inserted');
      } else {
        console.log('  ✓ Table plugin_task_categories already exists');
      }

      // Crear tabla plugin_tasks
      const tasksTableExists = await queryRunner.hasTable('plugin_tasks');
      if (!tasksTableExists) {
        console.log('  ✓ Creating table: plugin_tasks');
        await queryRunner.query(`
          CREATE TABLE "plugin_tasks" (
            "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
            "title" varchar NOT NULL,
            "description" text,
            "status" varchar DEFAULT 'TODO',
            "priority" varchar DEFAULT 'MEDIUM',
            "categoryId" uuid,
            "assignedToId" varchar,
            "createdById" varchar,
            "dueDate" timestamp,
            "startDate" timestamp,
            "completedAt" timestamp,
            "estimatedHours" integer DEFAULT 0,
            "actualHours" integer DEFAULT 0,
            "tags" text,
            "position" integer DEFAULT 0,
            "isArchived" boolean DEFAULT false,
            "createdAt" timestamp DEFAULT now(),
            "updatedAt" timestamp DEFAULT now(),
            CONSTRAINT "FK_plugin_tasks_category" FOREIGN KEY ("categoryId") 
              REFERENCES "plugin_task_categories"("id") ON DELETE SET NULL
          )
        `);
        console.log('    ✓ Table plugin_tasks created');

        // Crear índices
        await queryRunner.query(`
          CREATE INDEX "IDX_plugin_tasks_status" ON "plugin_tasks" ("status")
        `);
        await queryRunner.query(`
          CREATE INDEX "IDX_plugin_tasks_priority" ON "plugin_tasks" ("priority")
        `);
        await queryRunner.query(`
          CREATE INDEX "IDX_plugin_tasks_categoryId" ON "plugin_tasks" ("categoryId")
        `);
        await queryRunner.query(`
          CREATE INDEX "IDX_plugin_tasks_assignedToId" ON "plugin_tasks" ("assignedToId")
        `);
        await queryRunner.query(`
          CREATE INDEX "IDX_plugin_tasks_createdById" ON "plugin_tasks" ("createdById")
        `);
        console.log('    ✓ Indexes created');

        // Insertar tareas de ejemplo
        await queryRunner.query(`
          INSERT INTO "plugin_tasks" ("title", "description", "status", "priority", "categoryId")
          SELECT 
            'Welcome to Task Manager!',
            'This is your first task. You can edit or delete it.',
            'TODO',
            'HIGH',
            id
          FROM "plugin_task_categories"
          WHERE "name" = 'Personal'
          LIMIT 1
        `);
        console.log('    ✓ Sample task inserted');
      } else {
        console.log('  ✓ Table plugin_tasks already exists');
      }

      console.log('✅ Task Manager tables created successfully');
    } catch (error: any) {
      console.error('❌ Failed to create Task Manager tables:', error.message);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Elimina las tablas de un plugin
   */
  async dropPluginTables(plugin: InstalledPlugin): Promise<void> {
    console.log(`🗑️  Dropping database tables for plugin ${plugin.name}`);

    if (plugin.slug === 'task-manager') {
      await this.dropTaskManagerTables();
      return;
    }

    console.log(`⚠️  Generic table dropping not yet implemented for ${plugin.name}`);
  }

  /**
   * Elimina las tablas del plugin Task Manager
   */
  private async dropTaskManagerTables(): Promise<void> {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();

    try {
      // Eliminar en orden inverso por las foreign keys
      await queryRunner.query(`DROP TABLE IF EXISTS "plugin_tasks" CASCADE`);
      console.log('  ✓ Table plugin_tasks dropped');

      await queryRunner.query(`DROP TABLE IF EXISTS "plugin_task_categories" CASCADE`);
      console.log('  ✓ Table plugin_task_categories dropped');

      console.log('✅ Task Manager tables dropped successfully');
    } catch (error: any) {
      console.error('❌ Failed to drop Task Manager tables:', error.message);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Verifica si las tablas de un plugin existen
   */
  async pluginTablesExist(plugin: InstalledPlugin): Promise<boolean> {
    if (plugin.slug === 'task-manager') {
      const queryRunner = AppDataSource.createQueryRunner();
      await queryRunner.connect();

      try {
        const tasksExists = await queryRunner.hasTable('plugin_tasks');
        const categoriesExists = await queryRunner.hasTable('plugin_task_categories');
        return tasksExists && categoriesExists;
      } finally {
        await queryRunner.release();
      }
    }

    return false;
  }
}

export const pluginDatabaseService = new PluginDatabaseService();

