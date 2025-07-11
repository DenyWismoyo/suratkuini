import React, { useState } from 'react';

export default function LoginView({ onLogin }) {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onLogin(identifier, password);
    };

    return (
        <div id="login-view" className="flex flex-col items-center justify-center min-h-screen p-4 bg-grid-pattern">
            <div className="login-container">
                <div className="text-center mb-8">
                    <h1 className="text-5xl font-bold text-white mb-2">ARKADIA</h1>
                    <p className="text-text-secondary">Selamat Datang Kembali</p>
                </div>
                <form id="login-form" onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="login-identifier" className="block text-sm font-medium text-text-secondary mb-1">Email</label>
                        <input 
                            type="email" 
                            id="login-identifier" 
                            className="form-input-elegant" 
                            required 
                            value={identifier} 
                            onChange={(e) => setIdentifier(e.target.value)} 
                        />
                    </div>
                    <div>
                        <label htmlFor="password-login" className="block text-sm font-medium text-text-secondary mb-1">Password</label>
                        <input 
                            type="password" 
                            id="password-login" 
                            className="form-input-elegant" 
                            required 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                        />
                    </div>
                    <button type="submit" className="w-full elegant-btn">Masuk</button>
                </form>
            </div>
        </div>
    );
};