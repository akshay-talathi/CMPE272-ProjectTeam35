var mysql = require('mysql');

function getConnection(){
	var connection = mysql.createConnection({        
	    host: 'localhost',
	    user: 'root',
	    password : '1234',
	    port : 3306, //port mysql
	    database:'Badge'
	});
	return connection;
}
exports.getConnection = getConnection;