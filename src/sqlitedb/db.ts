import { PrismaClient } from '@prisma/client';
import { Hashtag } from '@prisma/client';

const prisma = new PrismaClient();

export async function getHashtagsForCountry(countryCode: string): Promise<Hashtag[]> {
  const hashtags = await prisma.hashtag.findMany({
    where: {
      latestTrending: true,
      countryCode: countryCode
    },
    orderBy: {
      rank: 'asc'
    }
  });

  return processHashtags(hashtags);
}

export async function getAllHashtags(): Promise<Hashtag[]> {
  const hashtags = await prisma.hashtag.findMany({
    where: {
      latestTrending: true
    }
  });

  shuffleArray(hashtags);

  return processHashtags(hashtags.slice(0, 20));
}

function processHashtags(hashtags: Hashtag[]): Hashtag[] {
  return hashtags.map((hashtag) => ({
    ...hashtag,
    views: BigInt(hashtag.views as any),
    trend: hashtag.trend.map((point) => ({
      time: point.time,
      value: point.value * 100,
    })),
  }));
}

function shuffleArray(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
