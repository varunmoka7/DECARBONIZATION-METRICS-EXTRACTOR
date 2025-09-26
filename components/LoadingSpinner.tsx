import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col justify-center items-center p-8 my-6">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-sky-600 dark:border-sky-400"></div>
      <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">Extracting KPIs, please wait...</p>
    </div>
  );
};

export default LoadingSpinner;