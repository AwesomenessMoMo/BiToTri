import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        try {
            const savedUser = localStorage.getItem("user");

            if (savedUser) {
                const parsedUser = JSON.parse(savedUser);
                if (parsedUser && parsedUser.id) {
                    setUser(parsedUser);
                } else {
                    localStorage.removeItem("user");
                }
            }
        } catch (err) {
            console.error("Auth restore failed:", err);
            localStorage.removeItem("user");
        } finally {
            setLoading(false);
        }
    }, []);

    const login = (userData) => {
        if (!userData || !userData.id) {
            console.error("Login failed: invalid user data", userData);
            alert("Login failed. Please try again.");
            return;
        }

        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
    };


    const logout = () => {
        localStorage.removeItem("user");
        setUser(null);
    };

    const isLoggedIn = Boolean(user);
    const userId = user?.id || null; 

    if (loading) return null;

    return (
        <AuthContext.Provider
            value={{
                user,
                userId,       
                isLoggedIn,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
