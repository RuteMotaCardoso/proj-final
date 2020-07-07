// https://stackoverflow.com/questions/51899725/mysql-fetch-date-without-timezone-offset (para evitar conversão para UTC e subtrair 1h)
const mysql = require('mysql');
console.log(process.env.JAWSDB_URL);
const localSql = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '',
	database : 'bdcursoprofissional',
	timezone : 'Z'
});
const herokuSql = mysql.createConnection(process.env.JAWSDB_URL);

module.exports = {
	con: localSql
};