import { useEffect } from 'react';
import { CheckCircle, X } from 'lucide-react';

interface ToastProps {
  message: string;
  onClose: () => void;
  duration?: number;
}

export function Toast({ message, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className="fixed top-20 right-4 z-50 animate-in slide-in-from-top-5 fade-in duration-300">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 flex items-center gap-3 min-w-[300px]">
        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
        <p className="text-sm font-medium text-gray-900 flex-1">{message}</p>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
