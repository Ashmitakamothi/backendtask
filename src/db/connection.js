const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "user_info",
  password: "root123",
  port: 5432,
  timezone: "UTC",
});

module.exports = pool;
