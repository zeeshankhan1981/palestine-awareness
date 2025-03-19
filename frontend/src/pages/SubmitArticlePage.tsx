import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPaperPlane, FaLink, FaNewspaper, FaCalendarAlt, FaInfoCircle, FaSpinner } from 'react-icons/fa';

interface FormData {
  url: string;
  title: string;
  source_name: string;
  publication_date: string;
  description: string;
}

interface FormErrors {
  url?: string;
  title?: string;
  source_name?: string;
  publication_date?: string;
  description?: string;
}

const SubmitArticlePage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    url: '',
    title: '',
    source_name: '',
    publication_date: new Date().toISOString().split('T')[0],
    description: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [urlFetching, setUrlFetching] = useState<boolean>(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.url.trim()) {
      newErrors.url = 'URL is required';
    } else if (!/^https?:\/\/.+\..+/.test(formData.url)) {
      newErrors.url = 'Please enter a valid URL (starting with http:// or https://)';
    }
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.source_name.trim()) {
      newErrors.source_name = 'Source name is required';
    }
    
    if (!formData.publication_date) {
      newErrors.publication_date = 'Publication date is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when user types
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const fetchArticleMetadata = async () => {
    if (!formData.url.trim() || !/^https?:\/\/.+\..+/.test(formData.url)) {
      setErrors((prev) => ({
        ...prev,
        url: 'Please enter a valid URL (starting with http:// or https://)',
      }));
      return;
    }

    try {
      setUrlFetching(true);
      const response = await fetch(`/api/articles/fetch-metadata?url=${encodeURIComponent(formData.url)}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch article metadata');
      }
      
      const data = await response.json();
      
      setFormData((prev) => ({
        ...prev,
        title: data.title || prev.title,
        source_name: data.source_name || prev.source_name,
        publication_date: data.publication_date || prev.publication_date,
        description: data.description || prev.description,
      }));
    } catch (err) {
      console.error('Error fetching article metadata:', err);
      setStatusMessage('Failed to fetch article metadata. Please fill in the details manually.');
      setSubmitStatus('error');
    } finally {
      setUrlFetching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      const response = await fetch('/api/articles/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit article');
      }
      
      const data = await response.json();
      setSubmitStatus('success');
      setStatusMessage('Article submitted successfully!');
      
      // Redirect to the article page after a short delay
      setTimeout(() => {
        navigate(`/articles/${data.id}`);
      }, 2000);
    } catch (err) {
      console.error('Error submitting article:', err);
      setSubmitStatus('error');
      setStatusMessage(err instanceof Error ? err.message : 'Failed to submit article. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-5 sm:px-8 py-16">
      <header className="mb-16 text-center">
        <h1 className="text-4xl font-serif font-bold mb-4">Submit an Article</h1>
        <p className="text-gray-600 max-w-xl mx-auto">
          Submit news articles about Palestine to be verified and stored on the blockchain.
        </p>
      </header>

      {submitStatus === 'success' ? (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-8">
          <div className="flex">
            <div className="flex-shrink-0">
              <FaInfoCircle className="h-5 w-5 text-green-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">{statusMessage}</p>
            </div>
          </div>
        </div>
      ) : submitStatus === 'error' ? (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8">
          <div className="flex">
            <div className="flex-shrink-0">
              <FaInfoCircle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{statusMessage}</p>
            </div>
          </div>
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="mb-12">
        <div className="space-y-6">
          {/* URL with fetch button */}
          <div>
            <label htmlFor="url" className="block text-gray-700 font-medium mb-2">
              <FaLink className="mr-2 inline-block" />
              Article URL
            </label>
            <div className="flex">
              <input
                type="url"
                id="url"
                name="url"
                value={formData.url}
                onChange={handleInputChange}
                placeholder="https://example.com/article"
                className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-gray-200 focus:border-gray-400 ${errors.url ? 'border-red-500' : 'border-gray-300'}`}
              />
              <button
                type="button"
                onClick={fetchArticleMetadata}
                disabled={urlFetching}
                className="ml-2 bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors duration-200 disabled:opacity-50"
              >
                {urlFetching ? (
                  <FaSpinner className="animate-spin" />
                ) : (
                  'Fetch'
                )}
              </button>
            </div>
            {errors.url && <p className="text-red-500 text-sm mt-1">{errors.url}</p>}
            <p className="text-xs text-gray-500 mt-1">
              Enter the URL of the article you want to submit. Click "Fetch" to automatically fill in the details.
            </p>
          </div>

          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-gray-700 font-medium mb-2">
              <FaNewspaper className="mr-2 inline-block" />
              Article Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter article title"
              className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-gray-200 focus:border-gray-400 ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          </div>

          {/* Source and Date - 2 columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="source_name" className="block text-gray-700 font-medium mb-2">
                Source Name
              </label>
              <input
                type="text"
                id="source_name"
                name="source_name"
                value={formData.source_name}
                onChange={handleInputChange}
                placeholder="e.g. Al Jazeera, BBC, etc."
                className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-gray-200 focus:border-gray-400 ${errors.source_name ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.source_name && <p className="text-red-500 text-sm mt-1">{errors.source_name}</p>}
            </div>
            
            <div>
              <label htmlFor="publication_date" className="block text-gray-700 font-medium mb-2">
                <FaCalendarAlt className="mr-2 inline-block" />
                Publication Date
              </label>
              <input
                type="date"
                id="publication_date"
                name="publication_date"
                value={formData.publication_date}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-gray-200 focus:border-gray-400 ${errors.publication_date ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.publication_date && <p className="text-red-500 text-sm mt-1">{errors.publication_date}</p>}
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
              <FaInfoCircle className="mr-2 inline-block" />
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              placeholder="Provide a brief description of the article"
              className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-gray-200 focus:border-gray-400 ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-gray-800 text-white px-6 py-3 rounded-md hover:bg-gray-700 transition-colors duration-200 disabled:opacity-50 flex items-center"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  Submitting...
                </>
              ) : (
                <>
                  <FaPaperPlane className="mr-2" />
                  Submit Article
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      <div className="border-t pt-8">
        <h3 className="text-xl font-serif font-semibold mb-4">What happens after submission?</h3>
        <ol className="list-decimal pl-5 space-y-2 text-gray-600">
          <li>Our system will crawl the article and extract its content.</li>
          <li>A unique hash of the content will be generated for verification.</li>
          <li>The article metadata and hash will be stored in our database.</li>
          <li>The hash will be submitted to the Polygon blockchain for immutable verification.</li>
          <li>Once verified, the article will appear in our public listings.</li>
        </ol>
      </div>
    </div>
  );
};

export default SubmitArticlePage;
