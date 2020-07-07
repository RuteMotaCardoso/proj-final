// https://stackoverflow.com/questions/51899725/mysql-fetch-date-without-timezone-offset (para evitar conversão para UTC e subtrair 1h)
const mysql = require('mysql');
module.exports = {
	con: mysql.createConnection({
		host     : 'localhost',
		user     : 'root',
		password : '',
		database : 'bdcursoprofissional',
		timezone : 'Z'
	})
};