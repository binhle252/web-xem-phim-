import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

function SearchPendingMovies() {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('query');
  const [results, setResults] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:3001/api/movies/search?query=${query}&status=pending`)
      .then(res => setResults(res.data))
      .catch(err => console.error(err));
  }, [query]);

  return (
    <div>
      <h2>Kết quả tìm kiếm "{query}" trong tất cả phim</h2>
      {/* Hiển thị kết quả */}
    </div>
  );
}

export default SearchPendingMovies;