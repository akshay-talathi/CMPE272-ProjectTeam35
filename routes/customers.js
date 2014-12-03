var mysqldb = require('../mysqldb.js');
var util = require('util');
var flash = require('req-flash');
var crypto = require('crypto');

function randomValueHex (len) {
    return crypto.randomBytes(Math.ceil(len/2))
        .toString('hex') // convert to hexadecimal format
        .slice(0,len);   // return required number of characters
}
var value = randomValueHex(7);
var express = require('express'),
app = express();
app.use(express.bodyParser());
/*
 * GET users listing.
 */


exports.signup = function(req, res) {
    res.render('signup', {
        page_title: "Sign Up"
    });
}



exports.login = function(req, res) {
    // console.log(mysqldb.getName());
    res.render('login', {
        page_title: "Login"
    });
};
exports.scan = function(req, res) {
    // console.log(mysqldb.getName());
    res.render('scan', {
        page_title: "Scan"
    });
};

exports.logindo = function(req, res) {
    if (req.method === 'OPTIONS') {
        console.log('!OPTIONS');
        var headers = {};
        // IE8 does not allow domains to be specified, just the *
        // headers["Access-Control-Allow-Origin"] = req.headers.origin;
        headers["Access-Control-Allow-Origin"] = "*";
        headers["Access-Control-Allow-Methods"] = "POST, GET, PUT, DELETE, OPTIONS";
        headers["Access-Control-Allow-Credentials"] = false;
        headers["Access-Control-Max-Age"] = '86400'; // 24 hours
        headers["Access-Control-Allow-Headers"] = "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept";
        res.writeHead(200, headers);
        res.end();
    } else {
        console.log(req.body);
        var input = JSON.parse(JSON.stringify(req.body));
        var connection = mysqldb.getConnection();
        var data = {
            email: input.userid,
            password: input.password,
        };
        connection.connect();
        console.log("das" + data);
        var result = 'false';
        var query = connection.query("SELECT * from user WHERE email = ? ", [data.email], function(err, rows) {
            if (err)
                console.log("Error fecthing details : %s", err);
            if (rows[0] == undefined) {
                result = 'false';
            }
            if (rows[0].password == data.password) {
                // sess = req.session;
                // console.log(req.session);
                // console.log(rows[0].firstName);
                // sess.fname = rows[0].firstName;
                // sess.lname = rows[0].lastName;
                // sess.email = rows[0].email;
                console.log(rows);
                result = 'true';

            } else {
                res.redirect('/');
            }
            console.log(result);
            res.json({
                "email": data.email,
                "result": result
            });
            // res.end(result);
        });
    }

}

///////prashant luthra/////////

exports.listAccessPoints = function(req, res){
	if(req.session.firstname == undefined)
	{
		redirect('/');
	}
	else{
	var id = req.params.id;
	var name = req.params.name;
	var connection = mysqldb.getConnection();
	connection.connect();
	connection.query('SELECT * from accesspoints where organization_id = ?',[id], function(err, rows){
		if(err)
			console.log("Error getting values % s", err);
		res.render('listAccessPoints', {page_title:"AccessPoints", data:rows, org_name: name});
	});
	connection.end();
	//}
	}
}

exports.showUserAccess = function(req,res){
	var id = req.params.id;
	var org_id = req.params.org_id;
	console.log("org_id: " +org_id);
	var name = req.params.name;
	var connection = mysqldb.getConnection();
	connection.connect();
	
	if(req.session.firstname == undefined)
		{
		res.redirect('/');
		}
	else
		{
	connection.query("SELECT ap.id as ap_id,ap.name as ap_name, u.firstname as firstname,u.lastname as lastname, a.user_id as user_id, a.isAllowed as isAllowed, a.valid_upto as valid_upto from accesspoints ap join access a join user u WHERE a.access_id = ap.id AND a.user_id= u.id AND a.access_id = ? AND ap.organization_id = ?", [id, org_id], function(err, rows){
		if(err)
			console.log("Error fetching results : %s", err);
		console.log(rows);
	/*		var validity = rows[0].valid_upto.toString();
			validity = validity.substring(0, validity.length-42);
			console.log(validity);*/
			res.render('showUserAccess',{page_title:"Access to Users", data: rows, ap_id: id, ap_name:name,org_id: org_id});
		
		
	});
		}
	connection.end();
		
}

