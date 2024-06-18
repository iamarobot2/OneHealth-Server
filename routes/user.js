const express = require('express');
const { createUser, getAllUsers, getUserById, updateUser, deleteUser } = require('../controllers/userController');
const router = express.Router();

router.post('/', createUser);
router.get('/', getAllUsers);
router.get('/:userId', getUserById);
router.put('/:userId', updateUser);
router.delete('/:userId', deleteUser);

module.exports = router;
