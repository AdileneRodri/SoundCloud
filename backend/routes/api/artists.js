const express = require('express')
const router = express.Router();

const { Op } = require("sequelize");

const { User, Song, Album, Playlist } = require('../../db/models');




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
    const artistPlaylists = await Playlist.findAll({
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
    const artistAlbums = await Album.findAll({
        where: {
            userId: artistId
        }
    });
    return res.json({"Album": artistAlbums});
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
    const artistSongs = await Song.findAll({
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
        include: [{ model: Album }],
    });
    
    if(!artist){
        res.status(404);
        return res.json({
            "message": "Artist does not exist",
            "statusCode": 404
        });
    }
    
    if(artist.dataValues.Album){
        artist.dataValues.totalAlbums = artist.dataValues.Album.length;
    } else {
        artist.dataValues.totalAlbums = 0;
    }
    delete artist.dataValues.Album;
    
    if(artist.dataValues.Song){
    artist.dataValues.totalSongs = artist.dataValues.Song.length
    } else {
        artist.dataValues.totalSongs = 0;
    }

    return res.json(artist);
});
module.exports = router;