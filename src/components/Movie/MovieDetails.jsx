import { useParams } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import styles from './MovieDetails.module.css';

const MovieDetails = () => {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const [cast, setCast] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const castListRef = useRef(null); // Референс на блок зі списком акторів

    useEffect(() => {
        const fetchMovieDetails = async () => {
            try {
                // Отримати інформацію про фільм
                const response = await axios.get(`http://localhost:5233/api/movies/${id}`);
                setMovie(response.data);

                // Отримати трейлер
                const trailerResponse = await axios.get(`http://localhost:5233/api/movies/${id}/trailer`);
                setMovie((prevMovie) => ({
                    ...prevMovie,
                    trailerKey: trailerResponse.data.trailerKey,
                }));

                // Отримати акторів
                const castResponse = await axios.get(`http://localhost:5233/api/movies/${id}/credits`);
                setCast(castResponse.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMovieDetails();
    }, [id]);

    // Прокрутка вліво
    const scrollLeft = () => {
        if (castListRef.current) {
            castListRef.current.scrollBy({
                left: -200, // Крок прокрутки (можна змінити)
                behavior: 'smooth',
            });
        }
    };

    // Прокрутка вправо
    const scrollRight = () => {
        if (castListRef.current) {
            castListRef.current.scrollBy({
                left: 200, // Крок прокрутки (можна змінити)
                behavior: 'smooth',
            });
        }
    };

    if (loading) return <p className={styles.loading}>Loading...</p>;
    if (error) return <p className={styles.error}>Error: {error}</p>;

    return (
        <div className={styles.movieDetails}>
            <div className={styles.header}>
                <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    className={styles.poster}
                />
                <div className={styles.info}>
                    <h1 className={styles.title}>{movie.title}</h1>
                    <p className={styles.overview}>{movie.overview}</p>
                    <p>
                        Rating: {" "}
                        <span className={styles.stars}>
                            {"⭐".repeat(Math.round(movie.vote_average / 2))}
                        </span>
                    </p>
                </div>
            </div>

            <div className={styles.cast}>
                <h2>Cast</h2>
                <div className={styles.castContainer}>
                    <button className={styles.scrollButton} onClick={scrollLeft}>
                        ←
                    </button>
                    <div className={styles.castList} ref={castListRef}>
                        {cast.map((actor) => (
                            <div key={actor.name} className={styles.actor}>
                                <img
                                    src={
                                        actor.profile_path
                                            ? `https://image.tmdb.org/t/p/w200${actor.profile_path}`
                                            : "https://via.placeholder.com/200x300?text=No+Image"
                                    }
                                    alt={actor.name}
                                    className={styles.actorImage}
                                />
                                <div className={styles.actorInfo}>
                                    <p className={styles.actorName}>{actor.name}</p>
                                    <p className={styles.actorCharacter}>as {actor.character}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className={styles.scrollButton} onClick={scrollRight}>
                        →
                    </button>
                </div>
            </div>

            <div className={styles.player}>
                <h2>Watch Trailer</h2>
                <iframe
                    src={`https://www.youtube.com/embed/${movie.trailerKey}`}
                    title={movie.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className={styles.video}
                />
            </div>
        </div>
    );
};

export default MovieDetails;
