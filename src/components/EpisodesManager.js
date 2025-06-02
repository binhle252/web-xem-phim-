import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../styles/EpisodesManager.css';

function EpisodesManager() {
    const { movie_id } = useParams();
    const [episodes, setEpisodes] = useState([]);
    const [newEpisode, setNewEpisode] = useState({
        episode_number: '',
        title: '',
        video_url: ''
    });
    const [editingEpisodeId, setEditingEpisodeId] = useState(null);

    // Memoize fetchEpisodes để tránh ESLint warning
    const fetchEpisodes = useCallback(() => {
        axios.get(`http://localhost:3001/api/episodes/movie/${movie_id}`)
            .then(res => setEpisodes(res.data))
            .catch(err => console.error('Lỗi khi lấy danh sách tập phim:', err));
    }, [movie_id]);

    // useEffect với fetchEpisodes trong dependency array
    useEffect(() => {
        fetchEpisodes();
    }, [fetchEpisodes]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewEpisode({
            ...newEpisode,
            [name]: name === 'episode_number' ? (value === '' ? '' : parseInt(value)) : value
        });
    };

    const handleAddOrUpdateEpisode = () => {
        if (editingEpisodeId) {
            // Logic cập nhật (giữ nguyên vì bạn đã sửa)
            axios.put(`http://localhost:3001/api/episodes/${editingEpisodeId}`, {
                ...newEpisode,
                movie_id: parseInt(movie_id)
            })
            .then(() => {
                alert('Cập nhật tập phim thành công!');
                setNewEpisode({ episode_number: '', title: '', video_url: '' });
                setEditingEpisodeId(null);
                fetchEpisodes();
            })
            .catch(err => console.error('Lỗi khi cập nhật tập:', err));
        } else {
            // Logic thêm mới
            axios.post(`http://localhost:3001/api/episodes`, {
                ...newEpisode,
                movie_id: parseInt(movie_id)
            })
            .then(() => {
                alert('Thêm tập phim thành công!');
                setNewEpisode({ episode_number: '', title: '', video_url: '' });
                fetchEpisodes();
            })
            .catch(err => console.error('Lỗi khi thêm tập:', err));
        }
    };

    const handleEdit = (episode) => {
        setNewEpisode({
            episode_number: episode.episode_number,
            title: episode.title,
            video_url: episode.video_url
        });
        setEditingEpisodeId(episode.episode_id);
    };

    const handleDelete = (episode_id) => {
        if (window.confirm('Bạn có chắc muốn xóa tập này không?')) {
            axios.delete(`http://localhost:3001/api/episodes/${episode_id}`)
                .then(() => {
                    alert('Đã xóa!');
                    fetchEpisodes();
                })
                .catch(err => console.error('Lỗi khi xóa:', err));
        }
    };

    const handleCancelEdit = () => {
        setNewEpisode({ episode_number: '', title: '', video_url: '' });
        setEditingEpisodeId(null);
    };

    return (
        <div className="episode-manager-container">
            <h2>Quản lý tập phim (Movie ID: {movie_id})</h2>

            {/* Thêm hoặc sửa tập phim */}
            <div className="add-episode-section">
                <input
                    type="number"
                    placeholder="Số tập"
                    name="episode_number"
                    value={newEpisode.episode_number}
                    onChange={handleInputChange}
                />
                <input
                    type="text"
                    placeholder="Tiêu đề"
                    name="title"
                    value={newEpisode.title}
                    onChange={handleInputChange}
                />
                <input
                    type="text"
                    placeholder="Link video (YouTube embed)"
                    name="video_url"
                    value={newEpisode.video_url}
                    onChange={handleInputChange}
                />
                <button onClick={handleAddOrUpdateEpisode}>
                    {editingEpisodeId ? 'Cập nhật' : 'Thêm tập'}
                </button>
                {editingEpisodeId && (
                    <button onClick={handleCancelEdit} className="cancel-button">
                        Hủy
                    </button>
                )}
            </div>

            {/* Danh sách tập phim */}
            <h3>📺 Danh sách tập phim</h3>
            <table className="episode-list-table">
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Số tập</th>
                        <th>Tiêu đề</th>
                        <th>Video</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {episodes.length === 0 ? (
                        <tr>
                            <td colSpan="5" className="empty-message">Chưa có tập phim nào</td>
                        </tr>
                    ) : (
                        episodes.map((ep, index) => (
                            <tr key={ep.episode_id}>
                                <td>{index + 1}</td>
                                <td>{ep.episode_number}</td>
                                <td>{ep.title}</td>
                                <td>
                                    <a href={ep.video_url} target="_blank" rel="noopener noreferrer">Xem</a>
                                </td>
                                <td>
                                    <button className="action-button edit-button" onClick={() => handleEdit(ep)}>Sửa</button>
                                    <button className="action-button" onClick={() => handleDelete(ep.episode_id)}>Xóa</button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default EpisodesManager;