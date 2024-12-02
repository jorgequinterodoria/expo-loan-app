export class LoanCalculator {
  static calculateFixedInstallment(
    principal: number,
    annualInterestRate: number,
    termInMonths: number
  ): number {
    const monthlyRate = annualInterestRate / 12 / 100;
    const numerator = monthlyRate * Math.pow(1 + monthlyRate, termInMonths);
    const denominator = Math.pow(1 + monthlyRate, termInMonths) - 1;
    return principal * (numerator / denominator);
  }

  static calculateInterestOnlyPayment(
    principal: number,
    annualInterestRate: number
  ): number {
    return (principal * annualInterestRate) / 12 / 100;
  }
}