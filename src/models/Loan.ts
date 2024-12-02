export interface Loan {
  id: string;
  clientId: string;
  amount: number;
  interestRate: number;
  startDate: Date;
  endDate: Date;
  type: 'interest-only' | 'fixed-installment';
  status: 'active' | 'finished';
  paymentFrequency: 'weekly' | 'monthly';
  remainingBalance: number;
  nextPaymentDate: Date;
}

export interface Payment {
  id: string;
  loanId: string;
  clientId: string;
  amount: number;
  date: Date;
  notes?: string;
}