import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./UserProfile.module.css";

const UserProfile = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(false);
    const [avatar, setAvatar] = useState(null);
    const [userInfo, setUserInfo] = useState({
        firstName: "",
        lastName: "",
        email: "",
        username: "",
    });

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (token) {
            setIsLoggedIn(true);
            fetchUserProfile(token);
        } else {
            setIsLoggedIn(false);
            navigate("/login");
        }
    }, [navigate]);

    const fetchUserProfile = async (token) => {
        setLoading(true);
        try {
            const response = await axios.get("http://localhost:5233/api/profile", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setUserInfo(response.data);
            setAvatar(response.data.avatarUrl); // Використовуємо URL аватарки з серверу
        } catch (error) {
            if (error.response?.status === 401) {
                localStorage.removeItem("authToken");
                alert("Сесія закінчилась. Будь ласка, увійдіть знову.");
                navigate("/login");
            } else {
                console.error("Помилка завантаження профілю:", error);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("authToken");
        setIsLoggedIn(false);
        navigate("/");
    };

    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const token = localStorage.getItem("authToken");
            const formData = new FormData();
            formData.append("avatar", file);

            try {
                const response = await axios.post(
                    "http://localhost:5233/api/profile/avatar",
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );
                setAvatar(response.data.avatarUrl);
                alert("Аватарку оновлено успішно!");
            } catch (error) {
                console.error("Помилка завантаження аватарки:", error);
                alert("Не вдалося завантажити аватарку.");
            }
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserInfo({
            ...userInfo,
            [name]: value,
        });
    };

    const handleSaveChanges = async () => {
        if (!userInfo.firstName || !userInfo.lastName || !userInfo.email || !userInfo.username) {
            alert("Будь ласка, заповніть всі обов'язкові поля.");
            return;
        }
        const token = localStorage.getItem("authToken");
        try {
            await axios.put(
                "http://localhost:5233/api/profile",
                userInfo,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            alert("Зміни збережено успішно!");
        } catch (error) {
            console.error("Помилка збереження змін:", error);
            alert("Не вдалося зберегти зміни. Перевірте дані та спробуйте ще раз.");
        }
    };

    if (loading) {
        return <div className={styles.loading}>Завантаження...</div>;
    }

    if (!isLoggedIn) {
        return (
            <div className={styles.profileContainer}>
                <p className={styles.notLoggedIn}>
                    Ви не увійшли в систему.
                    <button onClick={() => navigate("/signin")} className={styles.loginButton}>
                        Увійти
                    </button>
                    або
                    <button onClick={() => navigate("/registration")} className={styles.registerButton}>
                        Зареєструватися
                    </button>
                    .
                </p>
            </div>
        );
    }

    return (
        <div className={styles.profileContainer}>
            <div className={styles.userInfo}>
                <h2>Профіль</h2>
                <input
                    type="text"
                    name="firstName"
                    value={userInfo.firstName}
                    onChange={handleInputChange}
                    placeholder="Ім'я"
                />
                <input
                    type="text"
                    name="lastName"
                    value={userInfo.lastName}
                    onChange={handleInputChange}
                    placeholder="Прізвище"
                />
                <input
                    type="email"
                    name="email"
                    value={userInfo.email}
                    onChange={handleInputChange}
                    placeholder="Email"
                />
                <input
                    type="text"
                    name="username"
                    value={userInfo.username}
                    onChange={handleInputChange}
                    placeholder="Логін"
                />
                <button onClick={handleSaveChanges} className={styles.changeProfileButton}>
                    Зберегти зміни
                </button>
            </div>

            <div className={styles.avatarSection}>
                <img
                    src={avatar || "https://via.placeholder.com/150"}
                    alt="Аватар користувача"
                    className={styles.avatarImage}
                />
                <input
                    id="avatarInput"
                    type="file"
                    onChange={handleAvatarChange}
                    className={styles.avatarInput}
                />
                <label htmlFor="avatarInput" className={styles.changeAvatarButton}>
                    Змінити аватар
                </label>
                <button className={styles.logoutButton} onClick={handleLogout}>
                    Вийти
                </button>
            </div>
        </div>
    );
};

export default UserProfile;
