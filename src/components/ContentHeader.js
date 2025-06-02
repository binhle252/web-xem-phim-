import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import logo_web from '../picture/logo-1.webp';
import '../styles/ContentHeader.css';

function ContentHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');

  // Xác định trang hiện tại
  const currentPage = location.pathname.split('/').pop(); // 'all', 'approved', 'pending'

  // Hàm xử lý đăng xuất
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('userChanged'));
    navigate('/login');
  };

  // Hàm lấy placeholder cho ô tìm kiếm
  const getSearchPlaceholder = () => {
    switch (currentPage) {
      case 'approved':
        return 'phim đã duyệt';
      case 'pending':
        return 'phim chờ duyệt';
      default:
        return 'tất cả phim';
    }
  };

  // Hàm xử lý khi nhấn Enter
  const handleSearchSubmit = (e) => {
    if (e.key !== 'Enter' || !searchTerm.trim()) return;

    const query = encodeURIComponent(searchTerm.trim());
    let searchPath = '';

    // Điều hướng theo trang hiện tại
    switch (currentPage) {
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
  };

  return (
    <nav>
      <div className="logo">
        <Link to="/content/movies/all">
          <img src={logo_web} alt="Logo" className="logo-img" />
        </Link>
      </div>
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
      <div className="search">
        <div className="search-container">
          <input
            type="text"
            placeholder={`Tìm kiếm ${getSearchPlaceholder()}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleSearchSubmit}
            className="search-input"
          />
        </div>
      </div>
      <div className="user-infor">
        <ul>
          <li>Ban Nội dung</li>
          <li>
            <button onClick={handleLogout} className="button-logout">
              Đăng Xuất
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default ContentHeader;