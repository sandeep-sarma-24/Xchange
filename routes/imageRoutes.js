const express = require('express');
const multer = require('multer');
const imageController = require('/media/edward-elric/files/Languages/X/backend/controllers/imageController.js');

const upload = multer({ dest: 'uploads/' }); // Temporarily store files in 'uploads' folder
const router = express.Router();

router.put('/upload-image', upload.single('image'), imageController.uploadImage);

module.exports = router;
