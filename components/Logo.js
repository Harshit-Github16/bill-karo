import React from 'react';
import Link from 'next/link';

export default function Logo({ className = '', size = 'default', withTagline = false, asLink = false }) {
  const sizeClasses = {
    small: 'h-6',
    default: 'h-8',
    large: 'h-10',
    xl: 'h-12'
  };

  const LogoContent = () => (
    <div className={`flex items-center ${className}`}>
      <div className="relative">
        <div className="flex items-center">
          {/* Logo SVG */}
          <div className="relative">
            <svg
              className={`${sizeClasses[size]} w-auto`}
              viewBox="0 0 120 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Background Shape */}
              <path
                d="M20 0H100C111.046 0 120 8.95431 120 20C120 31.0457 111.046 40 100 40H20C8.95431 40 0 31.0457 0 20C0 8.95431 8.95431 0 20 0Z"
                fill="#4F46E5"
                className="text-indigo-600"
              />
              
              {/* Rupee Symbol */}
              <path
                d="M22 12H32M22 17H32M25 28L31 12M22 22H31C32.6569 22 34 20.6569 34 19C34 17.3431 32.6569 16 31 16H22"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Text */}
              <text x="42" y="26" className="text-2xl font-bold" fill="currentColor">
                <tspan fill="#1F2937">Bill</tspan>
                <tspan fill="#4F46E5">Karo</tspan>
              </text>
            </svg>

            {withTagline && (
              <div className="absolute -bottom-4 left-0 w-full text-center">
                <span className="text-xs text-gray-500 tracking-wider">Financial Management</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  if (asLink) {
    return (
      <Link href="/dashboard" className="inline-block">
        <LogoContent />
      </Link>
    );
  }

  return <LogoContent />;
} 