import React from 'react';

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div className="bg-red-100 dark:bg-red-900/40 border-l-4 border-red-500 dark:border-red-600 text-red-700 dark:text-red-300 p-4 my-6 rounded-md shadow-md dark:shadow-red-900/50" role="alert">
      <div className="flex">
        <div className="py-1">
          <svg className="fill-current h-6 w-6 text-red-500 dark:text-red-400 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zM11 15H9v-2h2v2zm0-4H9V5h2v6z"/>
          </svg>
        </div>
        <div>
          <p className="font-bold">Extraction Error</p>
          <p className="text-sm">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;