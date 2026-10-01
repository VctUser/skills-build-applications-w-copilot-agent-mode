import { randomBytes, scryptSync } from 'node:crypto';
import mongoose from 'mongoose';
import Activity from '../models/Activity.js';
import LeaderboardEntry from '../models/LeaderboardEntry.js';
import Team from '../models/Team.js';
import User from '../models/User.js';
import Workout from '../models/Workout.js';

const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';
const upsertOptions = { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true };

/**
 * Seed the octofit_db database with test data
 */
async function seedDatabase() {
  try {
    await mongoose.connect(connectionString);

    console.log('Connected to octofit_db');

    const userSeeds = [
      { username: 'maya.chen', email: 'maya.chen@example.test', displayName: 'Maya Chen' },
      { username: 'leo.martinez', email: 'leo.martinez@example.test', displayName: 'Leo Martinez' },
      { username: 'amara.johnson', email: 'amara.johnson@example.test', displayName: 'Amara Johnson' },
      { username: 'sam.patel', email: 'sam.patel@example.test', displayName: 'Sam Patel' },
    ];
    const users = (
      await Promise.all(
        userSeeds.map((user) => {
          const salt = randomBytes(16);
          const passwordHash = `scrypt$${salt.toString('hex')}$${scryptSync(
            'octofit-demo-password',
            salt,
            64,
          ).toString('hex')}`;

          return User.findOneAndUpdate(
            { username: user.username },
            { $set: { ...user, passwordHash } },
            upsertOptions,
          );
        }),
      )
    ).map((user) => {
      if (!user) {
        throw new Error('Failed to upsert a seeded user');
      }
      return user;
    });

    await Promise.all([
      Team.findOneAndUpdate(
        { name: 'Trail Blazers' },
        { $set: { name: 'Trail Blazers', members: [users[0]._id, users[1]._id] } },
        upsertOptions,
      ),
      Team.findOneAndUpdate(
        { name: 'Power Crew' },
        { $set: { name: 'Power Crew', members: [users[2]._id, users[3]._id] } },
        upsertOptions,
      ),
    ]);

    const activitySeeds = [
      { user: users[0]._id, activityType: 'running', durationMinutes: 32, distanceKm: 5, points: 52, completedAt: new Date('2026-09-28T15:30:00Z') },
      { user: users[0]._id, activityType: 'walking', durationMinutes: 36, distanceKm: 2.4, points: 18, completedAt: new Date('2026-09-30T16:00:00Z') },
      { user: users[1]._id, activityType: 'walking', durationMinutes: 60, distanceKm: 4, points: 30, completedAt: new Date('2026-09-29T15:00:00Z') },
      { user: users[1]._id, activityType: 'strength-training', durationMinutes: 45, points: 45, completedAt: new Date('2026-09-30T17:00:00Z') },
      { user: users[2]._id, activityType: 'running', durationMinutes: 38, distanceKm: 6, points: 60, completedAt: new Date('2026-09-29T14:30:00Z') },
      { user: users[2]._id, activityType: 'strength-training', durationMinutes: 40, points: 40, completedAt: new Date('2026-09-30T15:30:00Z') },
      { user: users[3]._id, activityType: 'walking', durationMinutes: 50, distanceKm: 3.5, points: 25, completedAt: new Date('2026-09-30T14:00:00Z') },
    ];
    await Promise.all(
      activitySeeds.map((activity) =>
        Activity.findOneAndUpdate(
          { user: activity.user, completedAt: activity.completedAt },
          { $set: activity },
          upsertOptions,
        ),
      ),
    );

    const leaderboardSeeds = [
      { user: users[2]._id, points: 100, rank: 1 },
      { user: users[1]._id, points: 75, rank: 2 },
      { user: users[0]._id, points: 70, rank: 3 },
      { user: users[3]._id, points: 25, rank: 4 },
    ];
    await Promise.all(
      leaderboardSeeds.map((entry) =>
        LeaderboardEntry.findOneAndUpdate({ user: entry.user }, { $set: entry }, upsertOptions),
      ),
    );

    const workoutSeeds = [
      { title: 'Easy 5K Builder', description: 'A steady run with a relaxed finish.', activityType: 'running', difficulty: 'beginner', durationMinutes: 35 },
      { title: 'Hill Intervals', description: 'Short uphill efforts with a walk back recovery.', activityType: 'running', difficulty: 'intermediate', durationMinutes: 30 },
      { title: 'Full-Body Basics', description: 'Bodyweight squats, push-ups, and planks.', activityType: 'strength-training', difficulty: 'beginner', durationMinutes: 25 },
      { title: 'Brisk Lunch Walk', description: 'A purposeful walk at a conversational pace.', activityType: 'walking', difficulty: 'beginner', durationMinutes: 30 },
    ];
    await Promise.all(
      workoutSeeds.map((workout) =>
        Workout.findOneAndUpdate({ title: workout.title }, { $set: workout }, upsertOptions),
      ),
    );

    const [userCount, teamCount, activityCount, leaderboardCount, workoutCount] = await Promise.all([
      User.countDocuments(),
      Team.countDocuments(),
      Activity.countDocuments(),
      LeaderboardEntry.countDocuments(),
      Workout.countDocuments(),
    ]);
    console.log('Database seeding complete', {
      users: userCount,
      teams: teamCount,
      activities: activityCount,
      leaderboard: leaderboardCount,
      workouts: workoutCount,
    });
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seedDatabase();
