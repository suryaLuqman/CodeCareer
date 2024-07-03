const express = require('express');
const router = express.Router();
const controllers = require('./controllers');

router.get('/', (req, res) => {
   res.send('Hello, World!');
});

router.get('/api', (req, res) => {
   res.send('Hello, World!');
});

router.post('/api/:text', controllers.processText);

router.post('/sendmail', controllers.sendEmail);

module.exports = router;
