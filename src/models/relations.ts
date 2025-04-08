import ApiKey from './ApiKey';
import PaymentProvider from './PaymentProvider';
import Role from './Role';
import Transaction from './Transaction';
import User from './User';
import UserProvider from './UserProvider';

export const defineRelations = (): void => {
  // Define associations
  User.belongsTo(Role, { foreignKey: 'roleId' });
  Role.hasMany(User, { foreignKey: 'roleId' });

  User.hasMany(ApiKey, { foreignKey: 'userId' });
  ApiKey.belongsTo(User, { foreignKey: 'userId' });

  User.hasMany(Transaction, { foreignKey: 'userId' });
  Transaction.belongsTo(User, { foreignKey: 'userId' });

  PaymentProvider.hasMany(Transaction, { foreignKey: 'providerId' });
  Transaction.belongsTo(PaymentProvider, { foreignKey: 'providerId' });

  // Many-to-Many relationship between User and PaymentProvider
  User.belongsToMany(PaymentProvider, {
    through: UserProvider,
    foreignKey: 'userId',
    otherKey: 'providerId',
  });
  PaymentProvider.belongsToMany(User, {
    through: UserProvider,
    foreignKey: 'providerId',
    otherKey: 'userId',
  });

  // Additional associations for UserProvider
  UserProvider.belongsTo(User, { foreignKey: 'userId' });
  UserProvider.belongsTo(PaymentProvider, { foreignKey: 'providerId' });
};

defineRelations();
