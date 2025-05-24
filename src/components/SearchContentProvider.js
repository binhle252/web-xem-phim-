import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import '../styles/ListMovie.css';

function SearchResults() {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('query');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const searchMovies = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/movies/search?query=${query}`);
        setResults(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Lỗi tìm kiếm:", error);
        setLoading(false);
      }
    };

    if (query) {
      searchMovies();
    }
  }, [query]);

  if (loading) {
    return <div className="text-center py-8">Đang tìm kiếm...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">
        Kết quả tìm kiếm cho: "{query}"
      </h1>
      
      {results.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map(movie => (
            <div key={movie.movie_id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <img 
                src={movie.image_url || '/placeholder.jpg'} 
                alt={movie.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{movie.title}</h2>
                <p className="text-gray-600 mb-1">{movie.genre}</p>
                <p className="text-gray-500 text-sm">{movie.year}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          Không tìm thấy phim nào phù hợp với "{query}"
        </div>
      )}
    </div>
  );
}

export default SearchResults;