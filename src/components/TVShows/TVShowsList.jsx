import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./TVShowsList.module.css";

const TVShowsList = () => {
    const [tvShows, setTvShows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTVShows = async () => {
            try {
                const response = await axios.get("http://localhost:5233/api/tv/popular");
                console.log(response.data); // Логування для перевірки
                setTvShows(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTVShows();
    }, []);

    if (loading) return <p className={styles.loading}>Loading...</p>;
    if (error) return <p className={styles.error}>Error: {error}</p>;

    return (
        <div className={styles.tvShowsList}>
            <h2>Top Rated TV Shows</h2>
            <div className={styles.grid}>
                {tvShows.map((show) => (
                    <div key={show.id} className={styles.card}>
                        {/*<img*/}
                        {/*    src={show.poster_path ? `https://image.tmdb.org/t/p/w300${show.poster_path}` : "https://via.placeholder.com/300x450?text=No+Image"}*/}
                        {/*    alt={show.name}*/}
                        {/*    className={styles.image}*/}
                        {/*/>*/}
                        <img
                            src={`https://image.tmdb.org/t/p/w200${show.poster_path}`}
                            alt={show.title}
                            className={styles.image}
                        />
                        <div className={styles.info}>
                            <h3>{show.name}</h3>
                            <p>Rating: {show.vote_average ? "⭐".repeat(Math.round(show.vote_average / 2)) : "N/A"}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TVShowsList;
