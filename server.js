const express = require('express');
const path = require('path');
const app = express();
app.use(express.static(path.join(__dirname, '/example/dist')));
app.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname, '/example/dist/index.html'));
});
app.listen(process.env.PORT || 8080);