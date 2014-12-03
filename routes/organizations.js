var mysqldb = require('../mysqldb.js');
var util = require('util');

exports.orgList = function(req, res) {
	 if (req.session.firstname == undefined) {
	        res.redirect("/");
	    } else {
	    	 var connection = mysqldb.getConnection();
	    	    connection.connect();
	    	    connection.query('SELECT * FROM organization', function(err, rows) {

	    	        if (err)
	    	            console.log("Error Selecting : %s ", err);

	    	        console.log(rows);
	    	        res.render('organizations', {
	    	            page_title : "All Organizations - Node.js",
	    	            data : rows
	    	        });
	    	    });
	    	    connection.end();
	    }
   
};

exports.addOrganization = function(req, res) {
	if (req.session.firstname == undefined) {
        res.redirect("/");
    } else {
    var connection = mysqldb.getConnection();
    connection.query('SELECT * FROM organization', function(err, rows) {
        if (err)
            console.log("Error Selecting : %s ", err);
        console.log(rows);
        res.render('add_org', {
            page_title : "add organizations",
            message : req.flash('error'),
            data : rows
        });
    });

    connection.end();
    }
};
/*
exports.saveOrg = function(req, res) {

    var input = JSON.parse(JSON.stringify(req.body));
    var data = {
        name : input.name,
        description : input.description,
    };
    if (req.session.firstname == undefined) {
        res.redirect("/");
    } else {
    var connection = mysqldb.getConnection();
    console.log(data);
    connection.connect();
    var query = connection.query("Insert into Organization set ?", data,
            function(err, rows) {
                if (err)
                    console.log("Error inserting : %s", err);
                res.redirect('/organizations');
            });
    connection.end();
    }
}
*/

exports.saveOrg = function(req, res) {

    var input = JSON.parse(JSON.stringify(req.body));
    var data = {
        name : input.name,
        description : input.description,
    };
    if (req.session.firstname == undefined) {
        res.redirect("/");
    } else {
    var connection = mysqldb.getConnection();
    console.log(data);
    connection.connect();
    var query = connection.query("Insert into Organization set ?", data,
            function(err, rows) {
                if (err)
                    console.log("Error inserting : %s", err);
                req.flash('error','Organization name already added!');
                connection.end();
                res.redirect('/organizations/add');
            });
    }
}


/*
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
                            connection.query("INSERT INTO user set firstname = '" + input.firstname + "',lastname = '" + input.lastname + "',email = '" + input.email + "',password = SHA1('" + input.password + "'),contact = '" + input.contact + "',isActive = 1" ,
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
    
};


*/
/*exports.home = function(req, res) {
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

};*/


exports.editOrg = function(req, res) {
    console.log("Here");
    var id = req.params.id;
    console.log(id);
    if (req.session.firstname == undefined) {
        res.redirect("/");
    } else {
    var connection = mysqldb.getConnection();
    connection.connect();
    var query = connection.query("select * from Organization WHERE id = ?",
            [ id ], function(err, rows) {
                if (err)
                    console.log("Error inserting : %s", err);
                console.log(rows);

                res.render('edit_org', {
                    page_title : "Details",
                    data : rows,
                    id : rows[0].id,
                    name : rows[0].name,
                    description : rows[0].description

                })
            });
    connection.end();
    }
}

exports.saveDetails = function(req, res) {

    var input = JSON.parse(JSON.stringify(req.body));
    var id = req.params.id;
    var data = {
        name : input.name,
        description : input.description,
    };
    if (req.session.firstname == undefined) {
        res.redirect("/");
    } else {
    var connection = mysqldb.getConnection();
    console.log(data);
    connection.connect();

    var query = connection.query(
            "UPDATE Organization set name=?, description = ? WHERE id = ?", [
                    data.name, data.description, id ], function(err, rows) {

                if (err)
                    console.log("Error Updating : %s ", err);
                console.log(rows);
                res.redirect('/organizations');

            });
    }
};

exports.deleteOrganization = function(req, res) {

    var id = req.params.id;
    if (req.session.firstname == undefined) {
        res.redirect("/");
    } else {
    var connection = mysqldb.getConnection();
    connection.connect();

    var query = connection.query("DELETE FROM Organization WHERE id = ?", id,
            function(err, rows) {

                if (err)
                    console.log("Error deleting : %s ", err);

                res.redirect('/organizations');

            });
    connection.end();
    }
};