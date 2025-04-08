import { Sequelize } from 'sequelize';
import config from '../config/database';

const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  port: config.port ? parseInt(config.port, 10) : undefined,
  dialect: 'postgres',
  logging: false,
});

export default sequelize;
