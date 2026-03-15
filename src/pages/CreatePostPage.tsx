import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Send } from 'lucide-react';
import { useCreatePost } from '../hooks/usePosts';
import { useForm } from '../hooks/useForm';
import { validateCreatePostForm } from '../utils/validation';
import { getApiErrorMessage } from '../utils/errorHandling';
import { ImageUpload } from '../components/post/ImageUpload';
import { Button, ErrorMessage, FormField, Toast } from '../components/ui';
import { VALIDATION } from '../config/constants';

interface CreatePostFormData {
  author: string;
  caption: string;
}

export function CreatePostPage() {
  const navigate = useNavigate();
  const { mutate: createPost, isPending, isError, error, reset: resetMutation } = useCreatePost();
  const [image, setImage] = useState<File | null>(null);
  const [imageError, setImageError] = useState<string | undefined>();
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const form = useForm<CreatePostFormData>({
    initialValues: {
      author: '',
      caption: '',
    },
    validate: validateCreatePostForm,
    onSubmit: async (values) => {
      resetMutation();
      
      createPost(
        {
          image: image ?? undefined,
          caption: values.caption.trim(),
          author: values.author.trim(),
        },
        {
          onSuccess: (post) => {
            setShowSuccessToast(true);
            setTimeout(() => {
              navigate(`/post/${post.id}`);
            }, 1500);
          },
        }
      );
    },
  });

  const handleImageChange = (file: File | null) => {
    setImage(file);
    setImageError(undefined);
  };

  return (
    <div className="max-w-lg mx-auto">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" aria-hidden="true" />
        <span>Back to feed</span>
      </Link>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h1 className="text-xl font-bold text-gray-900 mb-6">Create new post</h1>

        {isError ? (
          <div className="mb-6">
            <ErrorMessage
              title="Failed to create post"
              message={getApiErrorMessage(error)}
              onRetry={resetMutation}
            />
          </div>
        ) : (
          <form onSubmit={form.handleSubmit} className="space-y-6">
            <ImageUpload
              onChange={handleImageChange}
              error={imageError}
              enableCompression={true} // img compression
            />

            <FormField
              label="Your name"
              name="author"
              value={form.values.author}
              onChange={(value) => form.handleChange('author', value)}
              error={form.errors.author}
              placeholder="Enter your name"
              required
              maxLength={VALIDATION.AUTHOR_MAX_LENGTH}
            />

            <FormField
              label="Caption"
              name="caption"
              type="textarea"
              value={form.values.caption}
              onChange={(value) => form.handleChange('caption', value)}
              error={form.errors.caption}
              placeholder="Write a caption..."
              maxLength={VALIDATION.CAPTION_MAX_LENGTH}
              hint="Optional"
              showCharCount
            />

            <Button
              type="submit"
              isLoading={isPending || form.isSubmitting}
              className="w-full"
              size="lg"
            >
              <Send className="w-4 h-4 mr-2" aria-hidden="true" />
              Share post
            </Button>
          </form>
        )}
      </div>

      {showSuccessToast && (
        <Toast
          message="Posted successfully!"
          onClose={() => setShowSuccessToast(false)}
        />
      )}
    </div>
  );
}
