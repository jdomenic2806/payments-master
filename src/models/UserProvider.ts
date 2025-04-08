import { DataTypes, Model } from 'sequelize';
import { IUserProvider, IUserProviderCreate } from '../interfaces';
import sequelize from './index';
import User from './User';
import PaymentProvider from './PaymentProvider';

interface UserProviderModel extends Model<IUserProvider, IUserProviderCreate>, IUserProvider {}

const UserProvider = sequelize.define<UserProviderModel>(
  'UserProvider',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    providerId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: PaymentProvider,
        key: 'id',
      },
    },
    priority: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    tableName: 'user_providers',
  },
);

export default UserProvider;
