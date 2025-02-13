import {getRecipientsAmount, Transaction} from '@signumjs/core';
import {Amount} from '@signumjs/util';
import {BalanceHistoryItem} from './typings';
import {TransactionType} from '@signumjs/core/src';
import {flow, map, filter} from 'lodash/fp';

const isOwnTransaction = (accountId: string, transaction: Transaction): boolean => transaction.sender === accountId;

function getRelativeTransactionAmount(accountId: string, transaction: Transaction): number {

  if (isOwnTransaction(accountId, transaction)) {
    const amount = Amount.fromPlanck(transaction.amountNQT)
      .add(Amount.fromPlanck(transaction.feeNQT))
      .getSigna();
    return -parseFloat(amount);
  }

  return getRecipientsAmount(accountId, transaction);
}


/**
 * Creates a (reversed) history of balances, i.e. deducing an ordered transaction list from current balance
 * @param accountId The accountId of the related Account
 * @param currentBalance The current balance value in BURST
 * @param transactions The transaction array (assuming most recent transaction on head of list)
 * @return A list with balances per transaction
 */
export function getBalanceHistoryFromTransactions(
  accountId: string,
  currentBalance: number,
  transactions: Transaction[]): Array<BalanceHistoryItem> {

  let balance = currentBalance;

  return flow(
    filter((t: Transaction) => t.type === TransactionType.Payment),
    map((t: Transaction) => {
      const relativeAmount = getRelativeTransactionAmount(accountId, t);
      const deducedBalances = {
        timestamp: t.blockTimestamp,
        transactionId: t.transaction,
        balance,
        transaction: t
      };
      balance = balance - relativeAmount;
      return deducedBalances;
    }))(transactions);
}
