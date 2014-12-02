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
            data : rows
        });
    });

    connection.end();
    }
};

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
    var connection = mysqldb.getConnection();
    connection.connect();

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