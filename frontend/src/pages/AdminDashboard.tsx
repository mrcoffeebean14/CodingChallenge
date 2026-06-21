import { useEffect, useState } from 'react';
import api from '../api';

interface DashInfo {
    totalUsers: number;
    totalStores: number;
    totalRatings: number;
}

export default function AdminDashboard() {
    const [info, setInfo] = useState<DashInfo | null>(null);
    const [users, setUsers] = useState<any[]>([]);
    const [stores, setStores] = useState<any[]>([]);
    
    // Filters for users
    const [uName, setUName] = useState('');
    const [uEmail, setUEmail] = useState('');
    const [uRole, setURole] = useState('');

    // Filters for stores
    const [sName, setSName] = useState('');
    const [sAddress, setSAddress] = useState('');

    const fetchInfo = () => {
        api.get('/admin/dashboard').then(res => setInfo(res.data.data)).catch(console.error);
    };

    const fetchUsers = () => {
        api.get('/admin/users', { params: { name: uName, email: uEmail, role: uRole } })
           .then(res => setUsers(res.data.data)).catch(console.error);
    };

    const fetchStores = () => {
        api.get('/admin/stores', { params: { name: sName, address: sAddress } })
           .then(res => setStores(res.data.data)).catch(console.error);
    };

    useEffect(() => {
        fetchInfo();
        fetchUsers();
        fetchStores();
    }, []);

    return (
        <div className="space-y-8">
             <div className="grid grid-cols-3 gap-6">
                 <div className="bg-white p-6 shadow rounded-lg text-center">
                    <p className="text-gray-500">Total Users</p>
                    <p className="text-3xl font-bold">{info?.totalUsers || 0}</p>
                 </div>
                 <div className="bg-white p-6 shadow rounded-lg text-center">
                    <p className="text-gray-500">Total Stores</p>
                    <p className="text-3xl font-bold">{info?.totalStores || 0}</p>
                 </div>
                 <div className="bg-white p-6 shadow rounded-lg text-center">
                    <p className="text-gray-500">Total Ratings</p>
                    <p className="text-3xl font-bold">{info?.totalRatings || 0}</p>
                 </div>
             </div>

             <div className="bg-white p-6 shadow rounded-lg">
                <h3 className="text-xl font-bold mb-4">Users</h3>
                <div className="flex gap-4 mb-4">
                    <input className="border p-2 rounded" placeholder="Search Name" value={uName} onChange={e => setUName(e.target.value)} />
                    <input className="border p-2 rounded" placeholder="Search Email" value={uEmail} onChange={e => setUEmail(e.target.value)} />
                    <select className="border p-2 rounded" value={uRole} onChange={e => setURole(e.target.value)}>
                        <option value="">All Roles</option>
                        <option value="normal_user">Normal User</option>
                        <option value="store_owner">Store Owner</option>
                        <option value="system_admin">System Admin</option>
                    </select>
                    <button onClick={fetchUsers} className="bg-gray-800 text-white px-4 rounded">Filter</button>
                </div>
                <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Address</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {users.map(u => (
                            <tr key={u.id}>
                                <td className="px-6 py-4">{u.id}</td>
                                <td className="px-6 py-4">{u.name}</td>
                                <td className="px-6 py-4">{u.email}</td>
                                <td className="px-6 py-4"><span className="bg-gray-100 px-2 py-1 rounded text-sm">{u.role}</span></td>
                                <td className="px-6 py-4">{u.address}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
             </div>

             <div className="bg-white p-6 shadow rounded-lg">
                <h3 className="text-xl font-bold mb-4">Stores</h3>
                <div className="flex gap-4 mb-4">
                    <input className="border p-2 rounded" placeholder="Search Name" value={sName} onChange={e => setSName(e.target.value)} />
                    <input className="border p-2 rounded" placeholder="Search Address" value={sAddress} onChange={e => setSAddress(e.target.value)} />
                    <button onClick={fetchStores} className="bg-gray-800 text-white px-4 rounded">Filter</button>
                </div>
                <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Address</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {stores.map(s => (
                            <tr key={s.id}>
                                <td className="px-6 py-4">{s.id}</td>
                                <td className="px-6 py-4">{s.name}</td>
                                <td className="px-6 py-4">{s.address}</td>
                                <td className="px-6 py-4">{s.rating}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
             </div>
        </div>
    );
}