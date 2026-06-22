import express, { Application, Request, Response, NextFunction } from 'express';
import { config } from './config';

const app: Application = express();


app.use(express.json());

app.get('/health', (_req: Request, res: Response, _next: NextFunction) => {
    console.log("I'm alive!");
    res.status(200).json({
        status: "ok" as const,
        version: '1.0.0',
        uptime_seconds: Math.floor(process.uptime()),
        timestamp: new Date().toISOString()
    });
})

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Internal Server Error'
  });
});

app.listen(config.PORT, () => {
  console.log(`Server is running on http://localhost:${config.PORT}`);
});