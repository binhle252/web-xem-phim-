import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';
import '../styles/ListMovie.css';

function ApprovedMovies() {
  const [animeList, setAnimeList] = useState([]);
  const location = useLocation();

  const fetchMovies = useCallback(() => {
    const queryParams = new URLSearchParams(location.search);
    const query = queryParams.get('query');
    let url = 'http://localhost:3001/api/moviesad';

    if (query) {
      url = `http://localhost:3001/api/movies/search?q=${encodeURIComponent(query)}&status=approved`;
    }

    axios.get(url)
      .then(res => {
        const approvedMovies = query
          ? res.data
          : res.data.filter(item => item.status.toLowerCase() === 'approved');
        setAnimeList(approvedMovies);
      })
      .catch(err => {
        console.error('Lỗi khi lấy danh sách phim:', err);
        setAnimeList([]);
      });
  }, [location.search]);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  return (
    <div className="list-movies">
      <div className="list-movie-tag">
        <li>Quản lý phim (Phim đã duyệt)</li>
      </div>
      <div className="button-add">
        <Link to="/admin/add">
          <button>THÊM PHIM</button>
        </Link>
      </div>
      <div className="list-movie">
        {animeList.length > 0 ? (
          animeList.map(item => (
            <AnimeItem
              key={item.movie_id}
              movie_id={item.movie_id}
              title={item.title}
              image_url={item.image_url}
              genre={item.genre}
              year={item.year}
              duration={item.duration}
              episodes={item.episodes}
              status={item.status}
              onDelete={fetchMovies}
            />
          ))
        ) : (
          <p className="text-center text-gray-500">Không có phim nào đã duyệt.</p>
        )}
      </div>
    </div>
  );
}

function AnimeItem({ movie_id, title, image_url, genre, year, duration, episodes, status, onDelete }) {
  const getStatusClass = () => 'approved';

  const handleDelete = () => {
    if (window.confirm('Bạn có chắc muốn xóa phim này không?')) {
      axios.delete(`http://localhost:3001/api/movies/${movie_id}`)
        .then(() => {
          alert('Xóa phim thành công!');
          onDelete();
        })
        .catch(err => {
          console.error('Lỗi khi xóa:', err);
          alert('Xóa thất bại!');
        });
    }
  };

  return (
    <div className="movie-item">
      <div className="movie-image">
        <img
          src={image_url || '/placeholder.jpg'}
          alt={title}
          onError={e => { e.target.src = '/placeholder.jpg'; }}
        />
      </div>
      <div className="movie-info">
        <p><strong>Tên phim:</strong> {title}</p>
        <p><strong>Thể loại:</strong> {genre}</p>
        <p><strong>Năm phát hành:</strong> {year}</p>
        <p><strong>Thời lượng:</strong> {duration} phút</p>
        {episodes && <p><strong>Số tập:</strong> {episodes}</p>}
        <div className={`status ${getStatusClass()}`}>
          <span className="dot" />
          Trạng thái: Đã duyệt
        </div>
      </div>
      <div className="actions">
        <Link to={`/admin/edit/${movie_id}`}>
          <button>Sửa thông tin phim</button>
        </Link>
        <button onClick={handleDelete}>Xóa Phim</button>
        <Link to={`/content/episodes/${movie_id}`}>
          <button>Quản lý tập phim</button>
        </Link>
      </div>
    </div>
  );
}

export default ApprovedMovies;
