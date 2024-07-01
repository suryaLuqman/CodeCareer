const axios = require('axios');
const sendMail = require('./nodemailer/config');

exports.processText = async (req, res) => {
    try {
        console.log('Request:', req.params);
        console.log('Request text:', req.params.text);
        const response = await axios.get('https://chat.ai.cneko.org', {
            params: {
                t: req.params.text
            }
        });
        console.log('Success:', response.data);

        // Contoh pengiriman email setelah berhasil mendapatkan response dari API
        await sendMail();

        res.json(response.data);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred while processing your request.', message: error.message });
    }
};
