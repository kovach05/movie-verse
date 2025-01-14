import styles from "./TVShowsList.module.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const TVShowsList = () => {
    const [tvShows, setTvShows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTVShows = async () => {
            try {
                const response = await axios.get("http://localhost:5233/api/tv/popular");
                setTvShows(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTVShows();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className={styles.tvShowsList}>
            <h2>Top Rated TV Shows</h2>
            <div className={styles.tvShows}>
                {tvShows.map((show) => (
                    <div
                        key={show.id}
                        className={styles.tvShowCard}
                        onClick={() => navigate(`/tvshow/${show.id}`)} // Перехід на сторінку деталей
                    >
                        <img
                            src={
                                show.poster_path
                                    ? `https://image.tmdb.org/t/p/w300${show.poster_path}`
                                    : "https://via.placeholder.com/300x450?text=No+Image"
                            }
                            alt={show.name}
                            className={styles.tvShowImage}
                        />
                        <div className={styles.tvShowInfo}>
                            <h3>{show.name}</h3>
                            <p>
                                Rating:{" "}
                                <span className={styles.stars}>
                                    {show.vote_average
                                        ? "⭐".repeat(Math.round(show.vote_average / 2))
                                        : "N/A"}
                                </span>
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TVShowsList;
