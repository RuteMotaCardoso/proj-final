// https://stackoverflow.com/questions/51899725/mysql-fetch-date-without-timezone-offset (para evitar conversão para UTC e subtrair 1h)
const mysql = require('mysql');
//console.log(process.env.JAWSDB_URL);
let sqlCon;

if (process.env.JAWSDB_URL != undefined ) {
	const herokuSql = mysql.createConnection(process.env.JAWSDB_URL);
	sqlCon = herokuSql;
}
else {
	const localSql = mysql.createConnection({
		host     : 'localhost',
		user     : 'root',
		password : '',
		database : 'bdcursoprofissional',
		timezone : 'Z'
	});
	sqlCon = localSql;
}
console.log(sqlCon);

module.exports = {
	con:sqlCon
};