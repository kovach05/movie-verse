import styles from './MovieS.module.css';
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const MovieS = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const response = await axios.get("http://localhost:5233/api/movies/popular");
                setMovies(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className={styles.movieList}>
            <h2>Popular Movies</h2>
            <div className={styles.movies}>
                {movies.map((movie) => (
                    <div
                        key={movie.id}
                        className={styles.movieCard}
                        onClick={() => navigate(`/movie/${movie.id}`)} // Перехід на сторінку деталей
                    >
                        <img
                            src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                            alt={movie.title}
                            className={styles.movieImage}
                        />
                        <div className={styles.movieInfo}>
                            <h3>{movie.title}</h3>
                            <p>
                                Rating:{" "}
                                <span className={styles.stars}>
                                    {"⭐".repeat(Math.round(movie.vote_average / 2))}
                                </span>
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MovieS;
