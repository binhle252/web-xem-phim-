import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../styles/ListMovie.css';

function AdminList() {
    const [animeList, setAnimeList] = useState([]);

    // Memoize fetchMovies để tránh ESLint warning (nếu có)
    const fetchMovies = useCallback(() => {
        axios.get('http://localhost:3001/api/moviesad')
            .then(res => {
                // Lọc chỉ các phim có status === 'approved'
                const approvedMovies = res.data.filter(item => item.status.toLowerCase() === 'approved');
                setAnimeList(approvedMovies);
            })
            .catch(err => console.error("Lỗi khi lấy danh sách phim:", err));
    }, []);

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
                    animeList.map((item) => (
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
                            onDelete={fetchMovies} // Truyền hàm fetchMovies để làm mới danh sách
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
    // Định dạng trạng thái
    const getStatusClass = () => {
        return 'approved'; // Chỉ hiển thị phim đã duyệt nên trạng thái luôn là 'approved'
    };

    const handleDelete = (id) => {
        if (window.confirm("Bạn có chắc muốn xóa phim này không?")) {
            axios.delete(`http://localhost:3001/api/movies/${id}`)
                .then(() => {
                    alert("Xóa phim thành công!");
                    onDelete(); // Gọi lại fetchMovies để làm mới danh sách
                })
                .catch(err => {
                    console.error("Lỗi khi xóa:", err);
                    alert("Xóa thất bại!");
                });
        }
    };

    return (
        <div className="movie-item">
            <div className="movie-image">
                <img
                    src={image_url || '/placeholder.jpg'}
                    alt={title}
                    onError={(e) => {
                        e.target.src = '/placeholder.jpg';
                    }}
                />
            </div>
            <div className="movie-info">
                <p><strong>Tên phim:</strong> {title}</p>
                <p><strong>Thể loại:</strong> {genre}</p>
                <p><strong>Năm phát hành:</strong> {year}</p>
                <p><strong>Thời lượng:</strong> {duration} phút</p>
                {episodes && <p><strong>Số tập:</strong> {episodes} (Đang cập nhật)</p>}
                <div className={`status ${getStatusClass()}`}>
                    <span className="dot" />
                    Trạng thái: Đã duyệt
                </div>
            </div>
            <div className="actions">
                <Link to={`/admin/edit/${movie_id}`}>
                    <button>Sửa thông tin phim</button>
                </Link>
                <button onClick={() => handleDelete(movie_id)}>Xóa Phim</button>
                <Link to={`/content/episodes/${movie_id}`}>
                    <button>Quản lý tập phim</button>
                </Link>
            </div>
        </div>
    );
}

export default AdminList;