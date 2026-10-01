import { Router, type RequestHandler } from 'express';
import type { Model } from 'mongoose';
import Activity from '../models/Activity.js';
import LeaderboardEntry from '../models/LeaderboardEntry.js';
import Team from '../models/Team.js';
import User from '../models/User.js';
import Workout from '../models/Workout.js';

const router = Router();

function listDocuments<T>(collection: Model<T>): RequestHandler {
  return async (_request, response, next) => {
    try {
      response.json(await collection.find().lean());
    } catch (error) {
      next(error);
    }
  };
}

router.get('/users/', listDocuments(User));
router.get('/teams/', listDocuments(Team));
router.get('/activities/', listDocuments(Activity));
router.get('/leaderboard/', listDocuments(LeaderboardEntry));
router.get('/workouts/', listDocuments(Workout));

export default router;