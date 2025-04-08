import { DataTypes, Model } from 'sequelize';
import sequelize from './index';

interface IProviderConfig {
  id: string;
  defaultProvider: 'stripe' | 'conekta';
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ProviderConfigModel extends Model<IProviderConfig>, IProviderConfig {}

const ProviderConfig = sequelize.define<ProviderConfigModel>(
  'ProviderConfig',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    defaultProvider: {
      type: DataTypes.ENUM('stripe', 'conekta'),
      allowNull: false,
      defaultValue: 'stripe',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    tableName: 'provider_configs',
  },
);

export default ProviderConfig;
