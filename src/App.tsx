import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Layout } from './components/layout';
import { Spinner } from './components/ui';
import { CACHE_TIME, UI } from './config/constants';

const FeedPage = lazy(() => import('./pages/FeedPage').then(m => ({ default: m.FeedPage })));
const PostPage = lazy(() => import('./pages/PostPage').then(m => ({ default: m.PostPage })));
const CreatePostPage = lazy(() => import('./pages/CreatePostPage').then(m => ({ default: m.CreatePostPage })));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage').then(m => ({ default: m.NotFoundPage })));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: UI.RETRY_COUNT,
      refetchOnWindowFocus: false,
      staleTime: CACHE_TIME.QUERY_CLIENT_STALE,
    },
    mutations: {
      retry: UI.RETRY_COUNT,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Suspense fallback={
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <Spinner size="lg" />
          </div>
        }>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<FeedPage />} />
              <Route path="/post/:id" element={<PostPage />} />
              <Route path="/create" element={<CreatePostPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App
