import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./MovieList.module.css";

const MovieList = () => {
    const [movies, setMovies] = useState([]);
    const [tvShows, setTvShows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                // Завантажуємо фільми
                const moviesResponse = await axios.get("http://localhost:5233/api/movies/popular");
                setMovies(moviesResponse.data);

                // Завантажуємо серіали
                const tvShowsResponse = await axios.get("http://localhost:5233/api/tv/popular");
                setTvShows(tvShowsResponse.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchContent();
    }, []);

    if (loading) return <p className={styles.loading}>Loading...</p>;
    if (error) return <p className={styles.error}>Error: {error}</p>;

    return (
        <div className={styles.movieList}>
            <h2>Top Rated Movies</h2>
            <div className={styles.horizontalScroll}>
                {movies.map((movie) => (
                    <div key={movie.id} className={styles.card}>
                        <img
                            src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                            alt={movie.title}
                            className={styles.image}
                        />
                        <div className={styles.info}>
                            <h3>{movie.title}</h3>
                            <p>Rating: {"⭐".repeat(Math.round(movie.vote_average / 2))}</p>
                        </div>
                    </div>
                ))}
            </div>

            <h2>Top Rated TV Shows</h2>
            <div className={styles.horizontalScroll}>
                {tvShows.map((show) => (
                    <div key={show.id} className={styles.card}>
                        <img
                            src={`https://image.tmdb.org/t/p/w200${show.poster_path}`}
                            alt={show.name}
                            className={styles.image}
                        />
                        <div className={styles.info}>
                            <h3>{show.name}</h3>
                            <p>Rating: {"⭐".repeat(Math.round(show.vote_average / 2))}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MovieList;
