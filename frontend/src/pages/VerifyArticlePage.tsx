import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { FaSearch, FaCheck, FaTimes, FaLink, FaHashtag, FaInfoCircle, FaSpinner, FaFingerprint } from 'react-icons/fa';

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

  const formatDate = useCallback((dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }, []);

  const handleVerifyByUrl = useCallback(async () => {
    setError(null);
    setResult(null);
    
    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }
    
    try {
      setLoading(true);
      
      const endpoint = `/api/verify/url?url=${encodeURIComponent(url)}`;
      
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
  }, [url]);

  const handleVerifyByHash = useCallback(async () => {
    setError(null);
    setResult(null);
    
    if (!contentHash.trim()) {
      setError('Please enter a content hash');
      return;
    }
    
    try {
      setLoading(true);
      
      const endpoint = `/api/verify/hash/${contentHash}`;
      
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
  }, [contentHash]);

  useEffect(() => {
    if (initialHash) {
      setVerifyMethod('hash');
      setContentHash(initialHash);
      handleVerifyByHash();
    }
  }, [initialHash, handleVerifyByHash]);

  return (
    <div className="max-w-2xl mx-auto px-5 sm:px-8 py-16">
      <header className="mb-16 text-center">
        <h1 className="text-4xl font-serif font-bold mb-4">Verify Content</h1>
        <p className="text-gray-600 max-w-xl mx-auto">
          Verify if an article has been tampered with by checking its content against the blockchain.
        </p>
      </header>

      <div className="mb-12">
        <div className="card">
          <div className="card-body">
            <div className="mb-6">
              <div className="flex space-x-4 mb-6">
                <button
                  type="button"
                  onClick={() => setVerifyMethod('url')}
                  className={`btn ${
                    verifyMethod === 'url'
                      ? 'btn-primary'
                      : 'btn-secondary'
                  }`}
                >
                  <FaLink className="inline mr-2" />
                  Verify by URL
                </button>
                
                <button
                  type="button"
                  onClick={() => setVerifyMethod('hash')}
                  className={`btn ${
                    verifyMethod === 'hash'
                      ? 'btn-primary'
                      : 'btn-secondary'
                  }`}
                >
                  <FaHashtag className="inline mr-2" />
                  Verify by Hash
                </button>
              </div>

              {verifyMethod === 'url' ? (
                <div>
                  <label htmlFor="url" className="form-label">
                    <FaLink className="mr-2 inline-block" />
                    Article URL
                  </label>
                  <input
                    type="url"
                    id="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com/article"
                    className="form-control"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Enter the full URL of the article you want to verify.
                  </p>
                  <div className="flex space-x-4 mt-4">
                    <button
                      type="button"
                      onClick={() => handleVerifyByUrl()}
                      disabled={loading || !url.trim()}
                      className="btn btn-primary"
                    >
                      {loading ? (
                        <>
                          <FaSpinner className="animate-spin mr-2" />
                          Verifying...
                        </>
                      ) : (
                        <>
                          <FaCheck className="mr-2" />
                          Verify URL
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setUrl('')}
                      className="btn btn-secondary"
                      disabled={loading || !url.trim()}
                    >
                      Clear
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <label htmlFor="contentHash" className="form-label">
                    <FaHashtag className="mr-2 inline-block" />
                    Content Hash
                  </label>
                  <input
                    type="text"
                    id="contentHash"
                    value={contentHash}
                    onChange={(e) => setContentHash(e.target.value)}
                    placeholder="Enter the SHA-256 hash of the content"
                    className="form-control font-mono"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Enter the SHA-256 hash of the article content you want to verify.
                  </p>
                  <div className="flex space-x-4 mt-4">
                    <button
                      type="button"
                      onClick={() => handleVerifyByHash()}
                      disabled={loading || !contentHash.trim()}
                      className="btn btn-primary"
                    >
                      {loading ? (
                        <>
                          <FaSpinner className="animate-spin mr-2" />
                          Verifying...
                        </>
                      ) : (
                        <>
                          <FaFingerprint className="mr-2" />
                          Verify Hash
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setContentHash('')}
                      className="btn btn-secondary"
                      disabled={loading || !contentHash.trim()}
                    >
                      Clear
                    </button>
                  </div>
                </div>
              )}
            </div>

            {error && (
              <div className="alert alert-danger mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <FaInfoCircle className="h-5 w-5" />
                  </div>
                  <div className="ml-3">
                    <p>{error}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {result && (
        <div className="card mb-12">
          <div className={`card-header ${
            result.verified ? 'bg-green-50' : 'bg-red-50'
          }`}>
            <div className="flex items-center">
              <div className={`flex items-center justify-center h-10 w-10 rounded-full mr-4 ${
                result.verified ? 'bg-green-100 text-green-500' : 'bg-red-100 text-red-500'
              }`}>
                {result.verified ? (
                  <FaCheck className="h-5 w-5" />
                ) : (
                  <FaTimes className="h-5 w-5" />
                )}
              </div>
              
              <h3 className="text-xl font-serif font-semibold">
                {result.verified ? 'Content Verified!' : 'Content Not Verified'}
              </h3>
            </div>
          </div>
          
          <div className="card-body">
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
                      className="btn btn-secondary btn-sm"
                    >
                      View on Blockchain
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-body">
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
    </div>
  );
};

export default VerifyArticlePage;
