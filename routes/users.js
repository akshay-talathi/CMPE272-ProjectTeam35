var mysqldb = require('../mysqldb.js');
var util = require('util');
var crypto = require('crypto');
function randomValueHex (len) {
    return crypto.randomBytes(Math.ceil(len/2))
        .toString('hex') // convert to hexadecimal format
        .slice(0,len);   // return required number of characters
}
var value = randomValueHex(7); 

exports.usersList = function(req, res) {
    var org_id = req.params.id;
    console.log(org_id);
    if (req.session.firstname == undefined) {
    	res.redirect("/");
    } else {
    var connection = mysqldb.getConnection();
    connection.connect();
    connection.query("SELECT * FROM user where isAdmin = 0 and org_id = " +org_id ,
            function(err, rows) {

                if (err)
                    console.log("Error Selecting : %s ", err);
                //console.log(rows);

                res.render('users', {
                    page_title : "users - Node.js",
                    data : rows,
                    org_id : org_id,
                    message : req.flash('error')
                });

            });
    connection.end();
    }
};
exports.addUser = function(req, res) {
	var org_id = req.params.org_id;
    res.render('add_user', {
        page_title : "Add Users-Node.js",
        message : req.flash('error')
    });
};



exports.editUser = function(req, res) {
    console.log("here");
    var id = req.params.id;
    if (req.session.firstname == undefined) {
    	res.redirect("/");
    } else {
    var connection = mysqldb.getConnection();
    console.log("here");
    connection.connect();
    connection.query('SELECT * FROM user WHERE id = ?', [ id ],
            function(err, rows) {

                if (err)
                    console.log("Error Selecting : %s ", err);
                console.log("here");
                res.render('edit_user', {
                    page_title : "Edit Users - Node.js",
                    data : rows
                });
            });
    console.log("here - editUser");
    connection.end();
    }
};
/* Save the customer */
exports.saveUser = function(req, res) {
    var org_id = req.params.org_id;
    var input = JSON.parse(JSON.stringify(req.body));
    console.log(input);
    var connection = mysqldb.getConnection();
    connection.connect();
    var data = {

        firstname : input.firstname,
        lastname : input.lastname,
        email : input.email,
        contact : input.contact,
        isActive : 1,
        qr : null
    };
    var query = connection.query("SELECT * from user WHERE email = ? ",[ data.email ],
                    function(err, rows) {
                        
                        if (err){
                                    console.log("Error fecthing details : %s", err);
                                    connection.end();
                                    res.redirect('/register');
                        }
                        console.log("Found user:" + rows.length);
                        if (!rows.length) {
                            console.log("Here Insert query" + input.firstname + input.lastname);
                            connection.query("INSERT INTO user set firstname = '" + input.firstname + "',lastname = '" + input.lastname + "',email = '" + input.email + "',password = SHA1('" + input.password + "'),contact = '" + input.contact + "',isActive = 1, isAdmin=0" ,
                                            function(err, rows) {
                                                if (err)
                                                    console.log("Error Inserting: %s",err);
                                                req.flash('error','You are registered!');
                                                connection.end();
                                                res.redirect('/register');

                                            });

                        } else {
                            if (rows[0].email == input.email) {
                                req.flash('error','Email ID already exists. Please try another email.');
                                connection.end();
                                res.redirect('/register');
                                
                            }
                        }
                    });
};/* Save edited customer */

exports.save_edit_user = function(req, res) {
    console.log("save Edit User");
    var id = req.params.id;
    var org_id = req.params.org_id;
    var input = JSON.parse(JSON.stringify(req.body));
    var firstname = input.firstname;
    var lastname = input.lastname;
    var email = input.email;
    var contact = input.contact;
    var isActive = req.body.isActive;
    var qr = req.params.qr;
    console.log(isActive);
    if (req.session.firstname == undefined) {
    	res.redirect("/");
    } else {
    var connection = mysqldb.getConnection();
    connection.connect();
    console.log(firstname);
    /*connection.query("UPDATE user SET firstname = '" + input.firstname + "',lastname = '" + input.lastname + "',email = '" + input.email + "',contact = '" + input.contact + "',isActive =" + req.body.isActive + ",org_id = " + req.body.org_id + "where user_id = '"+input.user_id+"';" ,
            function(err, rows) {
        if (err)
            console.log("Error Updating : %s ", err);
        console.log("save edit user ");
res.redirect('/organizations/' + input.org_id + '/users');
    });
    connection.end();
};*/
    
                    console.log("Here Insert query" + input.firstname + input.lastname);
                    connection.query("Update `user` SET firstname = '" + input.firstname + "',lastname = '" + input.lastname + "',email = '" + input.email + "',password = SHA1('" + input.password + "'),contact = '" + input.contact + "',isActive =" + req.body.isActive + " where id = '"+id+"';"  ,
                                    function(err, rows) {
                                        if (err)
                                            console.log("Error Inserting: %s",err);
                                        //req.flash('error','You are registerd.Please Login!');
                                        connection.end();
                                        res.redirect('/organizations/'+ org_id+ '/users');

                                    });
// console.log(query.sql); get raw query
    }
};

exports.resetPassword = function(req, res) {
    console.log("Inside ReseT Password");
	var id = req.params.id;
    var org_id = req.params.org_id;
    console.log("here Reset Password:" +id);
    console.log("here Reset:" +org_id);
    if (req.session.firstname == undefined) {
    	res.redirect("/");
    } else {
    var connection = mysqldb.getConnection();
    connection.connect();

    connection.query("UPDATE user set password = SHA1('password1234') WHERE id = "+id ,
            function(err, rows) {

                if (err)
                    console.log("Error deleting : %s ", err);
                req.flash('error','Password has been reset!');
                res.redirect('/organizations/' + org_id + '/users');

            });
    console.log("Password Reset complete");
    }
};

exports.status_user = function(req, res) {
	console.log("Here")
    var id = req.params.id;
    var org_id = req.params.org_id;
    var sid = req.params.sid;
    console.log("here");
    if (req.session.firstname == undefined) {
    	res.redirect("/");
    } else {
    var connection = mysqldb.getConnection();
    connection.connect();
    var data = {

        isActive : sid
    };

    connection.query("UPDATE user set ? WHERE id = ? ", [ data, id ],
            function(err, rows) {

                if (err)
                    console.log("Error deleting : %s ", err);

                res.redirect('/organizations/' + org_id + '/users');

            });
    }
};


exports.unregUsersList = function(req, res) {
    var org_id = req.param('org_id');
    console.log('org_id: '+org_id);
    if (req.session.firstname == undefined) {
    	res.redirect("/");
    } else {
    var connection = mysqldb.getConnection();
    connection.connect();
    connection.query("SELECT * FROM user where isAdmin = 0 and org_id IS NULL",
            function(err, rows) {

                if (err)
                    console.log("Error Selecting : %s ", err);
                console.log(rows);

                res.render('addUnregUsers', {
                    page_title : "users - Node.js",
                    data : rows,
                    org_id : org_id
                });

            });
    connection.end();
    }
};

exports.addUseToOrg = function(req, res) {
	var id = req.params.id;
    var org_id = req.params.org_id;
    console.log('org_id: '+org_id);
    if (req.session.firstname == undefined) {
    	res.redirect("/");
    } else {
    var connection = mysqldb.getConnection();
    connection.connect();
    connection.query("UPDATE user set org_id = "+org_id+" WHERE id = "+id,
    		function(err, rows) {

        if (err)
            console.log("Error deleting : %s ", err);

        res.redirect('/organizations/' + org_id + '/unregistered/users');

    });
    }
};