exports.assignAccess = function(req,res){
	var id = req.params.id;
	var org_id = req.params.org_id;
	console.log("id: " +id);
	console.log("org_id: " +org_id);
	var connection = mysqldb.getConnection();
	connection.connect();
	
	if(req.session.firstname == undefined)
	{
	res.redirect('/');
	}
	else
	{
	connection.query("SELECT * from user where org_id = ?",[org_id], function(err, rows){
		if(err)
			console.log("Error getting values % s", err);
		console.log("Users Org Id: "+ rows[0].org_id);
		res.render('assignAccess', {page_title:"Assign Access", data:rows, ap_id: id, org_id: org_id});
		
	});
	}
	connection.end();
}

exports.postAccess = function(req, res){
		//var user_id = req.params.user_id;
		var ap_id = req.params.id;
		
		console.log("ap_id: "+ ap_id);
		
		var input = JSON.parse(JSON.stringify(req.body));
		console.log(input);
		var org_id = input.org_id;
		var connection = mysqldb.getConnection();
		connection.connect();
		
		if(req.session.firstname == undefined)
		{
		res.redirect('/');
		}
		else{
		//console.log(valid_string);
		var data1 = {
					access_id: ap_id,
					user_id : input.user,
					isAllowed: 1,
					valid_upto : input.validity,
				};
				console.log(data1);
				connection.query("Insert into access set ?", data1, function(err,rows1){
					if(err)
						console.log("Error inserting : %s", err);
					else
						{
						connection.query("SELECT ap.id as ap_id,ap.name as ap_name, u.firstname as firstname,u.lastname as lastname, a.user_id as user_id, a.isAllowed as isAllowed, a.valid_upto as valid_upto from accesspoints ap join access a join user u WHERE a.access_id = ap.id AND a.user_id= u.id AND a.access_id = ?", [ap_id], function(err, rows){
							if(err)
								console.log("Error fetching results : %s", err);
							console.log(rows);
							res.render('showUserAccess',{page_title:"Access to Users", data: rows,ap_name:rows[0].ap_name,ap_id:rows[0].ap_id, org_id:org_id});
						});
						connection.end();
						}
				});
		}
		
}

exports.updateUserAccess = function(req,res){
	var user_id = req.params.user_id;
	var ap_id = req.params.ap_id;
	var org_id = req.params.org_id;
	console.log(user_id);
	console.log(ap_id);
	console.log("org_id: "+org_id);
	var connection = mysqldb.getConnection();
	connection.connect();
	//var queryString = 'SELECT u.id as u_id,u.email as email, a.access_id as access_id, a.isAllowed as isAllowed, a.valid_upto as valid_upto FROM user u JOIN access a WHERE u.id = a.user_id AND a.access_id = ?  AND a.user_id = ?';
	//connection.query(queryString, [ap_id],[user_id], function(err, rows){;
	
	if(req.session.firstname == undefined)
	{
	res.redirect('/');
	}
	else{
	connection.query("SELECT u.id as u_id,u.email as email, a.access_id as access_id, a.isAllowed as isAllowed, a.valid_upto as valid_upto FROM user u JOIN access a WHERE u.id = a.user_id AND a.access_id = ?  AND a.user_id = ?",[ap_id,user_id], function(err, rows){
		if(err)
			console.log("Error getting values % s", err);
		console.log("Rows(email): "+rows[0].email);
		console.log("Rows(): "+rows[0].valid_upto);
		res.render('updateUserAccess', {page_title:"Update user access", data:rows[0], valid_temp:rows[0].valid_upto, email_temp: rows[0].email, allowed_temp: rows[0].isAllowed, ap_id:ap_id, org_id:org_id});
		//console.log(data);
		
	});
	}
	connection.end();
}

