import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaExternalLinkAlt, FaSpinner } from 'react-icons/fa';

interface Article {
  id: number;
  title: string;
  source_url: string;
  source_name: string;
  publication_date: string;
  content_hash: string;
  blockchain_tx_hash: string | null;
  created_at: string;
}

interface ArticlesResponse {
  articles: Article[];
  totalPages: number;
  currentPage: number;
}

const ArticlesPage: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/articles?page=${currentPage}&limit=10`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch articles');
        }
        
        const data: ArticlesResponse = await response.json();
        setArticles(data.articles);
        setTotalPages(data.totalPages);
        setError(null);
      } catch (err) {
        setError('Failed to load articles. Please try again later.');
        console.error('Error fetching articles:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="max-w-2xl mx-auto px-5 sm:px-8 py-16">
      <header className="mb-16 text-center">
        <h1 className="text-4xl font-serif font-bold mb-4">Palestine News Hub</h1>
        <p className="text-gray-600 max-w-xl mx-auto">
          Verified news and analysis about Palestine from trusted sources
        </p>
      </header>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <FaSpinner className="animate-spin text-4xl text-gray-500" />
        </div>
      ) : error ? (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8">
          <p className="text-red-700">{error}</p>
        </div>
      ) : articles.length === 0 ? (
        <div className="text-center py-16 border-t border-b">
          <h3 className="text-xl font-semibold mb-2">No Articles Found</h3>
          <p className="text-gray-600 mb-4">
            There are no articles available at the moment.
          </p>
          <Link to="/submit" className="inline-block px-5 py-2 bg-black text-white font-medium rounded">
            Submit an Article
          </Link>
        </div>
      ) : (
        <>
          <div className="divide-y">
            {articles.map((article) => (
              <article key={article.id} className="py-10 first:pt-0">
                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <span className="font-medium text-gray-700">{article.source_name}</span>
                  <span className="mx-2">•</span>
                  <span className="flex items-center">
                    <FaCalendarAlt className="mr-1 text-xs" />
                    {formatDate(article.publication_date)}
                  </span>
                  {article.blockchain_tx_hash && (
                    <>
                      <span className="mx-2">•</span>
                      <span className="text-green-700 text-xs font-medium">Verified</span>
                    </>
                  )}
                </div>
                
                <h2 className="text-2xl font-serif font-bold mb-4 hover:text-gray-700 transition-colors">
                  <Link to={`/articles/${article.id}`}>
                    {article.title}
                  </Link>
                </h2>
                
                <div className="flex items-center mt-6 space-x-4">
                  <Link 
                    to={`/articles/${article.id}`} 
                    className="text-gray-800 hover:text-black font-medium"
                  >
                    Read more
                  </Link>
                  
                  <a 
                    href={article.source_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-gray-800 flex items-center text-sm"
                  >
                    <FaExternalLinkAlt className="mr-1" />
                    Original source
                  </a>
                </div>
              </article>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-12 pt-8 border-t">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-black disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ← Previous
              </button>
              
              <div className="text-sm text-gray-500">
                Page {currentPage} of {totalPages}
              </div>
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-black disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ArticlesPage;
