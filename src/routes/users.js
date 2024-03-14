

const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersControllers');

// Search endpoint
router.get('/search', usersController.searchUsers);
router.put('/:userId', usersController.updateUser)

module.exports = router;
