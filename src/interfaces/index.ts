// Base interfaces for timestamps
export interface ITimestamps {
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUser extends ITimestamps {
  id: string;
  email: string;
  password: string;
  roleId: string;
}

export interface IUserCreate extends Omit<IUser, keyof ITimestamps> {}

export interface IRole extends ITimestamps {
  id: string;
  name: string;
  permissions: string[];
}

export interface IRoleCreate extends Omit<IRole, keyof ITimestamps> {}

export interface IPermission extends ITimestamps {
  id: string;
  name: string;
  description: string;
}

export interface IPermissionCreate extends Omit<IPermission, keyof ITimestamps> {}

export interface IApiKey extends ITimestamps {
  id: string;
  key: string;
  userId: string;
  isActive: boolean;
  lastUsed?: Date;
}

export interface IApiKeyCreate extends Omit<IApiKey, keyof ITimestamps> {}

export interface IPaymentProvider extends ITimestamps {
  id: string;
  name: string;
  type: 'stripe' | 'conekta';
  isActive: boolean;
  config: Record<string, unknown>;
}

export interface IPaymentProviderCreate extends Omit<IPaymentProvider, keyof ITimestamps> {}

export interface ITransaction extends ITimestamps {
  id: string;
  userId: string;
  providerId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  paymentMethod: string;
  metadata: Record<string, unknown>;
}

export interface ITransactionCreate extends Omit<ITransaction, 'id' | keyof ITimestamps> {}

export interface IUserProvider extends ITimestamps {
  id: string;
  userId: string;
  providerId: string;
  priority: number;
  isActive: boolean;
}

export interface IUserProviderCreate extends Omit<IUserProvider, 'id' | keyof ITimestamps> {}

export interface PaymentProcessorOptions {
  amount: number;
  currency: string;
  paymentMethod: string;
}

// export interface IGetUserAuthInfoRequest extends Request {
//   user?: any;
// }
