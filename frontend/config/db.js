const mysql = require('mysql2');

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '', // if using XAMPP usually empty
  database: 'rugendo_rwanda'
});

db.getConnection((err, connection) => {
  if (err) {
    console.error('Database connection failed:', err);
  } else {
    console.log('MySQL Connected ✅');
    connection.release();
  }
});

module.exports = db.promise();