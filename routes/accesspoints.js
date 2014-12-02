var mysqldb = require('../mysqldb.js');
var util = require('util');

exports.getAccessPoints = function(req, res) {
    var org_id = req.params.org_id;
    if (req.session.firstname == undefined) {
        res.redirect("/");
    } else {
    var connection = mysqldb.getConnection();
    connection.query('SELECT * FROM AccessPoints where organization_id=?',
            [ org_id ], function(err, rows) {
                if (err)
                    console.log("Error Selecting : %s ", err);
                console.log(rows);
                res.render('view_accesspoints', {
                    page_title : "view acces points",
                    data : rows,
                    organization_id : org_id
                });
            });

    connection.end();
    }
};

exports.addAccessPoints = function(req, res) {
    var org_id = req.params.org_id;

    res.render('add_accesspoints', {
        page_title : "add AccessPoints",
        org_id : org_id
    });
};

exports.saveAccessPoints = function(req, res) {
    var org_id = req.params.org_id;
    var input = JSON.parse(JSON.stringify(req.body));
    console.log("input ------" + input);
    var data = {
        name : input.name,
        organization_id : org_id,
        access_point_id : input.accesspoint
    };
    console.log("data.name" + data.name);
    if (req.session.firstname == undefined) {
        res.redirect("/");
    } else {
    var connection = mysqldb.getConnection();
    console.log(data);
    connection.connect();
    var query = connection.query("Insert into accesspoints set ?", data,
            function(err, rows) {
                if (err)
                    console.log("Error inserting : %s", err);
                res.redirect('/organizations/' + org_id + '/accesspoints');
            });
    connection.end();
    }
}

exports.editAccessPoints = function(req, res) {
    var id = req.params.id;
    var org_id = req.params.org_id;
    if (req.session.firstname == undefined) {
        res.redirect("/");
    } else {
    var connection = mysqldb.getConnection();
    connection.connect();
    var query = connection.query(
            "select * from accesspoints WHERE id = ?", [ id ],
            function(err, rows) {
                if (err)
                    console.log("Error inserting : %s", err);
                console.log(rows);

                res.render('edit_accesspoints', {
                    page_title : "Details",
                    data : rows,
                    org_id : org_id,
                    id : id
                })
            });
    connection.end();
    }
}

exports.saveDetailsAccessPoints = function(req, res) {

    var input = JSON.parse(JSON.stringify(req.body));
    var id = req.params.id;
    var org_id = req.params.org_id;
    var connection = mysqldb.getConnection();
    connection.connect();

    var data = {
        id : id,
        name : input.name
    };
    if (req.session.firstname == undefined) {
        res.redirect("/");
    } else {
    var connection = mysqldb.getConnection();
    console.log(data);
    connection.connect();

    var query = connection.query("update accesspoints set name = '"+input.name+"', organization_id = "+org_id+" where id = "+id,
                    function(err, rows) {
                        if (err)

                            console.log("Error Updating : %s ", err);
                        console.log(rows);
                        res.redirect('/organizations/' + org_id + '/accesspoints');

                    });
    }
};

exports.deleteAccessPoints = function(req, res) {

    var id = req.params.id;
    console.log(id);
    var org_id = req.params.org_id;

    console.log(org_id);
    if (req.session.firstname == undefined) {
        res.redirect("/");
    } else {
    var connection = mysqldb.getConnection();
    connection.connect();
    console.log("Called*****");
    var query = connection.query("DELETE FROM accesspoints WHERE id = ?",
            [ id ], function(err, rows) {

                if (err)
                    console.log("Error deleting : %s ", err);

                res.redirect('/organizations/' + org_id + '/accesspoints');

            });
    connection.end();
    }
}
