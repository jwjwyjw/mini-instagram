import { Link } from 'react-router-dom';
import { Home, ImageOff } from 'lucide-react';
import { Button } from '../components/ui';

export function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <ImageOff className="w-16 h-16 text-gray-300 mb-6" aria-hidden="true" />
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Page not found</h1>
      <p className="text-gray-500 mb-8 max-w-md">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/">
        <Button>
          <Home className="w-4 h-4 mr-2" aria-hidden="true" />
          Back to home
        </Button>
      </Link>
    </div>
  );
}
