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
	connection.connect();
	var query = connection.query("SELECT * from user WHERE email = '"+input.email+"' and password = SHA1('" + input.password + "')"
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
						if(rows[0].isAdmin == 1){
							sess = req.session;
	                         console.log(req.session);
	                         sess.uid = rows[0].id;
	                         sess.firstname = rows[0].firstname;
	                         sess.lastname = rows[0].lastname;
	                         sess.email = rows[0].email;
	                         sess.isActive = rows[0].isActive;
	                         sess.isAdmin = rows[0].isAdmin;
							connection.end();
							res.render('home', {
								page_title : "Homepage - Node.js",
								data : rows
							});
						}else{
							res.redirect('/');
						}	
					}
				}
			});
}