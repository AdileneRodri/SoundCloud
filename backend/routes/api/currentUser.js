const express = require('express')
const router = express.Router();

const { setTokenCookie, requireAuth } = require('../../utils/auth.js');
const { User, Songs, Albums, Playlists } = require('../../db/models');


// Get all Playlists created by Current User
router.get('/playlists',
    requireAuth,
    async (req, res, next) => {
        const playlists = await Playlists.findAll({
            where: {
                userId: req.user.id
            }
        });
        return res.json({"Playlists": playlists});
});

// Get all Albums created by Current User
router.get('/albums',
    requireAuth,
    async (req, res, next) => {
        const albums = await Albums.findAll({
            where: {
                userId: req.user.id
            }
        });
        return res.json({"Albums": albums});
});

// Get all Songs created by Current User
router.get('/songs',
    requireAuth,
    async (req, res, next) => {
        const songs = await Songs.findAll({
            where: {
                userId: req.user.id
            }
        });
        return res.json({"Songs": songs});
});


// Get current user
router.get('/',
    requireAuth,
    async (req, res, next) => {
        const currentUser = await User.getCurrentUserById(req.user.id);

        const jwtToken = await setTokenCookie(res, currentUser);

        if(jwtToken){
            currentUser.dataValues.token = jwtToken;
        } else {
            currentUser.dataValues.token = "";
        }
    
      return res.json(currentUser);
});


module.exports = router;