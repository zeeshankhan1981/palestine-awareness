import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { FaSearch, FaCheck, FaTimes, FaLink, FaHashtag, FaInfoCircle, FaSpinner } from 'react-icons/fa';

interface VerificationResult {
  verified: boolean;
  article?: {
    id: number;
    title: string;
    source_url: string;
    source_name: string;
    publication_date: string;
    blockchain_tx_hash: string;
  };
  message: string;
}

const VerifyArticlePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialHash = searchParams.get('hash') || '';
  
  const [contentHash, setContentHash] = useState<string>(initialHash);
  const [url, setUrl] = useState<string>('');
  const [verifyMethod, setVerifyMethod] = useState<'hash' | 'url'>(initialHash ? 'hash' : 'url');
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialHash) {
      handleVerify();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialHash]);

  const handleVerify = async () => {
    setError(null);
    setResult(null);
    
    if (verifyMethod === 'hash' && !contentHash.trim()) {
      setError('Please enter a content hash');
      return;
    }
    
    if (verifyMethod === 'url' && !url.trim()) {
      setError('Please enter a URL');
      return;
    }
    
    try {
      setLoading(true);
      
      const endpoint = verifyMethod === 'hash' 
        ? `/api/verify/hash/${contentHash}`
        : `/api/verify/url?url=${encodeURIComponent(url)}`;
      
      const response = await fetch(endpoint);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Verification failed');
      }
      
      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error('Error during verification:', err);
      setError(err instanceof Error ? err.message : 'Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="max-w-2xl mx-auto px-5 sm:px-8 py-16">
      <header className="mb-16 text-center">
        <h1 className="text-4xl font-serif font-bold mb-4">Verify Content</h1>
        <p className="text-gray-600 max-w-xl mx-auto">
          Verify if an article has been tampered with by checking its content against the blockchain.
        </p>
      </header>

      <div className="mb-12">
        <div className="mb-6">
          <div className="flex space-x-4 mb-6">
            <button
              type="button"
              onClick={() => setVerifyMethod('url')}
              className={`px-4 py-2 rounded-md mr-2 ${
                verifyMethod === 'url'
                  ? 'bg-gray-800 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <FaLink className="inline mr-2" />
              Verify by URL
            </button>
            
            <button
              type="button"
              onClick={() => setVerifyMethod('hash')}
              className={`px-4 py-2 rounded-md ${
                verifyMethod === 'hash'
                  ? 'bg-gray-800 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <FaHashtag className="inline mr-2" />
              Verify by Hash
            </button>
          </div>

          {verifyMethod === 'url' ? (
            <div>
              <label htmlFor="url" className="block text-gray-700 font-medium mb-2">
                <FaLink className="mr-2 inline-block" />
                Article URL
              </label>
              <input
                type="url"
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/article"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-200 focus:border-gray-400"
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter the full URL of the article you want to verify.
              </p>
            </div>
          ) : (
            <div>
              <label htmlFor="contentHash" className="block text-gray-700 font-medium mb-2">
                <FaHashtag className="mr-2 inline-block" />
                Content Hash
              </label>
              <input
                type="text"
                id="contentHash"
                value={contentHash}
                onChange={(e) => setContentHash(e.target.value)}
                placeholder="Enter the SHA-256 hash of the content"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-200 focus:border-gray-400 font-mono"
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter the SHA-256 hash of the article content you want to verify.
              </p>
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <FaInfoCircle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <button
            onClick={handleVerify}
            disabled={loading}
            className="bg-gray-800 text-white px-6 py-3 rounded-md hover:bg-gray-700 transition-colors duration-200 disabled:opacity-50 flex items-center"
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin mr-2" />
                Verifying...
              </>
            ) : (
              <>
                <FaSearch className="mr-2" />
                Verify Content
              </>
            )}
          </button>
        </div>
      </div>

      {result && (
        <div className={`border-t pt-8 mb-12 ${
          result.verified ? 'border-green-500' : 'border-red-500'
        }`}>
          <div className="flex items-start">
            <div className={`flex items-center justify-center h-12 w-12 rounded-full mr-4 ${
              result.verified ? 'bg-green-100 text-green-500' : 'bg-red-100 text-red-500'
            }`}>
              {result.verified ? (
                <FaCheck className="h-6 w-6" />
              ) : (
                <FaTimes className="h-6 w-6" />
              )}
            </div>
            
            <div>
              <h3 className="text-xl font-serif font-semibold mb-2">
                {result.verified ? 'Content Verified!' : 'Content Not Verified'}
              </h3>
              <p className="text-gray-600 mb-4">{result.message}</p>
              
              {result.verified && result.article && (
                <div className="border border-gray-200 p-6 rounded-md mt-4">
                  <h4 className="text-lg font-serif font-semibold mb-3">{result.article.title}</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm mb-6 text-gray-600">
                    <div>
                      <span className="text-gray-500">Source:</span>{' '}
                      {result.article.source_name}
                    </div>
                    
                    <div>
                      <span className="text-gray-500">Published:</span>{' '}
                      {formatDate(result.article.publication_date)}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-4">
                    <Link
                      to={`/articles/${result.article.id}`}
                      className="text-gray-800 hover:text-black font-medium"
                    >
                      View Article
                    </Link>
                    
                    <a
                      href={result.article.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-gray-800 flex items-center text-sm"
                    >
                      <FaLink className="mr-1" />
                      Original Source
                    </a>
                    
                    {result.article.blockchain_tx_hash && (
                      <a
                        href={`https://polygonscan.com/tx/${result.article.blockchain_tx_hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-gray-800 flex items-center text-sm"
                      >
                        View on Blockchain
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="border-t pt-8">
        <h3 className="text-xl font-serif font-semibold mb-4">How Verification Works</h3>
        <ol className="list-decimal pl-5 space-y-2 text-gray-600">
          <li>When an article is submitted, we generate a SHA-256 hash of its content.</li>
          <li>This hash is stored on the Polygon blockchain as a tamper-proof record.</li>
          <li>When you verify content, we generate a new hash of the current content.</li>
          <li>We compare this new hash with the one stored on the blockchain.</li>
          <li>If they match, the content has not been tampered with since it was recorded.</li>
        </ol>
      </div>
    </div>
  );
};

export default VerifyArticlePage;
