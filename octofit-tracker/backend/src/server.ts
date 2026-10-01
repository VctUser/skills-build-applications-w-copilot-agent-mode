import express from 'express';
import type { NextFunction, Request, Response } from 'express';
import db from './config/database.js';
import apiRoutes from './routes/index.js';

const app = express();
const port = 8000;
const codespaceName = process.env.CODESPACE_NAME;
const apiBaseUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : 'http://localhost:8000';

app.use(express.json());
app.use('/api', apiRoutes);

app.get('/api/health', (_request, response) => {
  response.json({
    status: 'ok',
    database: db.readyState === 1 ? 'connected' : 'disconnected',
    apiBaseUrl,
  });
});

app.use((error: unknown, _request: Request, response: Response, _next: NextFunction) => {
  console.error('API request failed:', error);
  response.status(500).json({ error: 'Internal server error' });
});

app.listen(port, () => {
  console.log(`OctoFit API listening on port ${port}`);
});