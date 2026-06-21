import { useEffect, useState } from 'react';
import api from '../api';
import { useAuth } from '../App';

interface RatingInfo {
    userId: number;
    name: string;
    email: string;
    ratingGiven: number;
}

interface DashboardData {
    storeId: number;
    storeName: string;
    averageRating: number;
    totalRatings: number;
    ratingsList: RatingInfo[];
}

export default function StoreOwnerDashboard() {
    const { user } = useAuth();
    const [dashData, setDashData] = useState<DashboardData | null>(null);

    // Password state
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [passMsg, setPassMsg] = useState('');

    useEffect(() => {
        if (user) {
            api.get(`/store-owner/dashboard/${user.id}`)
              .then(res => setDashData(res.data.data))
              .catch(err => console.error(err));
        }
    }, [user]);

    const handlePasswordUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await api.put('/store-owner/update-password', {
                userId: user?.id,
                oldPassword,
                newPassword
            });
            setPassMsg(res.data.message);
            setOldPassword('');
            setNewPassword('');
        } catch (err: any) {
             setPassMsg(err.response?.data?.message || 'Failed to update password');
        }
    };

    return (
        <div className="space-y-8">
             <div className="bg-white p-6 shadow rounded-lg">
                <h3 className="text-xl font-bold mb-4">Update Password</h3>
                {passMsg && <p className="mb-4 text-sm font-semibold text-blue-600">{passMsg}</p>}
                <form onSubmit={handlePasswordUpdate} className="flex gap-4 items-end">
                    <div>
                        <label className="block text-sm">Old Password</label>
                        <input type="password" required className="border p-2 rounded w-full mt-1" value={oldPassword} onChange={e => setOldPassword(e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-sm">New Password</label>
                        <input type="password" required className="border p-2 rounded w-full mt-1" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                    </div>
                    <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded">Update</button>
                </form>
            </div>

            {dashData ? (
                <div className="bg-white p-6 shadow rounded-lg">
                    <h2 className="text-2xl font-bold mb-2">Store: {dashData.storeName}</h2>
                    <div className="flex gap-8 mb-6">
                        <div className="bg-blue-50 p-4 rounded-lg">
                            <p className="text-sm text-gray-500">Average Rating</p>
                            <p className="text-2xl font-bold text-blue-700">{dashData.averageRating || 'N/A'}</p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg">
                            <p className="text-sm text-gray-500">Total Ratings</p>
                            <p className="text-2xl font-bold text-green-700">{dashData.totalRatings}</p>
                        </div>
                    </div>

                    <h3 className="text-lg font-bold mb-4 border-b pb-2">Recent Ratings</h3>
                    {dashData.ratingsList.length > 0 ? (
                         <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {dashData.ratingsList.map(rating => (
                                    <tr key={rating.userId}>
                                        <td className="px-6 py-4 whitespace-nowrap">{rating.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{rating.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap"><span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded font-bold">{rating.ratingGiven} ⭐</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="text-gray-500">No ratings submitted yet.</p>
                    )}
                </div>
            ) : (
                <div className="bg-white p-6 shadow rounded-lg">Loading dashboard...</div>
            )}
        </div>
    );
}