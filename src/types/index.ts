// export interface User {
//   id: string;
//   email: string;
//   password: string;
//   roleId: string;
//   createdAt: Date;
//   updatedAt: Date;
// }

// export interface Role {
//   id: string;
//   name: string;
//   permissions: string[];
//   createdAt: Date;
//   updatedAt: Date;
// }

// export interface Permission {
//   id: string;
//   name: string;
//   description: string;
//   createdAt: Date;
//   updatedAt: Date;
// }

// export interface ApiKey {
//   id: string;
//   key: string;
//   userId: string;
//   isActive: boolean;
//   lastUsed: Date;
//   createdAt: Date;
//   updatedAt: Date;
// }

// export interface PaymentProvider {
//   id: string;
//   name: string;
//   type: 'stripe' | 'conekta';
//   isActive: boolean;
//   config: Record<string, unknown>;
//   createdAt: Date;
//   updatedAt: Date;
// }

// export interface Transaction {
//   id: string;
//   userId: string;
//   providerId: string;
//   amount: number;
//   currency: string;
//   status: 'pending' | 'completed' | 'failed';
//   paymentMethod: string;
//   metadata: Record<string, unknown>;
//   createdAt: Date;
//   updatedAt: Date;
// }

// export interface PaymentProcessorOptions {
//   amount: number;
//   currency: string;
//   paymentMethod: string;
// }
