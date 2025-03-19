import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaCalendarAlt, FaExternalLinkAlt, FaSpinner, FaArrowLeft, FaCheck, FaHashtag } from 'react-icons/fa';

interface Article {
  id: number;
  title: string;
  source_url: string;
  source_name: string;
  publication_date: string;
  content_text: string;
  content_hash: string;
  blockchain_tx_hash: string | null;
  created_at: string;
}

const ArticleDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/articles/${id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch article');
        }
        
        const data = await response.json();
        setArticle(data);
        setError(null);
      } catch (err) {
        setError('Failed to load article. Please try again later.');
        console.error('Error fetching article:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchArticle();
    }
  }, [id]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <FaSpinner className="animate-spin text-4xl text-palestine-green" />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8">
          <p className="text-red-700">{error || 'Article not found'}</p>
        </div>
        <Link to="/articles" className="text-palestine-green hover:underline flex items-center">
          <FaArrowLeft className="mr-2" />
          Back to Articles
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/articles" className="text-palestine-green hover:underline flex items-center mb-6">
        <FaArrowLeft className="mr-2" />
        Back to Articles
      </Link>

      <article>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-palestine-black mb-4">{article.title}</h1>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
            <div className="flex items-center">
              <FaCalendarAlt className="mr-1" />
              <span>{formatDate(article.publication_date)}</span>
            </div>
            
            <div className="bg-gray-100 px-3 py-1 rounded-full">
              {article.source_name}
            </div>
            
            {article.blockchain_tx_hash && (
              <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full flex items-center">
                <FaCheck className="mr-1" />
                Blockchain Verified
              </div>
            )}
          </div>
          
          {/* Flag-colored separator */}
          <div className="flex h-1 mb-8">
            <div className="flex-1 bg-palestine-black"></div>
            <div className="flex-1 bg-palestine-white"></div>
            <div className="flex-1 bg-palestine-green"></div>
            <div className="flex-1 bg-palestine-red"></div>
          </div>
        </div>

        {/* Article content */}
        <div className="prose prose-lg max-w-none mb-8">
          {article.content_text.split('\n\n').map((paragraph, index) => (
            <p key={index} className="mb-4">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Source and verification info */}
        <div className="bg-gray-50 rounded-lg p-6 mt-8">
          <h3 className="text-lg font-semibold mb-4">Article Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Source</p>
              <a 
                href={article.source_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-palestine-green hover:underline flex items-center"
              >
                <FaExternalLinkAlt className="mr-1" />
                View Original Article
              </a>
            </div>
            
            <div>
              <p className="text-sm text-gray-500 mb-1">Content Hash</p>
              <div className="flex items-center">
                <FaHashtag className="text-gray-400 mr-1" />
                <code className="text-xs bg-gray-100 p-1 rounded overflow-x-auto max-w-full">
                  {article.content_hash}
                </code>
              </div>
            </div>
            
            {article.blockchain_tx_hash && (
              <div className="md:col-span-2">
                <p className="text-sm text-gray-500 mb-1">Blockchain Transaction</p>
                <a 
                  href={`https://polygonscan.com/tx/${article.blockchain_tx_hash}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-palestine-green hover:underline flex items-center text-sm"
                >
                  <FaExternalLinkAlt className="mr-1" />
                  View on Polygon Explorer
                </a>
              </div>
            )}
          </div>
          
          <div className="mt-6">
            <Link 
              to={`/verify?hash=${article.content_hash}`}
              className="btn btn-primary inline-flex items-center"
            >
              <FaCheck className="mr-2" />
              Verify This Article
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
};

export default ArticleDetailPage;
