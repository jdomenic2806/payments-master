import { Request, Response } from 'express';
import { getTransactions, getTransactionById } from '../services/TransactionsService';
import { logger } from '../utils/logger';

export const handleGetTransactions = async (req: Request, res: Response) => {
  try {
    const transactions = await getTransactions(req.user!.id);
    res.json(transactions);
  } catch (error) {
    logger.error('Failed to fetch transactions:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
};

export const handleGetTransaction = async (req: Request, res: Response) => {
  try {
    const transaction = await getTransactionById(req.params.id, req.user!.id);
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    res.json(transaction);
  } catch (error) {
    logger.error(`Failed to fetch transaction ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to fetch transaction' });
  }
};
