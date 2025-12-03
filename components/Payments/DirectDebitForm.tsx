import React from "react";

/**
 * DirectDebitForm Component
 *
 * Placeholder component for Direct Debit payment method.
 * This payment method is currently disabled but kept for future integration.
 *
 * @component
 */
const DirectDebitForm: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="text-center space-y-3">
          <div className="text-4xl mb-2">🚧</div>
          <h4 className="font-semibold text-gray-900 dark:text-white text-lg">Direct Debit Coming Soon</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            This payment method is currently under development and will be available soon.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DirectDebitForm;
