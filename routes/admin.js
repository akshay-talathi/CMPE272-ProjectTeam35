var mysqldb = require('../mysqldb.js');
var util = require('util');
var crypto = require('crypto');

exports.login = function(req, res) {
    // console.log(mysqldb.getName());
    res.render('login', {
        page_title: "Login"
    });
};

exports.logindo = function(req, res) {
	console.log(req.body);
	var input = JSON.parse(JSON.stringify(req.body));
	var connection = mysqldb.getConnection();
	var data = {
		user_id : input.user_id,
		password : input.password,
	};
	connection.connect();
	var query = connection.query("SELECT * from user WHERE user_id = '"+input.user_id+"' and password = SHA1('" + input.password + "')"
			, function(err, rows) {
				if (err){
					console.log("Error fecthing details : %s", err);
				}
				else
				{
					console.log(rows);
					if (rows[0] == undefined) {
						res.redirect('/');
					}
					else
					{
						result = 'true';
						connection.end();
						res.render('home', {
							page_title : "Homepage - Node.js",
							data : rows
						});
					}
				}
			});
}