import { DataTypes, Model } from 'sequelize';
import { IPaymentProvider, IPaymentProviderCreate } from '../interfaces';
import sequelize from './index';

interface PaymentProviderModel extends Model<IPaymentProvider, IPaymentProviderCreate>, IPaymentProvider {}

const PaymentProvider = sequelize.define<PaymentProviderModel>(
  'PaymentProvider',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('stripe', 'conekta'),
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    config: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {},
    },
  },
  {
    tableName: 'payment_providers',
  },
);

export default PaymentProvider;
