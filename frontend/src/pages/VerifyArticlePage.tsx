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
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-palestine-black mb-2">Verify Content</h1>
        <p className="text-gray-600">
          Verify if an article has been tampered with by checking its content against the blockchain.
        </p>
      </div>

      <div className="card mb-8">
        <div className="p-6">
          <div className="mb-6">
            <div className="flex space-x-4 mb-6">
              <button
                type="button"
                onClick={() => setVerifyMethod('url')}
                className={`px-4 py-2 rounded-md mr-2 ${
                  verifyMethod === 'url'
                    ? 'bg-palestine-green text-white'
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
                    ? 'bg-palestine-green text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <FaHashtag className="inline mr-2" />
                Verify by Hash
              </button>
            </div>

            {verifyMethod === 'url' ? (
              <div>
                <label htmlFor="url" className="form-label">
                  <FaLink className="mr-2" />
                  Article URL
                </label>
                <input
                  type="url"
                  id="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com/article"
                  className="form-input"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter the full URL of the article you want to verify.
                </p>
              </div>
            ) : (
              <div>
                <label htmlFor="contentHash" className="form-label">
                  <FaHashtag className="mr-2" />
                  Content Hash
                </label>
                <input
                  type="text"
                  id="contentHash"
                  value={contentHash}
                  onChange={(e) => setContentHash(e.target.value)}
                  placeholder="Enter the SHA-256 hash of the content"
                  className="form-input font-mono"
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
              className="btn btn-primary flex items-center"
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
      </div>

      {result && (
        <div className={`card border-l-4 ${
          result.verified ? 'border-green-500' : 'border-red-500'
        }`}>
          <div className="p-6">
            <div className="flex items-start">
              <div className={`flex items-center justify-center h-16 w-16 rounded-full mx-auto mb-4 ${
                result.verified ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {result.verified ? (
                  <FaCheck className="h-6 w-6" />
                ) : (
                  <FaTimes className="h-6 w-6" />
                )}
              </div>
              
              <div>
                <h3 className="text-xl font-bold mb-2">
                  {result.verified ? 'Content Verified!' : 'Content Not Verified'}
                </h3>
                <p className="text-gray-600 mb-4">{result.message}</p>
                
                {result.verified && result.article && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">{result.article.title}</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm mb-4">
                      <div>
                        <span className="text-gray-500">Source:</span>{' '}
                        {result.article.source_name}
                      </div>
                      
                      <div>
                        <span className="text-gray-500">Published:</span>{' '}
                        {formatDate(result.article.publication_date)}
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      <Link
                        to={`/articles/${result.article.id}`}
                        className="btn btn-primary btn-sm"
                      >
                        View Article
                      </Link>
                      
                      <a
                        href={result.article.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-secondary btn-sm"
                      >
                        <FaLink className="mr-1" />
                        Original Source
                      </a>
                      
                      {result.article.blockchain_tx_hash && (
                        <a
                          href={`https://polygonscan.com/tx/${result.article.blockchain_tx_hash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-outline btn-sm"
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
        </div>
      )}

      <div className="mt-8 bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">How Verification Works</h3>
        <ol className="list-decimal pl-5 space-y-2">
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
