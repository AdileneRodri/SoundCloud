const express = require("express");
const router = express.Router();

const { requireAuth } = require('../../utils/auth.js');
const { User, Songs, Albums, Comments } = require('../../db/models');



module.exports = router;