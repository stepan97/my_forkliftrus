const express = require('express');
const app = express();
const morgan = require('morgan');

app.use(morgan('tiny'));

require('./startup/createStaticFolders')();
require('./startup/db')();
require('./startup/routes')(app);
require('./startup/joiObjectId')();

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));
