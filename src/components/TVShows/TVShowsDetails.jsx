import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import styles from "./TVShowDetails.module.css";

const TVShowDetails = () => {
    const { id } = useParams();
    const [show, setShow] = useState(null);
    const [cast, setCast] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const castListRef = useRef(null); // Референс на список акторів

    useEffect(() => {
        const fetchTVShowDetails = async () => {
            try {
                // Отримати інформацію про серіал
                const response = await axios.get(`http://localhost:5233/api/tv/${id}`);
                setShow(response.data);

                // Спробувати отримати трейлер
                try {
                    const trailerResponse = await axios.get(
                        `http://localhost:5233/api/tv/${id}/trailer`
                    );
                    setShow((prevShow) => ({
                        ...prevShow,
                        trailerKey: trailerResponse.data.trailerKey,
                    }));
                } catch (trailerError) {
                    console.warn("Trailer not found:", trailerError.message);
                    setShow((prevShow) => ({
                        ...prevShow,
                        trailerKey: null, // Вказуємо, що трейлера немає
                    }));
                }

                // Отримати акторів
                const castResponse = await axios.get(
                    `http://localhost:5233/api/tv/${id}/credits`
                );
                setCast(castResponse.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTVShowDetails();
    }, [id]);


    // Прокрутка вліво
    const scrollLeft = () => {
        if (castListRef.current) {
            castListRef.current.scrollBy({
                left: -200,
                behavior: "smooth",
            });
        }
    };

    // Прокрутка вправо
    const scrollRight = () => {
        if (castListRef.current) {
            castListRef.current.scrollBy({
                left: 200,
                behavior: "smooth",
            });
        }
    };

    if (loading) return <p className={styles.loading}>Loading...</p>;
    if (error) return <p className={styles.error}>Error: {error}</p>;

    return (
        <div className={styles.tvShowDetails}>
            <div className={styles.header}>
                <img
                    src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
                    alt={show.name}
                    className={styles.poster}
                />
                <div className={styles.info}>
                    <h1 className={styles.title}>{show.name}</h1>
                    <p className={styles.overview}>{show.overview}</p>
                    <p>
                        Rating:{" "}
                        <span className={styles.stars}>
                            {"⭐".repeat(Math.round(show.vote_average / 2))}
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
                            <div key={actor.id} className={styles.actor}>
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
                {show.trailerKey ? (
                    <iframe
                        src={`https://www.youtube.com/embed/${show.trailerKey}`}
                        title={show.name}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className={styles.video}
                    />
                ) : (
                    <p className={styles.noTrailer}>Trailer is not available.</p>
                )}
            </div>

        </div>
    );
};

export default TVShowDetails;
