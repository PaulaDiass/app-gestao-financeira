const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'dindin',
    password: '482613',
    port: 5432
});

const query = (text, param) => pool.query(text, param);

module.exports = { query };