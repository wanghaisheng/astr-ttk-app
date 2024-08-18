import { PrismaClient } from '@prisma/client';
import type { Hashtag as PrismaHashtag, Trend as PrismaTrend } from '@prisma/client';

// Initialize Prisma Client
const prisma = new PrismaClient();

// Define TypeScript types
type PointInHashtagTrend = {
  time: number;
  value: number;
};

type Hashtag = PrismaHashtag & {
  trend: PointInHashtagTrend[];
};

// Function to get hashtags for a specific country
export async function getHashtagsForCountry(countryCode: string): Promise<Hashtag[]> {
  const hashtags = await prisma.hashtag.findMany({
    where: {
      latestTrending: true,
      countryCode: countryCode
    },
    orderBy: {
      rank: 'asc'
    },
    include: {
      trend: true
    }
  });

  return processHashtags(hashtags);
}

// Function to get a shuffled list of hashtags
export async function getAllHashtags(): Promise<Hashtag[]> {
  const hashtags = await prisma.hashtag.findMany({
    where: {
      latestTrending: true
    },
    include: {
      trend: true
    }
  });

  shuffleArray(hashtags);

  return processHashtags(hashtags.slice(0, 20));
}

// Helper function to process hashtags
function processHashtags(hashtags: PrismaHashtag[]): Hashtag[] {
  return hashtags.map((hashtag) => ({
    ...hashtag,
    views: BigInt(hashtag.views),
    trend: hashtag.trend.map((point: PrismaTrend) => ({
      time: point.time,
      value: point.value * 100,
    })),
  }));
}

// Helper function to shuffle an array
function shuffleArray(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
