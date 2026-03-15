import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  children?: React.ReactNode;
}

export function ErrorMessage({ title = 'Something went wrong', message, onRetry, children }: ErrorMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center" role="alert">
      <AlertCircle className="w-12 h-12 text-red-500 mb-4" aria-hidden="true" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-4 max-w-md">{message}</p>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry}>
          <RefreshCw className="w-4 h-4 mr-2" aria-hidden="true" />
          Try again
        </Button>
      )}
      {children}
    </div>
  );
}
