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
    var query = connection.query("Select * from Organization where name= ?",[ data.name ],
            function(err, rows) {
                if (err){
                    console.log("Error inserting : %s", err);
                    connection.end();
                    res.redirect('/organizations');
            }
                
                if (!rows.length) {
                    console.log("Here Insert query" );
                    connection.query("Insert into Organization set ? " , data,
                                    function(err, rows) {
                                        if (err)
                                            console.log("Error Inserting: %s",err);
                                        req.flash('error','');
                                        connection.end();
                                        res.redirect('/organizations');

                                    });

                } else {
                    if (rows[0].email == input.email) {
                        req.flash('error','Organization name already exists ! please enter different name.');
                        connection.end();
                        res.redirect('/organizations/add');
                        
                    }
                }
                
                
            });
    }
}

 




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
}