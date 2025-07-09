import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

app.use(express.json({limit: "16kb"}));
app.use(express.urlencoded({limit: "16kb", extended: true}));
app.use(cookieParser());
app.use(
    cors({
        origin: ["http://localhost:3000", "http://localhost:3001"],
        credentials: true
    })
)
app.use(express.static("public"));

import userRoutes from './routes/user.routes.js';
import agentRoutes from './routes/agent.routes.js';
import taskRoutes from './routes/task.routes.js';


app.use('/api/v1/users', userRoutes);
app.use('/api/v1/agents', agentRoutes);
app.use('/api/v1/tasks', taskRoutes);

export {app}