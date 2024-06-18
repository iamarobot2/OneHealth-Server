const express = require('express');
const { createHCP, getAllHCPs, getHCPById, updateHCP, deleteHCP } = require('../controllers/hcpController');
const router = express.Router();

router.post('/', createHCP);
router.get('/', getAllHCPs);
router.get('/:hcpId', getHCPById);
router.put('/:hcpId', updateHCP);
router.delete('/:hcpId', deleteHCP);

module.exports = router;
