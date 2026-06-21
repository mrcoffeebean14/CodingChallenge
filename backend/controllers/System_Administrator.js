import { Op } from 'sequelize';
import { User, Store, Rating } from '../models/index.js';

export const getDashboardInfo = async (req, res) => {
    try {
        const totalUsers = await User.count();
        const totalStores = await Store.count();
        const totalRatings = await Rating.count();
        
        return res.status(200).json({
            success: true,
            data: {
                totalUsers,
                totalStores,
                totalRatings
            }
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
export const addUser = async (req, res) => {
    try {
        const { name, email, password, address, role } = req.body;
        
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Email already exists' });
        }
        
        const newUser = await User.create({
            name,
            email,
            password, 
            address,
            role: role || 'normal_user'
        });
        
        return res.status(201).json({ success: true, message: 'User added successfully', data: newUser });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
export const addStore = async (req, res) => {
    try {
        const { ownerId, address, rating } = req.body;
        const user = await User.findByPk(ownerId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        if (user.role !== 'store_owner') {
            return res.status(400).json({ success: false, message: 'User must have store_owner role to own a store' });
        }
        
        const newStore = await Store.create({
            name: user.name, // Derived from user table
            email: user.email, // Derived from user table
            address,
            rating: rating || 0,
            ownerId: user.id
        });
        
        return res.status(201).json({ success: true, message: 'Store added successfully', data: newStore });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
export const getUsers = async (req, res) => {
    try {
        const { name, email, address, role } = req.query;
        let queryCondition = {};
        
        if (name) queryCondition.name = { [Op.like]: `%${name}%` };
        if (email) queryCondition.email = { [Op.like]: `%${email}%` };
        if (address) queryCondition.address = { [Op.like]: `%${address}%` };
        if (role) queryCondition.role = role;
        
        const users = await User.findAll({
            where: queryCondition,
            attributes: ['id', 'name', 'email', 'address', 'role'] // omitting password
        });
        
        return res.status(200).json({ success: true, data: users });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const getStores = async (req, res) => {
    try {
        const { name, email, address } = req.query;
        let queryCondition = {};
        
        if (name) queryCondition.name = { [Op.like]: `%${name}%` };
        if (email) queryCondition.email = { [Op.like]: `%${email}%` };
        if (address) queryCondition.address = { [Op.like]: `%${address}%` };
        
        const stores = await Store.findAll({
            where: queryCondition,
            attributes: ['id', 'name', 'email', 'address', 'rating']
        });
        
        return res.status(200).json({ success: true, data: stores });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const getUserDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id, {
            attributes: ['id', 'name', 'email', 'address', 'role'],
            include: [{
                model: Store,
                as: 'store',
                attributes: ['rating']
            }]
        });
        
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        
        let responseData = {
            name: user.name,
            email: user.email,
            address: user.address,
            role: user.role
        };
        
        if (user.role === 'store_owner' && user.store) {
            responseData.storeRating = user.store.rating;
        }
        
        return res.status(200).json({ success: true, data: responseData });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const logout = async (req, res) => {
    try {
        return res.status(200).json({ success: true, message: 'Logged out successfully' });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};