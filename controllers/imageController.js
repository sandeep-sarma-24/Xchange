const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const uploadImageToS3 = async (filePath, fileName) => {
    const formData = new FormData();
    formData.append('image', fs.createReadStream(filePath), fileName);
    const apiUrl = `https://d7l0zoocj9.execute-api.us-west-2.amazonaws.com/dev/ticket--images/${fileName}`;

    try {
        await axios.put(apiUrl, formData, { headers: formData.getHeaders() });
        return apiUrl; // Return the URL where the image is stored in S3
    } catch (error) {
        console.error('Error uploading image to S3:', error);
        throw error;
    }
};

const imageController = {
    async uploadImage(req, res) {
        if (!req.file) {
            return res.status(400).send('No file uploaded.');
        }

        try {
            const file = req.file;
            const s3Url = await uploadImageToS3(file.path, file.originalname);

            // Cleanup: Delete the local file after uploading to S3
            fs.unlinkSync(file.path);

            res.json({ imageUrl: s3Url });
        } catch (error) {
            res.status(500).send('Error uploading image');
        }
    }
};

module.exports = imageController;
