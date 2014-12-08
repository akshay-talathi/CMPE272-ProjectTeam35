var mysql = require('mysql');

function getConnection(){
	var connection = mysql.createConnection({        
	    host: 'us-cdbr-iron-east-01.cleardb.net',
	    user: 'bb020ceda88360',
	    password : 'bc9c9db3',
	    port : 3306, //port mysql
	    database:'ad_c10f80d933df6f1'
	});
	return connection;
}
exports.getConnection = getConnection;