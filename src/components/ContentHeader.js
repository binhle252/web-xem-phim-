import axios from 'axios';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import logo_web from '../picture/logo-1.webp';
import '../styles/ContentHeader.css';

function ContentHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Xác định trang hiện tại
  const currentPage = location.pathname.split('/').pop(); // 'all', 'approved', hoặc 'pending'

  // Hàm xử lý đăng xuất
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("userChanged"));
    navigate("/login");
  };

  // Hàm lấy placeholder cho ô tìm kiếm
  const getSearchPlaceholder = () => {
    switch(currentPage) {
      case 'approved': return 'phim đã duyệt';
      case 'pending': return 'phim chờ duyệt';
      default: return 'tất cả phim';
    }
  };

  // Hàm tìm kiếm phim
  const searchMovies = async (query) => {
    try {
      setIsLoading(true);
      let url = `http://localhost:3001/api/movies/search?query=${encodeURIComponent(query)}`;
      
      // Thêm filter theo trang hiện tại
      if (currentPage === 'approved') {
        url += '&status=approved';
      } else if (currentPage === 'pending') {
        url += '&status=pending';
      }

      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi tìm kiếm phim:", error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Hàm xử lý thay đổi ô tìm kiếm (gợi ý)
  const handleSearchChange = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.length > 1) {
      const results = await searchMovies(value);
      setSuggestions(results.slice(0, 5)); // Giới hạn 5 gợi ý
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Hàm xử lý khi nhấn Enter
  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      const query = encodeURIComponent(searchTerm.trim());
      let searchPath = '';
      
      // Điều hướng theo trang hiện tại
      switch(currentPage) {
        case 'approved':
          searchPath = `/content/movies/search-approved?query=${query}`;
          break;
        case 'pending':
          searchPath = `/content/movies/search-pending?query=${query}`;
          break;
        default:
          searchPath = `/content/movies/search-all?query=${query}`;
      }

      navigate(searchPath);
      setSearchTerm('');
      setShowSuggestions(false);
    }
  };

  // Hàm chọn một gợi ý
  const handleSuggestionClick = (movie) => {
    navigate(`/content/movies/detail/${movie.movie_id}`);
    setSearchTerm('');
    setShowSuggestions(false);
  };

  // Đóng gợi ý khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = () => setShowSuggestions(false);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <nav>
      {/* Logo */}
      <div className="logo">
        <Link to="/content/movies/all">
          <img src={logo_web} alt="Logo" className="logo-img" />
        </Link>
      </div>

      {/* Menu chính */}
      <div className="header">
        <ul>
          <li>
            <Link
              to="/content/movies/all"
              className={`nav-link ${location.pathname === '/content/movies/all' ? 'active' : 'inactive'}`}
            >
              Tất cả phim
            </Link>
          </li>
          <li>
            <Link
              to="/content/movies/approved"
              className={`nav-link ${location.pathname === '/content/movies/approved' ? 'active' : 'inactive'}`}
            >
              Đã duyệt
            </Link>
          </li>
          <li>
            <Link
              to="/content/movies/pending"
              className={`nav-link ${location.pathname === '/content/movies/pending' ? 'active' : 'inactive'}`}
            >
              Chờ duyệt
            </Link>
          </li>
        </ul>
      </div>

      {/* Ô tìm kiếm */}
      <div className="search">
        <div className="search-container">
          <input
            type="text"
            placeholder={`Tìm kiếm ${getSearchPlaceholder()}...`}
            value={searchTerm}
            onChange={handleSearchChange}
            onKeyDown={handleSearchSubmit}
            onClick={(e) => e.stopPropagation()}
            className="search-input"
          />
          
          {/* Gợi ý tìm kiếm */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="suggestions">
              {suggestions.map((movie) => (
                <div
                  key={movie.movie_id}
                  className="suggestion-item"
                  onClick={() => handleSuggestionClick(movie)}
                >
                  <div className="suggestion-title">{movie.title}</div>
                  <div className="suggestion-details">
                    {movie.year} • {movie.genre} • {movie.status === 'approved' ? 'Đã duyệt' : 'Chờ duyệt'}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Loading indicator */}
          {isLoading && (
            <div className="loading-spinner"></div>
          )}
        </div>
      </div>

      {/* Thông tin người dùng */}
      <div className="user-infor">
        <ul>
          <li>Ban Nội dung</li>
          <li>
            <button
              onClick={handleLogout}
              className="button-logout"
            >
              Đăng Xuất
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default ContentHeader;