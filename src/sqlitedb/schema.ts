import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// Define types
interface Hashtag {
  id: string;
  name: string;
  countryCode: string;
  posts: number;
  rank: number;
  latestTrending: boolean;
  views: bigint;
  isPromoted: boolean;
  trendingType: number;
  createdAt: Date;
}

interface Trend {
  id: number;
  hashtagId: string;
  time: number;
  value: number;
}

const DATABASE_FILE = './hashtags.db';

async function openDb() {
  return open({
    filename: DATABASE_FILE,
    driver: sqlite3.Database,
  });
}

async function setupDatabase() {
  const db = await openDb();

  // Create Hashtags table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS Hashtags (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      countryCode TEXT NOT NULL,
      posts INTEGER NOT NULL,
      rank INTEGER NOT NULL,
      latestTrending BOOLEAN NOT NULL,
      views INTEGER NOT NULL,
      isPromoted BOOLEAN NOT NULL,
      trendingType INTEGER NOT NULL,
      createdAt DATETIME NOT NULL
    );
  `);

  // Create Trends table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS Trends (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      hashtagId TEXT NOT NULL,
      time INTEGER NOT NULL,
      value INTEGER NOT NULL,
      FOREIGN KEY (hashtagId) REFERENCES Hashtags(id)
    );
  `);

  console.log('Database setup complete.');
}

async function insertHashtagsAndTrends() {
  const db = await openDb();

  // Insert Hashtags
  await db.run(`
    INSERT INTO Hashtags (id, name, countryCode, posts, rank, latestTrending, views, isPromoted, trendingType, createdAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    '9b62c08e-00c2-4066-a9b2-7f29144dbdaf', 'blizzard', 'US', 2251, 64, true, BigInt(15623315), false, 0, '2024-01-11T09:19:58.000Z'
  ]);

  await db.run(`
    INSERT INTO Hashtags (id, name, countryCode, posts, rank, latestTrending, views, isPromoted, trendingType, createdAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    '9927ad18-529f-44b1-ab4c-41f4dc05eeea', 'rainyday', 'US', 3107, 51, true, BigInt(9614128), false, 0, '2024-01-11T09:19:58.000Z'
  ]);

  // Insert Trends
  const trends: Trend[] = [
    { hashtagId: '9b62c08e-00c2-4066-a9b2-7f29144dbdaf', time: 1704326400, value: 29 },
    { hashtagId: '9b62c08e-00c2-4066-a9b2-7f29144dbdaf', time: 1704412800, value: 30 },
    { hashtagId: '9b62c08e-00c2-4066-a9b2-7f29144dbdaf', time: 1704499200, value: 30 },
    { hashtagId: '9b62c08e-00c2-4066-a9b2-7f29144dbdaf', time: 170458
