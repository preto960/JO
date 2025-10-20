import { DataSource } from "typeorm";
import { AppDataSource } from "../config/database";
import { User, Plugin, Session, Purchase, Review, PluginAnalytics, Transaction } from "../entities";

const resetDatabase = async () => {
  try {
    console.log("🔄 Connecting to database...");
    await AppDataSource.initialize();
    
    console.log("⚠️  WARNING: This will drop all tables and recreate them!");
    console.log("📋 Tables to be dropped:");
    console.log("   - users");
    console.log("   - plugins");
    console.log("   - sessions");
    console.log("   - purchases");
    console.log("   - reviews");
    console.log("   - plugin_analytics");
    console.log("   - transactions");
    
    // Drop all tables
    console.log("\n🗑️  Dropping all tables...");
    await AppDataSource.dropDatabase();
    
    // Synchronize schema (create all tables)
    console.log("🏗️  Creating tables from entities...");
    await AppDataSource.synchronize(true);
    
    console.log("\n✅ Database reset completed successfully!");
    console.log("📊 New tables created:");
    
    // List all tables
    const tableNames = ["users", "plugins", "sessions", "purchases", "reviews", "plugin_analytics", "transactions"];
    tableNames.forEach(table => {
      console.log(`   ✅ ${table}`);
    });
    
    console.log("\n🎯 Backend database is ready for use!");
    
  } catch (error) {
    console.error("❌ Error resetting database:", error);
    process.exit(1);
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }
};

// Run if called directly
if (require.main === module) {
  resetDatabase();
}

export default resetDatabase;