exports.postUpdate = function(req,res){
	var user_id = req.params.user_id;
	var ap_id = req.params.ap_id;
	console.log(user_id);
	console.log(ap_id);
	var input = JSON.parse(JSON.stringify(req.body));
	console.log(input);
	var org_id = input.org_id;
	console.log("Org Id: "+ org_id);
	console.log(typeof(input.validity));
	//var validity = new Date(input.validity);
	//console.log(typeof(validity));
	
	if(req.session.firstname == undefined)
	{
	res.redirect('/');
	}
	else{
	var connection = mysqldb.getConnection();
	connection.connect();
	
	var data = {
			isAllowed : input.isallowed,
			valid_upto : input.validity,
	};

	var	query = connection.query("UPDATE access set isAllowed = ?, valid_upto=? where user_id =? AND access_id = ?",[data.isAllowed, data.valid_upto, user_id,ap_id],function(err,rows){
		if(err)
			console.log("Error Inserting: %s",err);
		else
			{
			connection.query("SELECT ap.id as ap_id,ap.name as ap_name, u.firstname as firstname,u.lastname as lastname, a.user_id as user_id, a.isAllowed as isAllowed, a.valid_upto as valid_upto from accesspoints ap join access a join user u WHERE a.access_id = ap.id AND a.user_id= u.id AND a.access_id = ?", [input.access_id], function(err, rows){
				if(err)
					console.log("Error fetching results : %s", err);
				console.log(rows);
				res.render('showUserAccess',{page_title:"Access to Users", data: rows,ap_name:rows[0].ap_name,ap_id:rows[0].ap_id, org_id: org_id});
			});
			connection.end();
			}
		//connection.end();
	});
	}
}

exports.logout = function(req, res) {
    //var firstname = sess.firstname;
    //var lastlogin = new Date();
    //console.log(email);
    req.session.destroy(function(err) {
        if (err) {
            console.log(err);
        } else {
        		console.log("Inside Logout destroy function");
        		req.session = null;
        		sess = null;
        		//console.log("Sesion: "+req.session);
                res.redirect('/');
        }
    });
}

////////// PL - end////////////

exports.options = function(req, res) {
    console.log('!OPTIONS');
    var headers = {};
    // IE8 does not allow domains to be specified, just the *
    // headers["Access-Control-Allow-Origin"] = req.headers.origin;
    headers["Access-Control-Allow-Origin"] = "*";
    headers["Access-Control-Allow-Methods"] = "POST, GET, PUT, DELETE, OPTIONS";
    headers["Access-Control-Allow-Credentials"] = false;
    headers["Access-Control-Max-Age"] = '86400'; // 24 hours
    headers["Access-Control-Allow-Headers"] = "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept";
    res.writeHead(200, headers);
    res.end();
}

exports.verify = function(req, res) {
    var text = req.params.email;
    var param = text.split(",");
    var email = param[0];
    var hash = param[1];

    var connection = mysqldb.getConnection();
    connection.connect();
    console.log(email + " : " + hash);
    var result = null;
    var query = connection.query(
        "select u.user_id from user u join Access a on u.id = a.user_id " + "join AccessPoints ap on ap.id = a.access_id " + "WHERE u.email = ? and ap.access_point_id = ? " + "and a.isAllowed = 1 and a.valid_upto > now()", [email,
            hash
        ],
        function(err, rows) {
            if (err)
                console.log("Error fecthing details : %s", err);
            if (rows[0] == undefined) {
                result = 'false';
            } else {
                console.log(rows);
                result = 'true';

            }
            console.log(result);
            res.send(result);
            // res.end(result);
        });

}
exports.home = function(req, res) {
    res.render('admin-home');
}
exports.test = function(req, res) {
    res.render('index-1');
}


/* Save the customer */
exports.home = function(req, res) {
	if (req.session.firstname == undefined) {
    	res.redirect("/");
    } else {
    var connection = mysqldb.getConnection();
    connection.query('SELECT * FROM Organization', function(err, rows) {
        if (err)
            console.log("Error Selecting : %s ", err);
        console.log(rows);
        res.render('home', {
            page_title : "home",
            data : rows
        });
    });

    connection.end();
    }
};


exports.t = function(req, res){
res.render('test');
}
