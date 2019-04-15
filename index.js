const express = require('express');
const app = express();
const morgan = require('morgan');
const server = require('http').Server(app);

// logger
app.use(morgan('tiny'));

require('./startup/createStaticFolders')();
// require('./startup/db')();
require('./startup/routes')(app);
require('./startup/joiObjectId')();
// add socket connection for 'feedback's and 'order call's
require('./startup/socket.js').initSocket(server);

const port = process.env.PORT || 3000;
server.listen(port, () => console.log(`Listening on port ${port}`));
