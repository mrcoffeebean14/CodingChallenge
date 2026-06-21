import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

export default function Signup() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: '', email: '', password: '', address: '' });
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const res = await api.post(`/normal-user/signup`, formData);
            if (res.data.success) {
                navigate('/login');
            }
        } catch (err: any) {
             setError(err.response?.data?.message || 'Signup failed');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 bg-white p-8 border border-gray-300 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
            {error && <div className="mb-4 bg-red-100 text-red-700 p-3 rounded">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input type="text" required minLength={20} maxLength={60} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" 
                        value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input type="email" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" 
                        value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Password</label>
                    <input type="password" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                        value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Address</label>
                    <input type="text" required maxLength={400} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                        value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} />
                </div>
                <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                    Sign up
                </button>
            </form>
             <div className="mt-6 text-center">
                <Link to="/login" className="text-indigo-600 hover:text-indigo-500">Already have an account? Sign in</Link>
            </div>
        </div>
    );
}