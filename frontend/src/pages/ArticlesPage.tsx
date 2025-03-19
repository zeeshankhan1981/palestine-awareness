import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaNewspaper, FaExternalLinkAlt, FaSpinner } from 'react-icons/fa';

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
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-palestine-black mb-2">Articles</h1>
        <p className="text-gray-600">
          Browse verified articles about Palestine from trusted sources.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <FaSpinner className="animate-spin text-4xl text-palestine-green" />
        </div>
      ) : error ? (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8">
          <p className="text-red-700">{error}</p>
        </div>
      ) : articles.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <FaNewspaper className="text-5xl text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Articles Found</h3>
          <p className="text-gray-600 mb-4">
            There are no articles available at the moment.
          </p>
          <Link to="/submit" className="btn btn-primary inline-block">
            Submit an Article
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 mb-8">
            {articles.map((article) => (
              <article 
                key={article.id} 
                className="card hover:shadow-lg transition-shadow duration-200"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h2 className="text-xl font-bold text-palestine-black hover:text-palestine-green transition-colors duration-200">
                      <Link to={`/articles/${article.id}`}>
                        {article.title}
                      </Link>
                    </h2>
                    <span className="text-sm bg-gray-100 px-2 py-1 rounded text-gray-600">
                      {article.source_name}
                    </span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <FaCalendarAlt className="mr-1" />
                    <span>{formatDate(article.publication_date)}</span>
                  </div>
                  
                  <div className="flex flex-wrap justify-between items-center mt-4">
                    <Link 
                      to={`/articles/${article.id}`} 
                      className="text-palestine-green hover:text-palestine-green/80 font-medium flex items-center"
                    >
                      Read More
                    </Link>
                    
                    <div className="flex items-center space-x-2 text-sm">
                      <a 
                        href={article.source_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-gray-500 hover:text-palestine-black flex items-center"
                      >
                        <FaExternalLinkAlt className="mr-1" />
                        Source
                      </a>
                      
                      {article.blockchain_tx_hash && (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                          Blockchain Verified
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <nav className="inline-flex rounded-md shadow">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-4 py-2 border border-gray-300 text-sm font-medium ${
                      currentPage === page
                        ? 'bg-palestine-green text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </nav>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ArticlesPage;
