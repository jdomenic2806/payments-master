# Payment Gateway API Documentation

## Authentication

The API supports two authentication methods:
- JWT Token: Used for admin dashboard access
- API Key: Used for client applications

### Headers

For JWT authentication:
```
Authorization: Bearer <jwt_token>
```

For API Key authentication:
```
x-api-key: <api_key>
```

## Endpoints

### Authentication

#### Login
- **Method**: POST
- **URL**: `/api/auth/login`
- **Body**:
```json
{
  "email": "string",
  "password": "string"
}
```
- **Response**: Returns JWT token and user data

#### Register
- **Method**: POST
- **URL**: `/api/auth/register`
- **Auth**: API Key + `manage_users` permission
- **Body**:
```json
{
  "email": "string",
  "password": "string",
  "roleId": "uuid"
}
```

#### Get User Permissions
- **Method**: GET
- **URL**: `/api/auth/permissions`
- **Auth**: JWT Token
- **Response**: Returns user permissions

### Payments

#### Process Payment
- **Method**: POST
- **URL**: `/api/payments/process`
- **Auth**: API Key + `process_payment` permission
- **Body**:
```json
{
  "amount": "number",
  "currency": "string (3 letters)",
  "paymentMethod": "string",
  "provider": "stripe | conekta"
}
```

#### Check Payment Status
- **Method**: POST
- **URL**: `/api/payments/check`
- **Auth**: API Key
- **Body**:
```json
{
  "transactionId": "uuid"
}
```

#### Create Payment Intent
- **Method**: POST
- **URL**: `/api/payments/create-intent`
- **Auth**: API Key + `process_payment` permission
- **Body**:
```json
{
  "amount": "number",
  "currency": "string (3 letters)"
}
```

### Payment Providers

#### Get All Providers
- **Method**: GET
- **URL**: `/api/providers`
- **Auth**: JWT Token + `manage_providers` permission

#### Get Provider by ID
- **Method**: GET
- **URL**: `/api/providers/:id`
- **Auth**: JWT Token + `manage_providers` permission

#### Create Provider
- **Method**: POST
- **URL**: `/api/providers`
- **Auth**: JWT Token + `manage_providers` permission
- **Body**:
```json
{
  "name": "string",
  "type": "stripe | conekta",
  "config": "object"
}
```

#### Update Provider
- **Method**: PUT
- **URL**: `/api/providers/:id`
- **Auth**: JWT Token + `manage_providers` permission
- **Body**: Same as Create Provider (all fields optional)

#### Delete Provider
- **Method**: DELETE
- **URL**: `/api/providers/:id`
- **Auth**: JWT Token + `manage_providers` permission

#### Get Default Provider
- **Method**: GET
- **URL**: `/api/providers/config/default`
- **Auth**: API Key

#### Update Default Provider
- **Method**: PUT
- **URL**: `/api/providers/config/default`
- **Auth**: API Key + `manage_providers` permission
- **Body**:
```json
{
  "defaultProvider": "stripe | conekta"
}
```

### User Providers

#### Get User's Providers
- **Method**: GET
- **URL**: `/api/user-providers/:userId/providers`
- **Auth**: API Key

#### Assign Provider to User
- **Method**: POST
- **URL**: `/api/user-providers/:userId/providers`
- **Auth**: API Key + `manage_providers` permission
- **Body**:
```json
{
  "providerId": "uuid",
  "priority": "number"
}
```

#### Update Provider Priority
- **Method**: PUT
- **URL**: `/api/user-providers/:userId/providers/:providerId/priority`
- **Auth**: API Key + `manage_providers` permission
- **Body**:
```json
{
  "priority": "number"
}
```

#### Remove Provider from User
- **Method**: DELETE
- **URL**: `/api/user-providers/:userId/providers/:providerId`
- **Auth**: API Key + `manage_providers` permission

### Transactions

#### Get All Transactions
- **Method**: GET
- **URL**: `/api/transactions`
- **Auth**: API Key or JWT Token + `view_transactions` permission

#### Get Transaction by ID
- **Method**: GET
- **URL**: `/api/transactions/:id`
- **Auth**: API Key or JWT Token + `view_transactions` permission

### Users

#### Get All Users
- **Method**: GET
- **URL**: `/api/users`
- **Auth**: JWT Token + `manage_users` permission

#### Get User by ID
- **Method**: GET
- **URL**: `/api/users/:id`
- **Auth**: JWT Token + `manage_users` permission

#### Create User
- **Method**: POST
- **URL**: `/api/users`
- **Auth**: JWT Token + `manage_users` permission
- **Body**:
```json
{
  "email": "string",
  "password": "string",
  "roleId": "uuid"
}
```

#### Update User
- **Method**: PUT
- **URL**: `/api/users/:id`
- **Auth**: JWT Token + `manage_users` permission
- **Body**: Same as Create User (all fields optional)

#### Delete User
- **Method**: DELETE
- **URL**: `/api/users/:id`
- **Auth**: JWT Token + `manage_users` permission

### Roles

#### Get All Roles
- **Method**: GET
- **URL**: `/api/roles`
- **Auth**: JWT Token + `manage_permissions` permission

#### Get Role by ID
- **Method**: GET
- **URL**: `/api/roles/:id`
- **Auth**: JWT Token + `manage_permissions` permission

#### Create Role
- **Method**: POST
- **URL**: `/api/roles`
- **Auth**: JWT Token + `manage_permissions` permission
- **Body**:
```json
{
  "name": "string",
  "permissions": ["string"]
}
```

#### Update Role
- **Method**: PUT
- **URL**: `/api/roles/:id`
- **Auth**: JWT Token + `manage_permissions` permission
- **Body**: Same as Create Role (all fields optional)

#### Delete Role
- **Method**: DELETE
- **URL**: `/api/roles/:id`
- **Auth**: JWT Token + `manage_permissions` permission

### Permissions

#### Get All Permissions
- **Method**: GET
- **URL**: `/api/permissions`
- **Auth**: JWT Token + `manage_permissions` permission

#### Create Permission
- **Method**: POST
- **URL**: `/api/permissions`
- **Auth**: JWT Token + `manage_permissions` permission
- **Body**:
```json
{
  "name": "string",
  "description": "string"
}
```

#### Update Permission
- **Method**: PUT
- **URL**: `/api/permissions/:id`
- **Auth**: JWT Token + `manage_permissions` permission
- **Body**: Same as Create Permission (all fields optional)

#### Delete Permission
- **Method**: DELETE
- **URL**: `/api/permissions/:id`
- **Auth**: JWT Token + `manage_permissions` permission

#### Assign Permissions to Role
- **Method**: POST
- **URL**: `/api/permissions/assign`
- **Auth**: JWT Token + `manage_permissions` permission
- **Body**:
```json
{
  "roleId": "uuid",
  "permissions": ["string"]
}
```

#### Remove Permissions from Role
- **Method**: POST
- **URL**: `/api/permissions/remove`
- **Auth**: JWT Token + `manage_permissions` permission
- **Body**: Same as Assign Permissions

## Webhooks

### Stripe Webhook
- **Method**: POST
- **URL**: `/api/payments/webhook/stripe`
- **Headers**: `stripe-signature`

### Conekta Webhook
- **Method**: POST
- **URL**: `/api/payments/webhook/conekta`
- **Headers**: `conekta-signature`# payments-master
