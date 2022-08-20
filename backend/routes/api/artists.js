const express = require('express')
const router = express.Router();

const { Op } = require("sequelize");

const { User, Songs, Albums, Playlists } = require('../../db/models');




// Get playlist from artist id
router.get('/:artistId/playlists',
async (req, res, next) => {
    const { artistId } = req.params;
    const artist = await User.findByPk(artistId);
    
    if(!artist){
        res.status(404);
        return res.json({
            "message": "Artist does not exist",
            "statusCode": 404
        });
    }
    const artistPlaylists = await Playlists.findAll({
        where: {
            userId: artistId
        }
    });
    return res.json({"Playlists": artistPlaylists});
});


// Get all albums from artist by id
router.get('/:artistId/albums',
async (req, res, next) => {
    const { artistId } = req.params;
    const artist = await User.findByPk(artistId);
    
    if(!artist){
        res.status(404);
        return res.json({
            "message": "Artist does not exist",
            "statusCode": 404
        });
    }
    const artistAlbums = await Albums.findAll({
        where: {
            userId: artistId
        }
    });
    return res.json({"Albums": artistAlbums});
});

// Get all songs from artist based on id
router.get('/:artistId/songs',
async (req, res, next) => {
    const { artistId } = req.params;
    const artist = await User.findByPk(artistId);
    
    if(!artist){
        res.status(404);
        return res.json({
            "message": "Artist does not exist",
            "statusCode": 404
        });
    }
    const artistSongs = await Songs.findAll({
        where: {
            userId: artistId
        }
    });
    return res.json({"Songs": artistSongs});
});

// Get details of artist by id
router.get('/:artistId', async (req, res, next) => {
    const { artistId } = req.params;
    const artist = await User.scope("artistDetails").findOne({
        where: { id: artistId}, 
        include: [{ model: Albums }],
    });
    
    if(!artist){
        res.status(404);
        return res.json({
            "message": "Artist does not exist",
            "statusCode": 404
        });
    }
    
    if(artist.dataValues.Albums){
        artist.dataValues.totalAlbums = artist.dataValues.Albums.length;
    } else {
        artist.dataValues.totalAlbums = 0;
    }
    delete artist.dataValues.Albums;
    
    if(artist.dataValues.Songs){
    artist.dataValues.totalSongs = artist.dataValues.Songs.length
    } else {
        artist.dataValues.totalSongs = 0;
    }

    return res.json(artist);
});
module.exports = router;