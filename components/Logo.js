import React from 'react';
import Link from 'next/link';

export default function Logo({ className = '', size = 'default' }) {
  const sizeClasses = {
    small: 'h-6',
    default: 'h-8',
    large: 'h-10'
  };

  return (
    <div className={`flex items-center ${className}`}>
      <div className="flex items-center space-x-2">
          <div className="relative">
            <svg
            className={`${sizeClasses[size]} text-indigo-600`}
            viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
            {/* Background Circle */}
            <circle cx="16" cy="16" r="16" className="fill-current" />
            
            {/* Bill Icon */}
              <path
              d="M10 8H22C22.5523 8 23 8.44772 23 9V23C23 23.5523 22.5523 24 22 24H10C9.44772 24 9 23.5523 9 23V9C9 8.44772 9.44772 8 10 8Z"
              fill="white"
              />
              
            {/* Lines representing text */}
              <path
              d="M12 12H20M12 16H20M12 20H16"
              stroke="currentColor"
              strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

            {/* Rupee Symbol Overlay */}
            <path
              d="M19 13.5H15M19 13.5H21M19 13.5V19.5M15 15.5H21M15 17.5H21"
              stroke="white"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            </svg>
              </div>
        <div className="flex flex-col">
          <div className="flex items-baseline">
            <span className={`font-bold ${size === 'small' ? 'text-lg' : 'text-2xl'} bg-gradient-to-r from-indigo-600 to-indigo-800 bg-clip-text text-transparent`}>
              Bill
            </span>
            <span className={`font-bold ${size === 'small' ? 'text-lg' : 'text-2xl'} bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent ml-1`}>
              Karo
            </span>
          </div>
          <span className={`text-xs font-medium text-gray-600 tracking-wider ${size === 'small' ? 'hidden' : ''}`}>
            Billing Made Simple
          </span>
        </div>
      </div>
    </div>
  );
} 