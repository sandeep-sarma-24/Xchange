const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const supabase = require('../db/db');

const uploadImageToApiGateway = async (file, ticketId) => {
    const formData = new FormData();
    formData.append('image', fs.createReadStream(file.path));
    const apiUrl = `https://d7l0zoocj9.execute-api.us-west-2.amazonaws.com/dev/ticket--images/${file.filename}`;

    try {
        await axios.put(apiUrl, formData, { headers: formData.getHeaders() });
        const fileUrl = apiUrl; // Construct the file URL

        // Insert record into Supabase with ticket_id
        const { data, error } = await supabase
            .from('ticket_images')
            .insert([{ ticket_id: ticketId, image_url: fileUrl }]);

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error uploading image to API Gateway:', error);
        throw new Error('Error uploading image');
    }
};

const updateImage = async (req, res) => {
    const { imageId, newFileBuffer, newFileName, newMimeType } = req.body;

    try {
        const newImageUrl = await uploadImageToS3(newFileBuffer, newFileName, newMimeType);
        const { data, error } = await supabase
            .from('ticket_images')
            .update({ image_url: newImageUrl })
            .eq('image_id', imageId);

        if (error) throw error;
        res.status(200).json(data);
    } catch (error) {
        console.error('Error updating image:', error);
        res.status(500).send('Error updating image');
    }
};

const deleteImage = async (req, res) => {
    const { imageId } = req.params;

    try {
        const { data: imageData, error: retrievalError } = await supabase
            .from('ticket_images')
            .select('image_url')
            .eq('image_id', imageId)
            .single();

        if (retrievalError) throw retrievalError;
        if (!imageData) throw new Error('Image not found');

        const fileName = imageData.image_url.split('/').pop();
        const deleteApiUrl = `https://d7l0zoocj9.execute-api.us-west-2.amazonaws.com/dev/ticket--images/${fileName}`;
        await axios.delete(deleteApiUrl);

        const { error: deleteError } = await supabase
            .from('ticket_images')
            .delete()
            .eq('image_id', imageId);

        if (deleteError) throw deleteError;
        res.send('Image deleted successfully');
    } catch (error) {
        console.error('Error deleting image:', error);
        res.status(500).send('Error deleting image');
    }
};

const getImage = async (req, res) => {
    const { ticketId } = req.params;

    try {
        const { data, error } = await supabase
            .from('ticket_images')
            .select('image_url')
            .eq('ticket_id', ticketId);

        if (error) throw error;
        if (data.length > 0) {
            res.json({ images: data });
        } else {
            res.status(404).send('Images not found for the ticket');
        }
    } catch (error) {
        console.error('Error retrieving image:', error);
        res.status(500).send('Error retrieving image');
    }
};

const getImageById = async (req, res) => {
    const { imageId } = req.params;

    try {
        const { data, error } = await supabase
            .from('ticket_images')
            .select('image_url')
            .eq('image_id', imageId)
            .single();

        if (error) throw error;
        if (data) {
            res.json({ imageUrl: data.image_url });
        } else {
            res.status(404).send('Image not found');
        }
    } catch (error) {
        console.error('Error retrieving image by ID:', error);
        res.status(500).send('Error retrieving image');
    }
};

module.exports = {
    uploadImageToApiGateway,
    updateImage,
    deleteImage,
    getImage,
    getImageById
};
