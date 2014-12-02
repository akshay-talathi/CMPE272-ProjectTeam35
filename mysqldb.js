var mysql = require('mysql');

function getConnection(){
	var connection = mysql.createConnection({        
	    host: 'us-cdbr-iron-east-01.cleardb.net',
	    user: 'bafb25895406ae',
	    password : '2bf21561',
	    port : 3306, //port mysql
	    database:'ad_582f6fae18af714'
	});
	return connection;
}
exports.getConnection = getConnection;