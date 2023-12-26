const express = require('express');
const multer = require('multer');
const { uploadImageToApiGateway, getImage, getImageById, updateImage, deleteImage } = require('/media/edward-elric/files/Languages/X/backend/controllers/ticketImagesController.js')

const upload = multer({ dest: 'uploads/' }); // Temporarily store files in 'uploads' folder
const router = express.Router();

// Route for uploading an image
// Include ticket_id in the request body
router.put('/upload-image/:ticketId', upload.single('image'), async (req, res) => {
    try {
        const ticketId = req.params.ticketId;
        const uploadedImage = await uploadImageToApiGateway(req.file, ticketId);
        res.json(uploadedImage);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Routes for other image operations
router.get('/get-image/:ticketId', getImage);
router.get('/get-image-by-id/:imageId', getImageById);
router.put('/update-image/:imageId', updateImage); // Implement this as needed
router.delete('/delete-image/:imageId', deleteImage);

module.exports = router;
