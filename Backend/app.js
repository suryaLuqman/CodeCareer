require('dotenv').config();
const express = require('express');
const routes = require('./routes');

const app = express();
app.use(express.json());
app.use(express.text());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).json({});
  }
  next();
});

app.use('/api', routes);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server is running on port ${port}`));
