require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { dbConnection } = require('./database/config');

const app = express();

app.use(cors());
app.use(express.json());
dbConnection();

app.use('/api/register', require('./routes/register.route'));
app.use('/api/auth', require('./routes/auth.route'));
app.use('/api/user', require('./routes/user.route'));
app.use('/api/upload', require('./routes/upload.route'));
app.use('/api/category', require('./routes/category.route'));
app.use('/api/product', require('./routes/product.route'));
app.use('/api/supervisor', require('./routes/supervisor.route'));
app.use('/api/cliente', require('./routes/cliente.route'));

app.listen(process.env.PORT, () => {
    console.log(`Server run in port ${process.env.PORT}`);
})