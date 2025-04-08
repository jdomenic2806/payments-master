import { DataTypes, Model } from 'sequelize';
import { IPermission, IPermissionCreate } from '../interfaces';
import sequelize from './index';

interface PermissionModel extends Model<IPermission, IPermissionCreate>, IPermission {}

const Permission = sequelize.define<PermissionModel>(
  'Permission',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    tableName: 'permissions',
  },
);

export default Permission;
