/**
 * Sample Finance App Entry Point
 * This file demonstrates the ESLint and Prettier configuration
 */

const calculateCompoundInterest = (
  principal,
  rate,
  time,
  compoundFrequency = 1
) => {
  if (principal <= 0 || rate <= 0 || time <= 0) {
    throw new Error('All values must be positive numbers');
  }

  const amount =
    principal *
    Math.pow(1 + rate / compoundFrequency, compoundFrequency * time);
  return Math.round(amount * 100) / 100;
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

// Example usage
const principal = 1000;
const annualRate = 0.05; // 5%
const years = 10;

const finalAmount = calculateCompoundInterest(principal, annualRate, years, 12);

console.log(`Initial investment: ${formatCurrency(principal)}`);
console.log(
  `Final amount after ${years} years: ${formatCurrency(finalAmount)}`
);
console.log(
  `Total interest earned: ${formatCurrency(finalAmount - principal)}`
);

export { calculateCompoundInterest, formatCurrency };
