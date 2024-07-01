const nodemailer = require('nodemailer');
const fs = require('fs');
const { promisify } = require('util');

const readFileAsync = promisify(fs.readFile);

const sendMail = async function sendEmail() {
    try {
        // Read the HTML template and image file
        const htmlTemplate = await readFileAsync('template.html', 'utf-8');
        const imageAttachment = fs.readFileSync('path/to/your/image.png'); // readFileSync to get buffer data

        // Create a Nodemailer transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'your.email@gmail.com',
                pass: 'your-email-password',
            },
        });

        // Send email
        const info = await transporter.sendMail({
            from: 'your.email@gmail.com',
            to: 'recipient.email@example.com',
            subject: 'Your Subject',
            html: htmlTemplate,
            attachments: [{
                filename: 'image.png',
                content: imageAttachment.toString('base64'), // Convert buffer to base64 string
                encoding: 'base64',
                cid: 'uniqueImageCID', // Referenced in the HTML template
            }],
        });

        console.log('Email sent:', info.messageId);
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
}

module.exports = sendMail;
