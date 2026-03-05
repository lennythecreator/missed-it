import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import MissedGoal from '@/models/MissedGoal';

export async function GET() {
  try {
    await connectToDatabase();
    const missedGoals = await MissedGoal.find({}).sort({ date: -1 });
    return NextResponse.json(missedGoals);
  } catch (error) {
    console.error('GET /api/missed-goals failed:', error);
    return NextResponse.json({ error: 'Failed to fetch missed goals' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { user, points, date, link } = await request.json();
    await connectToDatabase();
    const newMissedGoal = new MissedGoal({
      user,
      points: points || 1,
      date: date || new Date(),
      link,
    });
    await newMissedGoal.save();
    return NextResponse.json(newMissedGoal, { status: 201 });
  } catch (error) {
    console.error('POST /api/missed-goals failed:', error);
    return NextResponse.json({ error: 'Failed to create missed goal' }, { status: 500 });
  }
}
