/**
 * Database Migration Preparation Layer (PostgreSQL / Supabase Schema Definition)
 * Ready for future cloud database integration.
 */

export interface DbSchemaConfig {
  version: string;
  dialect: "postgresql" | "sqlite";
  tables: {
    users: string;
    games: string;
    favorites: string;
    reviews: string;
    analytics: string;
  };
}

export const DB_MIGRATION_CONFIG: DbSchemaConfig = {
  version: "1.0.0",
  dialect: "postgresql",
  tables: {
    users: `
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        display_name VARCHAR(100),
        role VARCHAR(20) DEFAULT 'user',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `,
    games: `
      CREATE TABLE IF NOT EXISTS games (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        slug VARCHAR(100) UNIQUE NOT NULL,
        title VARCHAR(255) NOT NULL,
        author VARCHAR(255) NOT NULL,
        repository_url TEXT NOT NULL,
        license VARCHAR(50) NOT NULL,
        category VARCHAR(50) NOT NULL,
        plays_count INT DEFAULT 0,
        rating FLOAT DEFAULT 5.0,
        commercial_ready BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `,
    favorites: `
      CREATE TABLE IF NOT EXISTS favorites (
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        game_id UUID REFERENCES games(id) ON DELETE CASCADE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        PRIMARY KEY (user_id, game_id)
      );
    `,
    reviews: `
      CREATE TABLE IF NOT EXISTS reviews (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        game_id UUID REFERENCES games(id) ON DELETE CASCADE,
        rating INT CHECK (rating >= 1 AND rating <= 5),
        comment TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `,
    analytics: `
      CREATE TABLE IF NOT EXISTS analytics (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        event_type VARCHAR(50) NOT NULL,
        game_id UUID REFERENCES games(id),
        metadata JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `,
  },
};
