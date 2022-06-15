require('dotenv').config();
const express = require('express');
const sequelize = require('./database');
const models = require('./models/models');    
const cors = require('cors');
const router = require('./routes/index');
const errorHandler = require('./middleware/errorHandlingMiddleware');
const fileUpload = require('express-fileupload');
const path = require('path');

const PORT = process.env.PORT;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'static')));
app.use(fileUpload({}));
app.use('/api', router);

app.use(errorHandler);

const serverStart = async () => {
    try{
        await sequelize.authenticate();
        await sequelize.sync();
        app.listen(PORT, () => console.log('server started'));
    } catch(e) {
    }
}

serverStart();



