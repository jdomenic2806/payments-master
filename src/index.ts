import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import routes from './routes';
import sequelize from './models';
import { defineRelations } from './models/relations';
import User from './models/User';
import Role from './models/Role';

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Routes
app.use('/api', routes);

// Error handling
// app.use((err: Error, req: express.Request, res: express.Response) => {
//   console.error(err.stack);
//   res.status(500).json({ error: 'Something broke!' });
// });

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    // Define database relations
    defineRelations();

    // Only check database connection
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');

    // Sync models with the database
    sequelize
      .sync({ alter: true })
      .then(() => console.log('Relaciones configuradas correctamente.'))
      .catch((err: any) => console.log(`Error al sincronizar relaciones ${err.message} `));

    console.log('User associations:', Object.keys(User.associations));
    console.log('Role associations:', Object.keys(Role.associations));

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
    process.exit(1);
  }
}

startServer();
