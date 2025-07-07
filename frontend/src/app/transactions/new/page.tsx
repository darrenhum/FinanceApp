'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Zod schema for transaction validation
const transactionSchema = z.object({
  account_id: z.string().uuid('Account ID must be a valid UUID'),
  date: z.string().min(1, 'Date is required'),
  amount: z
    .number({
      required_error: 'Amount is required',
      invalid_type_error: 'Amount must be a number',
    })
    .min(-999999.99, 'Amount cannot be less than -999,999.99')
    .max(999999.99, 'Amount cannot be greater than 999,999.99'),
  merchant: z.string().max(255, 'Merchant name cannot exceed 255 characters'),
  description: z
    .string()
    .max(1000, 'Description cannot exceed 1000 characters')
    .optional(),
  category_id: z.string().uuid('Category ID must be a valid UUID'),
  owner_user_id: z
    .string()
    .uuid('Owner User ID must be a valid UUID')
    .optional(),
  card_id: z.string().uuid('Card ID must be a valid UUID').optional(),
});

type TransactionFormData = z.infer<typeof transactionSchema>;

export default function NewTransactionPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
  });

  const onSubmit = async (data: TransactionFormData) => {
    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      const response = await fetch('http://localhost:3000/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // TODO: Add JWT token from authentication context
          // 'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create transaction');
      }

      const result = await response.json();

      setSubmitMessage({
        type: 'success',
        text: 'Transaction created successfully!',
      });

      // Reset form after successful submission
      reset();
    } catch (error) {
      console.error('Error creating transaction:', error);
      setSubmitMessage({
        type: 'error',
        text:
          error instanceof Error
            ? error.message
            : 'Failed to create transaction',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-sm rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-semibold text-gray-900">
              Add New Transaction
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Enter the details for your new transaction
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="px-6 py-4 space-y-6"
          >
            {/* Account ID */}
            <div>
              <label
                htmlFor="account_id"
                className="block text-sm font-medium text-gray-700"
              >
                Account ID *
              </label>
              <input
                type="text"
                id="account_id"
                {...register('account_id')}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                  errors.account_id ? 'border-red-500' : ''
                }`}
                placeholder="Select an account..."
              />
              {errors.account_id && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.account_id.message}
                </p>
              )}
            </div>

            {/* Date */}
            <div>
              <label
                htmlFor="date"
                className="block text-sm font-medium text-gray-700"
              >
                Date *
              </label>
              <input
                type="date"
                id="date"
                {...register('date')}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                  errors.date ? 'border-red-500' : ''
                }`}
              />
              {errors.date && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.date.message}
                </p>
              )}
            </div>

            {/* Amount */}
            <div>
              <label
                htmlFor="amount"
                className="block text-sm font-medium text-gray-700"
              >
                Amount *
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  step="0.01"
                  id="amount"
                  {...register('amount', { valueAsNumber: true })}
                  className={`block w-full pl-7 pr-3 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                    errors.amount ? 'border-red-500' : ''
                  }`}
                  placeholder="0.00"
                />
              </div>
              {errors.amount && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.amount.message}
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Use negative values for expenses, positive for income
              </p>
            </div>

            {/* Merchant */}
            <div>
              <label
                htmlFor="merchant"
                className="block text-sm font-medium text-gray-700"
              >
                Merchant
              </label>
              <input
                type="text"
                id="merchant"
                {...register('merchant')}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                  errors.merchant ? 'border-red-500' : ''
                }`}
                placeholder="e.g., Starbucks, Amazon, etc."
                maxLength={255}
              />
              {errors.merchant && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.merchant.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Description
              </label>
              <textarea
                id="description"
                rows={3}
                {...register('description')}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                  errors.description ? 'border-red-500' : ''
                }`}
                placeholder="Additional notes about this transaction..."
                maxLength={1000}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Category ID */}
            <div>
              <label
                htmlFor="category_id"
                className="block text-sm font-medium text-gray-700"
              >
                Category
              </label>
              <input
                type="text"
                id="category_id"
                {...register('category_id')}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                  errors.category_id ? 'border-red-500' : ''
                }`}
                placeholder="Select a category..."
              />
              {errors.category_id && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.category_id.message}
                </p>
              )}
            </div>

            {/* Owner User ID */}
            <div>
              <label
                htmlFor="owner_user_id"
                className="block text-sm font-medium text-gray-700"
              >
                Owner
              </label>
              <input
                type="text"
                id="owner_user_id"
                {...register('owner_user_id')}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                  errors.owner_user_id ? 'border-red-500' : ''
                }`}
                placeholder="Select the transaction owner..."
              />
              {errors.owner_user_id && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.owner_user_id.message}
                </p>
              )}
            </div>

            {/* Card ID */}
            <div>
              <label
                htmlFor="card_id"
                className="block text-sm font-medium text-gray-700"
              >
                Card
              </label>
              <input
                type="text"
                id="card_id"
                {...register('card_id')}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                  errors.card_id ? 'border-red-500' : ''
                }`}
                placeholder="Select a card (optional)..."
              />
              {errors.card_id && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.card_id.message}
                </p>
              )}
            </div>

            {/* Submit Message */}
            {submitMessage && (
              <div
                className={`p-4 rounded-md ${
                  submitMessage.type === 'success'
                    ? 'bg-green-50 text-green-800 border border-green-200'
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}
              >
                {submitMessage.text}
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end space-x-3 pt-6">
              <button
                type="button"
                onClick={() => {
                  reset();
                  setSubmitMessage(null);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Clear
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? 'Creating...' : 'Create Transaction'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
