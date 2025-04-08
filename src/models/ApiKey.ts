import { DataTypes, Model } from 'sequelize';
import { IApiKey, IApiKeyCreate } from '../interfaces';
import sequelize from './index';

interface ApiKeyModel extends Model<IApiKey, IApiKeyCreate>, IApiKey {
  User:
    | {
        Role: any;
        roleId: any;
        id: string;
      }
    | undefined;
}

const ApiKey = sequelize.define<ApiKeyModel>(
  'ApiKey',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    key: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    lastUsed: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: 'api_keys',
  },
);

export default ApiKey;
