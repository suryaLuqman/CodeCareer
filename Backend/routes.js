const express = require('express');
const router = express.Router();
const controllers = require('./controllers');
const multer = require('./libs/multer');

router.get('', (req, res) => {
   res.send('Hello, World!');
});

// router.get('/api', (req, res) => {
//    res.send('Hello, World!');
// });

router.post('/chat/:text', controllers.processText);
router.post('/sendmail', multer.image.single('chart'), controllers.sendEmail);
// router.post('/sendmail', controllers.sendEmail);

module.exports = router;
