import React, { useState } from 'react';
import './LoginModal.css';
import axiosInstance from "../services/axiosInstance";

const LoginModal = ({ onClose, onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLogin, setIsLogin] = useState(true);

    const handleLogin = async () => {
        try {
            const response = await axiosInstance.post('/users/login', {
                email,
                password,
            });

            const { jwt, boardId } = response.data;
            localStorage.setItem('token', jwt);

            onLogin(boardId);
        } catch (error) {
            console.error('Login failed:', error);
            alert('Login failed, please check your credentials.');
        }
    };


    const handleRegister = async () => {
        try {
            const response = await axiosInstance.post("/users/register", {
                email,
                password
            });

            alert("Registration successful! You can now log in.");
            setIsLogin(true);
        } catch (error) {
            console.error("Registration failed", error);
            alert("Registration failed. Please try again.");
        }
    };



    return (
        <div className="auth-modal-overlay">
            <div className="auth-modal">
                <h2>{isLogin ? 'Login' : 'Register'}</h2>

                <div className="auth-inputs">
                    <input
                        type="text"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <button
                    className="auth-submit"
                    onClick={isLogin ? handleLogin : handleRegister}
                >
                    {isLogin ? 'Login' : 'Register'}
                </button>

                <button
                    className="auth-toggle"
                    onClick={() => setIsLogin(!isLogin)}
                >
                    {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
                </button>

                <button className="auth-close" onClick={onClose}>
                    Close
                </button>
            </div>
        </div>
    );

};

export default LoginModal;
