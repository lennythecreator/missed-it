import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import MissedGoal from '@/models/MissedGoal';

export async function GET() {
  try {
    await connectToDatabase();
    const stats = await MissedGoal.aggregate([
      {
        $group: {
          _id: '$user',
          totalMissed: { $sum: 1 },
          totalPoints: { $sum: '$points' },
        },
      },
      { $sort: { totalMissed: -1 } },
    ]);
    return NextResponse.json(stats);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 });
  }
}
