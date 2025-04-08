import { DataTypes, Model } from 'sequelize';
import { IRole, IRoleCreate } from '../interfaces';
import sequelize from './index';

interface RoleModel extends Model<IRole, IRoleCreate>, IRole {}

const Role = sequelize.define<RoleModel>(
  'Role',
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
    permissions: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      defaultValue: [],
    },
  },
  {
    tableName: 'roles',
  },
);

export default Role;
