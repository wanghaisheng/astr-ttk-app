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
  try {
    const hashtags = await prisma.hashtag.findMany({
      where: {
        latestTrending: true,
        countryCode: countryCode,
      },
      orderBy: {
        rank: 'asc',
      },
      include: {
        trend: true,
      },
    });

    return processHashtags(hashtags);
  } catch (error) {
    console.error('Error fetching hashtags for country:', error);
    throw error;
  }
}

// Function to get a shuffled list of hashtags
export async function getAllHashtags(): Promise<Hashtag[]> {
  try {
    const hashtags = await prisma.hashtag.findMany({
      where: {
        latestTrending: true,
      },
      include: {
        trend: true,
      },
    });

    shuffleArray(hashtags);

    return processHashtags(hashtags.slice(0, 20));
  } catch (error) {
    console.error('Error fetching all hashtags:', error);
    throw error;
  }
}

// Helper function to process hashtags
function processHashtags(hashtags: (PrismaHashtag & { trend: PrismaTrend[] })[]): Hashtag[] {
  return hashtags.map((hashtag) => ({
    ...hashtag,
    views: BigInt(hashtag.views), // Ensure `views` is a property of `Hashtag`
    trend: hashtag.trend.map((point) => ({
      time: point.time,
      value: point.value * 100, // Assuming `value` needs to be scaled
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
