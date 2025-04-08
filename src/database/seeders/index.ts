import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import sequelize from '../../models';
import RoleModel from '../../models/Role';
import UserModel from '../../models/User';
import PaymentProviderModel from '../../models/PaymentProvider';
import ApiKeyModel from '../../models/ApiKey';
import PermissionModel from '../../models/Permission';
import { logger } from '../../utils/logger';

const seedDatabase = async () => {
  try {
    await sequelize.authenticate();
    logger.info('🔌 Database connection established successfully');

    // Create default permissions
    const permissions = [
      { name: 'manage_users', description: 'Create, update, and delete users' },
      { name: 'manage_providers', description: 'Manage payment providers' },
      { name: 'process_payment', description: 'Process payments' },
      { name: 'view_transactions', description: 'View payment transactions' },
      { name: 'manage_permissions', description: 'Manage permissions and roles' },
    ];

    logger.info('🔑 Creating default permissions');
    await Promise.all(
      permissions.map((permission) =>
        PermissionModel.create({
          id: uuidv4(),
          ...permission,
        }),
      ),
    );
    logger.info('✅ Default permissions created successfully');

    // Create admin role with all permissions
    logger.info('👑 Creating admin role');
    const adminRole = await RoleModel.create({
      id: uuidv4(),
      name: 'admin',
      permissions: permissions.map((p) => p.name),
    });
    logger.info('✅ Admin role created successfully', { roleId: adminRole.id });

    // Create client role with limited permissions
    logger.info('👤 Creating client role');
    const clientRole = await RoleModel.create({
      id: uuidv4(),
      name: 'client',
      permissions: ['process_payment', 'view_transactions'],
    });
    logger.info('✅ Client role created successfully', { roleId: clientRole.id });

    // Create admin user
    logger.info('👑 Creating admin user');
    const adminPassword = await bcrypt.hash('admin123', 10);
    const adminUser = await UserModel.create({
      id: uuidv4(),
      email: 'admin@example.com',
      password: adminPassword,
      roleId: adminRole.id,
    });
    logger.info('✅ Admin user created successfully', { userId: adminUser.id });

    // Create client user
    logger.info('👤 Creating client user');
    const clientPassword = await bcrypt.hash('client123', 10);
    const clientUser = await UserModel.create({
      id: uuidv4(),
      email: 'client@example.com',
      password: clientPassword,
      roleId: clientRole.id,
    });
    logger.info('✅ Client user created successfully', { userId: clientUser.id });

    // Create API keys for both users
    logger.info('🔑 Creating API keys');
    const adminApiKey = await ApiKeyModel.create({
      id: uuidv4(),
      key: `pk_${uuidv4().replace(/-/g, '')}`,
      userId: adminUser.id,
      isActive: true,
    });
    logger.info('✅ Admin API key created successfully', { apiKeyId: adminApiKey.id });

    const clientApiKey = await ApiKeyModel.create({
      id: uuidv4(),
      key: `pk_${uuidv4().replace(/-/g, '')}`,
      userId: clientUser.id,
      isActive: true,
    });
    logger.info('✅ Client API key created successfully', { apiKeyId: clientApiKey.id });

    // Create payment providers
    logger.info('💳 Creating payment providers');
    const stripeProvider = await PaymentProviderModel.create({
      id: uuidv4(),
      name: 'Stripe',
      type: 'stripe',
      isActive: true,
      config: {
        secretKey: process.env.STRIPE_SECRET_KEY,
        webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
      },
    });
    logger.info('✅ Stripe provider created successfully', { providerId: stripeProvider.id });

    const conektaProvider = await PaymentProviderModel.create({
      id: uuidv4(),
      name: 'Conekta',
      type: 'conekta',
      isActive: true,
      config: {
        secretKey: process.env.CONEKTA_SECRET_KEY,
        webhookSecret: process.env.CONEKTA_WEBHOOK_SECRET,
      },
    });
    logger.info('✅ Conekta provider created successfully', { providerId: conektaProvider.id });

    logger.info('🎉 Seed completed successfully!');
    logger.info('👥 Admin credentials:');
    logger.info('📧 Email: admin@example.com');
    logger.info('🔑 Password: admin123');
    logger.info('👥 Client credentials:');
    logger.info('📧 Email: client@example.com');
    logger.info('🔑 Password: client123');
  } catch (error) {
    console.log('error', error);
    logger.error('❌ Error seeding database:', error);
    throw error;
  }
};

// Run seeder
seedDatabase()
  .then(() => {
    logger.info('✨ Database seeding completed');
    process.exit(0);
  })
  .catch((error) => {
    logger.error('❌ Database seeding failed:', error);
    process.exit(1);
  });
