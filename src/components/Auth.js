import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import './Auth.css';

const Auth = ({ onBack }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login, signup } = useAuth();

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (isLogin) {
            const res = login(email, password);
            if (!res.success) setError(res.message);
        } else {
            if (!name || !email || !password) {
                setError('All fields are required');
                return;
            }
            const res = signup(name, email, password);
            if (!res.success) setError(res.message);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
                <p className="subtitle">
                    {isLogin
                        ? 'Sign in to continue generating unique AI NFTs'
                        : 'Join us to start creating and minting your own AI NFTs'}
                </p>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit}>
                    {!isLogin && (
                        <div className="auth-input-group">
                            <input
                                type="text"
                                placeholder="Full Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                    )}
                    <div className="auth-input-group">
                        <input
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="auth-input-group">
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="auth-button">
                        {isLogin ? 'Sign In' : 'Create Account'}
                    </button>
                </form>

                <div className="auth-toggle">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}
                    <span onClick={() => {
                        setIsLogin(!isLogin);
                        setError('');
                    }}>
                        {isLogin ? 'Sign Up' : 'Login'}
                    </span>
                </div>

                <div style={{ marginTop: '20px', fontSize: '0.9rem', color: '#888', cursor: 'pointer' }} onClick={onBack}>
                    ← Back to Home
                </div>
            </div>
        </div>
    );
};

export default Auth;
