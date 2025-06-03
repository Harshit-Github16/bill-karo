import { useState } from 'react';
import { motion } from 'framer-motion';

export default function withPremiumCheck(WrappedComponent, { requiresPremium = true } = {}) {
  return function WithPremiumCheckComponent(props) {
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const isPremium = false; // This should come from your subscription context

    if (!requiresPremium || isPremium) {
      return <WrappedComponent {...props} />;
    }

    return (
      <div className="relative">
        <div className="absolute inset-0 bg-gray-100/50 backdrop-blur-[2px] z-10 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4"
          >
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Premium Feature
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              This feature is only available to premium users. Upgrade your plan to access this and many other premium features.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
              >
                Cancel
              </button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => window.location.href = '/dashboard/settings'}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Upgrade Now
              </motion.button>
            </div>
          </motion.div>
        </div>
        <div className="opacity-50 pointer-events-none">
          <WrappedComponent {...props} />
        </div>
      </div>
    );
  };
} 