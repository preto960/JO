import { DataSource } from "typeorm";
import { AppDataSource } from "../config/database";
import { User, Plugin, Session, Purchase, Review, PluginAnalytics, Transaction, Profile } from "../entities";

const resetDatabase = async () => {
  try {
    console.log("🔄 Connecting to database...");
    
    // Create a temporary data source with synchronize enabled for reset
    const tempDataSource = new DataSource({
      ...AppDataSource.options,
      synchronize: true
    });
    
    await tempDataSource.initialize();
    
    console.log("⚠️  WARNING: This will drop all tables and recreate them!");
    console.log("📋 Tables to be dropped:");
    console.log("   - users");
    console.log("   - profiles");
    console.log("   - plugins");
    console.log("   - sessions");
    console.log("   - purchases");
    console.log("   - reviews");
    console.log("   - plugin_analytics");
    console.log("   - transactions");
    
    // Drop all tables
    console.log("\n🗑️  Dropping all tables...");
    await tempDataSource.dropDatabase();
    
    // Synchronize schema (create all tables)
    console.log("🏗️  Creating tables from entities...");
    await tempDataSource.synchronize(true);
    
    console.log("\n✅ Database reset completed successfully!");
    console.log("📊 New tables created:");
    
    // List all tables
    const tableNames = ["users", "profiles", "plugins", "sessions", "purchases", "reviews", "plugin_analytics", "transactions"];
    tableNames.forEach(table => {
      console.log(`   ✅ ${table}`);
    });
    
    console.log("\n🎯 Backend database is ready for use!");
    
    await tempDataSource.destroy();
    
  } catch (error) {
    console.error("❌ Error resetting database:", error);
    process.exit(1);
  }
};

// Run if called directly
if (require.main === module) {
  resetDatabase();
}

export default resetDatabase;
