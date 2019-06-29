const { log } = console;
require('dotenv').config({ path: 'variables.env' });

const fs = require('fs');
const path = require('path');
const express = require('express');
const app = new express();
let root_path = './src';
root_path = './dist';

app.set('port', process.env.PORT);
app.set('host', process.env.HOST);
app.use(express.static(path.resolve(__dirname, root_path)));

const run_app = () => {
  const server = app.listen(app.get('port'), app.get('host'), () => {
    const host = server.address().address;
    const port = server.address().port;
    log(`Server is running on http://${host}:${port}`);
  });
};

run_app();
module.exports = app;