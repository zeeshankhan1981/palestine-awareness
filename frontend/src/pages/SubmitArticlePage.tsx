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
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-palestine-black mb-2">Submit an Article</h1>
        <p className="text-gray-600">
          Submit news articles about Palestine to be verified and stored on the blockchain.
        </p>
      </div>

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

      <form onSubmit={handleSubmit} className="card">
        <div className="p-6">
          {/* URL with fetch button */}
          <div className="mb-6">
            <label htmlFor="url" className="form-label">
              <FaLink className="mr-2" />
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
                className={`form-input flex-grow ${errors.url ? 'border-red-500' : ''}`}
              />
              <button
                type="button"
                onClick={fetchArticleMetadata}
                disabled={urlFetching}
                className="ml-2 bg-palestine-green text-white px-4 py-2 rounded hover:bg-palestine-green/90 transition-colors duration-200 disabled:opacity-50"
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
          <div className="mb-6">
            <label htmlFor="title" className="form-label">
              <FaNewspaper className="mr-2" />
              Article Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter article title"
              className={`form-input ${errors.title ? 'border-red-500' : ''}`}
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          </div>

          {/* Source and Date - 2 columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="source_name" className="form-label">
                Source Name
              </label>
              <input
                type="text"
                id="source_name"
                name="source_name"
                value={formData.source_name}
                onChange={handleInputChange}
                placeholder="e.g. Al Jazeera, BBC, etc."
                className={`form-input ${errors.source_name ? 'border-red-500' : ''}`}
              />
              {errors.source_name && <p className="text-red-500 text-sm mt-1">{errors.source_name}</p>}
            </div>
            
            <div>
              <label htmlFor="publication_date" className="form-label">
                <FaCalendarAlt className="mr-2" />
                Publication Date
              </label>
              <input
                type="date"
                id="publication_date"
                name="publication_date"
                value={formData.publication_date}
                onChange={handleInputChange}
                className={`form-input ${errors.publication_date ? 'border-red-500' : ''}`}
              />
              {errors.publication_date && <p className="text-red-500 text-sm mt-1">{errors.publication_date}</p>}
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <label htmlFor="description" className="form-label">
              <FaInfoCircle className="mr-2" />
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              placeholder="Provide a brief description of the article"
              className={`form-input ${errors.description ? 'border-red-500' : ''}`}
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary flex items-center"
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

      <div className="mt-8 bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">What happens after submission?</h3>
        <ol className="list-decimal pl-5 space-y-2">
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
