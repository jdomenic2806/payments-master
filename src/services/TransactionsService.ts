import TransactionModel from '../models/Transaction';
import PaymentProviderModel from '../models/PaymentProvider';
import { logger } from '../utils/logger';

export const getTransactions = async (userId: string) => {
  try {
    const transactions = await TransactionModel.findAll({
      where: { userId },
      include: [
        {
          model: PaymentProviderModel,
          attributes: ['name', 'type'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });
    return transactions.map((transaction) => transaction.toJSON());
  } catch (error) {
    logger.error('Error fetching transactions:', error);
    throw error;
  }
};

export const getTransactionById = async (id: string, userId: string) => {
  try {
    const transaction = await TransactionModel.findOne({
      where: { id, userId },
      include: [
        {
          model: PaymentProviderModel,
          attributes: ['name', 'type'],
        },
      ],
    });
    return transaction ? transaction.toJSON() : null;
  } catch (error) {
    logger.error(`Error fetching transaction ${id}:`, error);
    throw error;
  }
};
