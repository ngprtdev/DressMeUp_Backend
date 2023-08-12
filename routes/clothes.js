var express = require('express');
var router = express.Router();
const uniqid = require('uniqid');
const axios = require("axios");

const cloudinary = require('cloudinary').v2;
const fs = require('fs');

const Clothe = require('../models/clothes');

// Pour ajout de la photo prise à l'écran CreatheClotheE
// POST avec push en DB + ajout au store
router.post('/upload', async (req, res)=> {
  try {
    const resultCloudinary = await cloudinary.uploader.upload(
        req.files.photoFromFront.tempFilePath    );
      console.log("resultCloudinary côté back ",resultCloudinary)
    const response = await axios.post(
        "https://dress-me-up-backend-red.vercel.app/clothes/upload",
        { url: resultCloudinary.secure_url }
    );

    res.json({ success: true, url: response.data.url });
} catch (error) {
    res.json({ success: false, error: error.message });
}
});

// Pour la page de finalisation de création du vêtement
// POST avec push en DB + ajout au store
router.post('/', (req, res)=>{
  const {name, maintype, color, image, subtype, brand, event, material, cut, season, waterproof, id, username} = req.body
  console.log(season)
  Clothe.findOne({ id: id })
  .then(data => {
      if (data === null) {
          const newClothe = new Clothe({
            name: name,
            maintype: maintype,
            color: color,
            image: image,
            subtype: subtype,
            brand: brand,
            event: event,
            material: material,
            cut: cut,
            season: season,
            waterproof: waterproof,
            id: id,
            username: username,
          })
          newClothe.save().then(data => {
              // console.log(data)
              res.json({ result: true, clothe: data })
          })
      }
  })
})

// Pour la page de suppression du vêtement
// DELETE avec push en DB + suppression dans le store
// + DELETE de toutes les tenues associées avec push en DB + suppression dans le store
router.delete('/', async (req, res)=>{
  const idToDelete = req.body.clotheId;
  console.log(idToDelete)
  const deletedDocument = await Clothe.findOneAndDelete({ id: idToDelete })
  if (!deletedDocument)  res.json({ result: false, message: 'Document not found' });

  res.json({ result: true, message: 'Document deleted successfully' });
})

module.exports = router;
