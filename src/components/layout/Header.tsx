import { Link, useLocation } from 'react-router-dom';
import { Home, PlusSquare, Instagram } from 'lucide-react';
import { clsx } from 'clsx';

export function Header() {
  const location = useLocation();

  const navItems = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/create', icon: PlusSquare, label: 'Create Post' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link 
          to="/" 
          className="flex items-center gap-2 text-xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent"
        >
          <Instagram className="w-6 h-6 text-pink-500" aria-hidden="true" />
          <span>Mini Instagram</span>
        </Link>

        <nav aria-label="Main navigation">
          <ul className="flex items-center gap-3">
            {navItems.map(({ to, icon: Icon, label }) => (
              <li key={to}>
                <Link
                  to={to}
                  className={clsx(
                    'p-2 rounded-lg transition-colors',
                    location.pathname === to
                      ? 'text-pink-500'
                      : 'text-gray-600'
                  )}
                  aria-label={label}
                  aria-current={location.pathname === to ? 'page' : undefined}
                >
                  <Icon className="w-6 h-6" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
