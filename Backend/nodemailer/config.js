const dotenv = require('dotenv');
dotenv.config();
const { sendEmail } = require('../libs/nodemailer');
// Import the functions you need from the SDKs you need
const { initializeApp } = require("firebase/app");
const { getAnalytics } = require("firebase/analytics");
const { getStorage, ref, getDownloadURL, uploadBytesResumable, deleteObject } = require("firebase/storage");

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

        let categoryLearnURL = null;
        if (category === "Frontend Engineer") {
            categoryLearnURL = "https://www.freecodecamp.org/learn/front-end-development-libraries/";
        }else if(category === "Backend Engineer"){
            categoryLearnURL = "https://www.freecodecamp.org/learn/back-end-development-and-apis/";
        }else if (category === "DevOps" ) {
            categoryLearnURL = "https://www.coursera.org/learn/intro-to-devops";
        }else if (category === "Mobile Development") {
            categoryLearnURL = "https://www.coursera.org/learn/introduction-to-android-mobile-application-development";
        }else if (category === "Cybersecurity") {
            categoryLearnURL = "https://www.coursera.org/learn/foundations-of-cybersecurity";
        }else if (category === "Data Engineering") {
            categoryLearnURL = "https://www.coursera.org/learn/introduction-to-data-engineering";
        }else if (category === "Machine Learning") {
            categoryLearnURL = "https://www.freecodecamp.org/learn/machine-learning-with-python/";
        }else if (category === "Blockchain") {
            categoryLearnURL = "https://www.coursera.org/learn/introduction-blockchain-technologies";
        }else if (category === "UX/UI Design") {
            categoryLearnURL = "https://www.coursera.org/professional-certificates/google-ux-design";
        }

        let roadmapURL = null;
        if (category === "Frontend Engineer") {
            roadmapURL = "https://roadmap.sh/frontend";
        } else if (category === "Backend Engineer") {
            roadmapURL = "https://roadmap.sh/backend";
        } else if (category === "DevOps") {
            roadmapURL = "https://roadmap.sh/devops";
        } else if (category === "Mobile Development") {
            roadmapURL = "https://roadmap.sh/ai/mobile-development-pwhos";
        } else if (category === "Cybersecurity") {
            roadmapURL = "https://roadmap.sh/cyber-security";
        } else if (category === "Data Engineering") {
            roadmapURL = "https://roadmap.sh/ai/data-engineering-ek6ht";
        } else if (category === "Machine Learning") {
            roadmapURL = "https://roadmap.sh/ai/machine-learning-engineer-n1y2q";
        } else if (category === "Blockchain") {
            roadmapURL = "https://roadmap.sh/blockchain";
        } else if (category === "UX/UI Design") {
            roadmapURL = "https://roadmap.sh/ux-design";
        }

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
        fileURL = await getDownloadURL(snapshot.ref);

        console.log("File uploaded successfully: ", fileURL);

        // Set the time to live for the file (development version)
        // const ttl = 60 * 10 * 1000; // 10 minutes in milliseconds for development
        // setTimeout(async () => {
        //     await deleteObject(storageRef).then(() => {
        //         // File deleted successfully
        //         console.log('File deleted successfully');
        //     }).catch((error) => {
        //         // Uh-oh, an error occurred!
        //         console.log('Error deleting file:', error);
        //     }); // Use storageRef directly
        // }, ttl);

        // Set the time to live for the file (production version)
        const ttlProd = 60 * 60 * 24 * 7 * 1000; // 7 days in milliseconds for production
        setTimeout(async () => {
            await deleteObject(storageRef).then(() => {
                //// File deleted successfully
                console.log('File deleted successfully');
            }).catch((error) => {
                // Uh-oh, an error occurred!
                console.log('Error deleting file:', error);
            }); // Use storageRef directly; // Use storageRef directly
        }, ttlProd);

        const currentYear = new Date().getFullYear();

        // Replace placeholders with actual values
        let html = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Hasil Quiz CodeCareer</title>
            
            <!-- Bootstrap CSS -->
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
            
            <!-- Font Awesome CSS -->
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vagoglnee1c9QX4TctnWMn13TZye+giMm8e2LwA==" crossorigin="anonymous" referrerpolicy="no-referrer" />
            
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
                .btn-container {
                    text-align: center;
                    margin-top: 20px;
                }
                .btn-primary, .btn-success {
                    display: inline-block;
                    padding: 10px 20px;
                    font-size: 16px;
                    border-radius: 5px;
                    border: none;
                    text-decoration: none;
                    color: #fff;
                    cursor: pointer;
                }
                .btn-primary {
                    background-color: #007bff;
                    color: #fff;
                }
                .btn-primary:hover {
                    background-color: #0056b3;
                    color: #fff;
                }
                .btn-success {
                    background-color: #28a745;
                    color: #fff;
                }
                .btn-success:hover {
                    background-color: #218838;
                    color: #fff;
                }
            </style>
            </head>
            <body>
            <div class="email-container">
                <div class="email-header">
                    <img src="https://firebasestorage.googleapis.com/v0/b/codecareer-781ff.appspot.com/o/personCompi1.jpeg?alt=media&token=c04b4f1e-1846-41e1-9ed5-0a08e11cf009" alt="CodeCareer Logo">
                    <h2>Hasil Quiz CodeCareer</h2>
                </div>
                <div class="email-body">
                    <p>Terima kasih telah mengikuti quiz CodeCareer !</p>
                    <img src="${fileURL}" alt='Grafik'>
                    <p>Anda sangat cocok menjadi seorang <strong>${category}</strong> </p>
                    <div class="chart-container">
                    </div>
                    <p><small><i><span style="color:red">*</span>Catatan:<br> Gambar grafik ini akan tersedia selama 7 hari setelah tanggal email ini. <br>
                    Tombol di bawah ini akan tetap tersedia sampai server dinonaktifkan.</i></small></p>
                    <p>Jika Anda memiliki kesulitan memulai, Anda dapat melihat jalur pembelajaran atau langsung memulai dengan memilih tombol pelatihan di bawah ini.</p>
                    <div class="btn-container">
                        <a class="btn-primary" href="${roadmapURL}">Lihat Jalur Pembelajaran</a>
                        <a class="btn-success" href="${categoryLearnURL}">Mulai Pelatihan</a>
                    </div>
                    <p>Kami harap quiz ini membantu Anda dalam jalan karir Anda. Jika Anda memiliki pertanyaan, jangan ragu untuk menghubungi kami. <br>Terima kasih, <b>Terus Semangat dan Jangan Menyerah !</b></p>
                </div>
                <div class="email-footer">
                    <p>©${currentYear} CodeCareer. Hak Cipta Dilindungi.</p>
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
            chartURL: fileURL,
            roadmapURL: roadmapURL,
            categoryLearnURL: categoryLearnURL
        });
    } catch (err) {
        console.error('Error sending email:', err);
        return res.status(500).json({
            status: false,
            message: 'Error sending email',
            err: err.message,
            name: req.file.originalname,
            type: req.file.mimetype,
            chartURL: fileURL,
        });
    }
};

module.exports = getResult;
