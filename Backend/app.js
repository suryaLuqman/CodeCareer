const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());
app.use(express.text()); // Tambahkan baris ini

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).json({});
  }
  next();
});

app.get('/', (req, res) => {
   res.send('Hello, World!');
});

app.get('/api', (req, res) => {
   res.send('Hello, World!');
});

app.post('/api/:text', async (req, res) => {
  try {
    console.log('Request:', req.params);
    console.log('Request text:', req.params.text);
    const response = await axios.get('https://chat.ai.cneko.org', {
      params: {
        t: req.params.text
      }
    });
    console.log('Success:', response.data);
    res.json(response.data);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred while processing your request.', message: error.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server is running on port ${port}`));
