require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'build')));
app.use('/env-config.js', express.static(__dirname + '/env-config.js'));

app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(process.env.PORT, process.env.HOST,() => {
  console.log(`PHP Text Message frontend server run on Port: ${process.env.PORT}`);
});
