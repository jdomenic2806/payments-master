import { DataTypes, Model } from 'sequelize';
import { IUser, IUserCreate } from '../interfaces';
import sequelize from './index';

interface UserModel extends Model<IUser, IUserCreate>, IUser {}

const User = sequelize.define<UserModel>(
  'User',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    roleId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    tableName: 'users',
  },
);

export default User;
