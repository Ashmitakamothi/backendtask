// const User = require('../models/user');

// exports.createUser = async (req, res) => {
//   const { first_name, last_name, email, mobile_number, birthdate } = req.body;

//   try {
//     const newUser = await User.createUser({ first_name, last_name, email, mobile_number, birthdate });
//     res.json(newUser);
//   } catch (error) {
//     res.status(500).json({ error: 'An error occurred while creating the user' });
//   }
// };


// src/controllers/usersControllers.js

const User = require('../models/user');

exports.searchUsers = async (req, res) => {
    try {
        const searchString = req.query.searchString ? req.query.searchString.toLowerCase() : ''; // Get the search string from query parameter
        const minAge = req.query.minAge ? parseInt(req.query.minAge) : undefined;
        const maxAge = req.query.maxAge ? parseInt(req.query.maxAge) : undefined;
        const city = req.query.city ? req.query.city : undefined;
        const users = await User.searchUsers(searchString, minAge, maxAge, city); // Call the searchUsers method in the User model
        res.json(users); // Return the matched users as JSON response
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while searching users' });
    }
};


exports.updateUser = async (req, res) => {
    try {
        const userId = req.params.userId;
        const userData = req.body;

        // Validate input data
        // Example: Check if required fields are present
        if (!userData.first_name || !userData.last_name || !userData.email || !userData.mobile_number) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Update user information
        const updatedUser = await User.updateUser(userId, userData);

        res.json(updatedUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while updating user information' });
    }
};