'use client';

import React from 'react';

const Forbidden = () => {
  return (
    <div className="min-h-screen bg-deep-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl mb-4">🚫</h1>
        <h1 className="text-3xl font-bold text-white mb-4">Access Denied</h1>
        <p className="text-white/80 mb-8">You don't have permission to access this page</p>
        <button 
          onClick={() => window.history.back()}
          className="btn-primary"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default Forbidden;
