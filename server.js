const express = require('express');
const compression = require('compression');
const path = require('path');

const app = express();
const port = process.env.PORT || 8080;
const distDirectory = path.join(__dirname, 'dist');
const indexFile = path.join(distDirectory, 'index.html');

app.use(compression());
app.use(express.static(distDirectory));
// server index when not found, since we handle not found errors in angular side.
app.use((req, res, next) => {
  if(req.accepts('html'))
    return res.sendFile(indexFile);
  return next();
});

app.listen(port, () => {
  console.log(`Starting listening on port: ${port}`);
});
