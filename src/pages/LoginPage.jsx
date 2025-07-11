import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';
// import { useNotifier } from '../hooks/useNotifier'; // Nanti kita buat hook ini

export default function LoginPage() {
    // const notifier = useNotifier();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            // Notifikasi sukses tidak perlu, karena akan otomatis redirect
        } catch (error) {
            console.error("Login failed:", error);
            alert('Email atau password salah.'); // Ganti dengan notifikasi yang lebih baik
            // notifier.show('Email atau password salah.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div id="login-view" className="flex flex-col items-center justify-center min-h-screen p-4 bg-grid-pattern">
            <div className="login-container">
                <div className="text-center mb-8">
                    <h1 className="text-5xl font-bold text-white mb-2">ARKADIA</h1>
                    <p className="text-text-secondary">Selamat Datang Kembali</p>
                </div>
                <form id="login-form" onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label htmlFor="login-identifier" className="block text-sm font-medium text-text-secondary mb-1">Email</label>
                        <input 
                            type="email" 
                            id="login-identifier" 
                            className="form-input-elegant" 
                            required 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
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
                    <button type="submit" className="w-full elegant-btn" disabled={loading}>
                        {loading ? 'Memproses...' : 'Masuk'}
                    </button>
                </form>
            </div>
        </div>
    );
}
