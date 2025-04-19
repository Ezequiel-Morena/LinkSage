// src/components/ErrorMessage.tsx
import React from 'react';

interface ErrorMessageProps {
  error: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ error }) => (
  <div className="countdown-error">{error}</div>
);

export default ErrorMessage;
