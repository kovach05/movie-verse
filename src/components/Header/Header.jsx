import PropTypes from 'prop-types';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Header.module.css';

const Header = ({ title = 'MovieVerse' }) => {
    const navigate = useNavigate();

    const handleNavigation = (path) => {
        navigate(path);
    };

    return (
        <header className={styles.header}>
            <div className={styles.logo}>
                <Link to="/" className={styles.logoLink}>{title}</Link>
            </div>
            <nav className={styles.nav}>
                <button className={styles.navButton} onClick={() => handleNavigation('/movies')}>
                    Movies
                </button>
                <button className={styles.navButton} onClick={() => handleNavigation('/tv-shows')}>
                    TV Shows
                </button>
                <button className={styles.navButton}>Live</button>
            </nav>
            <div className={styles.actions}>
                <input
                    type="text"
                    className={styles.searchInput}
                    placeholder="Search"
                />
                <button
                    className={styles.authButton}
                    onClick={() => handleNavigation('/registration')}
                >
                    Register
                </button>
                <button
                    className={styles.authButton}
                    onClick={() => handleNavigation('/signin')}
                >
                    Sign In
                </button>
                <button
                    className={styles.authButton}
                    onClick={() => handleNavigation('/profile')}
                >
                    Profile
                </button>
            </div>
        </header>
    );
};

Header.propTypes = {
    title: PropTypes.string,
};

export default Header;
