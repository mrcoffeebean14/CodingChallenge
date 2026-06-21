import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../App';

export default function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [rolePath, setRolePath] = useState('normal-user'); // Default to normal user api
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const res = await api.post(`/${rolePath}/login`, formData);
            if (res.data.success) {
                login(res.data.data);
                navigate(`/${res.data.data.role}-dashboard`);
            }
        } catch (err: any) {
             setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 bg-white p-8 border border-gray-300 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
            {error && <div className="mb-4 bg-red-100 text-red-700 p-3 rounded">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Account Type</label>
                    <select 
                       className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                       value={rolePath} 
                       onChange={(e) => setRolePath(e.target.value)}
                    >
                        <option value="normal-user">Normal User</option>
                        <option value="store-owner">Store Owner</option>
                        {/* Note: In this system admin didn't explicitly have a distinct login route separate from user unless added. Let's assume normal user route works for admin login since they exist in the User table */}
                    </select>
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
                <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                    Sign in
                </button>
            </form>
            <div className="mt-6 text-center">
                <Link to="/signup" className="text-indigo-600 hover:text-indigo-500">Don't have an account? Sign up</Link>
            </div>
        </div>
    );
}