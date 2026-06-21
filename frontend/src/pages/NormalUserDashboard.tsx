import { useEffect, useState } from 'react';
import api from '../api';
import { useAuth } from '../App';

interface Store {
    storeId: number;
    storeName: string;
    address: string;
    overallRating: number;
    userSubmittedRating: number | null;
}

export default function NormalUserDashboard() {
    const { user } = useAuth();
    const [stores, setStores] = useState<Store[]>([]);
    const [searchName, setSearchName] = useState('');
    const [searchAddress, setSearchAddress] = useState('');
    
    // Password state
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [passMsg, setPassMsg] = useState('');

    const fetchStores = async () => {
        try {
            const res = await api.get('/normal-user/stores', {
                params: {
                    userId: user?.id,
                    name: searchName,
                    address: searchAddress
                }
            });
            setStores(res.data.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchStores();
    }, [user]);

    const handleRatingSubmit = async (storeId: number, ratingValue: number) => {
        try {
            await api.post('/normal-user/ratings', {
                userId: user?.id,
                storeId,
                ratingValue
            });
            fetchStores(); // Refresh stores to see new ratings
        } catch (err) {
            alert('Failed to submit rating');
        }
    };

    const handlePasswordUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await api.put('/normal-user/update-password', {
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

            <div className="bg-white p-6 shadow rounded-lg">
                <h3 className="text-xl font-bold mb-4">Stores</h3>
                <div className="flex gap-4 mb-6">
                    <input type="text" placeholder="Search by name..." className="border p-2 rounded w-full" value={searchName} onChange={e => setSearchName(e.target.value)} />
                    <input type="text" placeholder="Search by address..." className="border p-2 rounded w-full" value={searchAddress} onChange={e => setSearchAddress(e.target.value)} />
                    <button onClick={fetchStores} className="bg-gray-800 text-white px-4 py-2 rounded">Search</button>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {stores.map(store => (
                        <div key={store.storeId} className="border rounded p-4 shadow-sm">
                            <h4 className="font-bold text-lg">{store.storeName}</h4>
                            <p className="text-gray-600 text-sm mb-2">{store.address}</p>
                            <p className="font-semibold">Overall Rating: {store.overallRating || 'N/A'}</p>
                            
                            <div className="mt-4 pt-4 border-t">
                                <p className="text-sm mb-2">Your Rating: {store.userSubmittedRating || 'None'}</p>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <button 
                                            key={star} 
                                            onClick={() => handleRatingSubmit(store.storeId, star)}
                                            className={`w-8 h-8 rounded-full font-bold ${store.userSubmittedRating === star ? 'bg-yellow-400 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                                        >
                                            {star}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}