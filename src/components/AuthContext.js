import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedUser = localStorage.getItem('nft_ai_user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    const login = (email, password) => {
        const users = JSON.parse(localStorage.getItem('nft_ai_users') || '[]');
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            const userSession = { email: user.email, name: user.name };
            setUser(userSession);
            localStorage.setItem('nft_ai_user', JSON.stringify(userSession));
            return { success: true };
        }
        return { success: false, message: 'Invalid email or password' };
    };

    const signup = (name, email, password) => {
        const users = JSON.parse(localStorage.getItem('nft_ai_users') || '[]');
        if (users.find(u => u.email === email)) {
            return { success: false, message: 'User already exists' };
        }

        const newUser = { name, email, password };
        users.push(newUser);
        localStorage.setItem('nft_ai_users', JSON.stringify(users));

        const userSession = { email: newUser.email, name: newUser.name };
        setUser(userSession);
        localStorage.setItem('nft_ai_user', JSON.stringify(userSession));
        return { success: true };
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('nft_ai_user');
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
