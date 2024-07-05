const dotenv = require('dotenv');
dotenv.config();
const { sendEmail } = require('../libs/nodemailer');
// Import the functions you need from the SDKs you need
const { initializeApp } = require("firebase/app");
const { getAnalytics } = require("firebase/analytics");
const { getStorage, ref, getDownloadURL, uploadBytesResumable } = require("firebase/storage");

const firebaseConfig = {
    apiKey: process.env.FIREBASE_PRIVATE_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID,
};
// Initialize Firebase
initializeApp(firebaseConfig);

const storage = getStorage();

const getResult = async (req, res, next) => {
    let fileURL = null;
    try {
        console.log("Request body:", req.body);
        const { email, category} = req.body;
        console.log("email", email);
        console.log("category", category);

        if (!req.file) {
            return res.status(400).send('No file uploaded.');
        }
        
        // Assuming chartUrl is the path of the image you want to upload
        
        const fileName = `charts/${Date.now()}_chart.png`;
        const storageRef = ref(storage, fileName);

        // Create file metadata including the content type
        const metadata = {
            contentType: req.file.mimetype,
        };

        // Upload the file in the bucket storage
        const snapshot = await uploadBytesResumable(storageRef, req.file.buffer, metadata);
        //by using uploadBytesResumable we can control the progress of uploading like pause, resume, cancel

        // Grab the public url
        const fileURL = await getDownloadURL(snapshot.ref);

        console.log("File uploaded successfully: ", fileURL);

        // Replace placeholders with actual values
        let html = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Quiz Result - CodeCareer</title>
            
            <!-- Bootstrap CSS -->
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
            
            <!-- Font Awesome CSS -->
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA==" crossorigin="anonymous" referrerpolicy="no-referrer" />
            
            <style>
                body {
                    background: #f5f5f5;
                    font-family: Arial, sans-serif;
                }
                .email-container {
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    background: #ffffff;
                    border-radius: 10px;
                    box-shadow: 0px 0px 10px rgba(0,0,0,0.1);
                }
                .email-header {
                    text-align: center;
                    padding: 20px 0;
                    background: #007bff;
                    color: #fff;
                    border-radius: 10px 10px 0 0;
                }
                .email-header img {
                    width: 70px;
                }
                .email-body {
                    padding: 20px;
                    font-size: 16px;
                    line-height: 1.5;
                    color: #333;
                }
                .email-body h3 {
                    color: #007bff;
                }
                .email-body p {
                    margin: 10px 0;
                }
                .chart-container {
                    text-align: center;
                    margin: 20px 0;
                }
                .chart-container img {
                    max-width: 100%;
                    height: auto;
                }
                .email-footer {
                    text-align: center;
                    padding: 20px;
                    color: #888;
                    font-size: 14px;
                    border-top: 1px solid #f5f5f5;
                }
            </style>
            </head>
            <body>
            <div class="email-container">
                <div class="email-header">
                    <img src="https://firebasestorage.googleapis.com/v0/b/codecareer-781ff.appspot.com/o/personCompi1.jpeg?alt=media&token=c04b4f1e-1846-41e1-9ed5-0a08e11cf009" alt="CodeCareer Logo">
                    <h2>Quiz Result</h2>
                </div>
                <div class="email-body">
                    <!--<h3>Dear $[name],</h3> -->
                    <p>Thank you for taking the CodeCareer quiz! Here are your results:</p>
                    <p><strong>Highest Scoring Category:</strong> ${category}</p>
                    <div class="chart-container">
                    <h4>Your Score Distribution:</h4>
                    <img src="${fileURL}" alt='Chart'>
                    </div>
                    <p>We hope this quiz helps you in your career journey. If you have any questions, feel free to contact us.</p>
                </div>
                <div class="email-footer">
                    <p>© 2024 CodeCareer. All rights reserved.</p>
                </div>
            </div>
            </body>
            </html>
        `;

        await sendEmail(email, "Save Data Result Your CodeCareer", html);

        return res.json({
            status: true,
            message: " Silahkan Cek Email Anda!",
            name: req.file.originalname,
            type: req.file.mimetype,
            fileURL: fileURL,
        });
    } catch (err) {
        console.error('Error sending email:', err);
        return res.status(500).json({
            status: false,
            message: 'Error sending email',
            err: err.message,
            name: req.file.originalname,
            type: req.file.mimetype,
            fileURL: fileURL,
        });
    }
};

module.exports = getResult;
