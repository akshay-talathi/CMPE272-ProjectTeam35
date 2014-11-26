var mysqldb = require('../mysqldb.js');
var util = require('util');

exports.getOrganization = function(req, res) {
	var connection = mysqldb.getConnection();
	connection.query('SELECT * FROM organization', function(err, rows) {
		if (err)
			console.log("Error Selecting : %s ", err);
		console.log(rows);
		res.render('view_org', {
			page_title : "view organizations",
			data : rows
		});
	});

	connection.end();

};

exports.addOrganization = function(req, res) {
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

};

exports.save = function(req, res) {

	var input = JSON.parse(JSON.stringify(req.body));
	var data = {
		name : input.name,
		description : input.description,
	};
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

exports.home = function(req, res) {
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

};

exports.editOrganization = function(req, res) {

	var connection = mysqldb.getConnection();
	var query = connection.query('SELECT * FROM Organization', function(err,
			rows) {
		if (err)
			console.log("Error Selecting : %s ", err);
		console.log(rows);
		res.render('edit_org', {
			page_title : "home",
			data : rows
		});
	});

	connection.end();

};

exports.getDetails = function(req, res) {
	var id = req.params.id;

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

exports.saveDetails = function(req, res) {

	var input = JSON.parse(JSON.stringify(req.body));
	var id = req.params.id;
	var connection = mysqldb.getConnection();
	connection.connect();

	var data = {
		name : input.name,
		description : input.description,
	};
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

};

exports.deleteOrganization = function(req, res) {

	var id = req.params.id;
	var connection = mysqldb.getConnection();
	connection.connect();

	var query = connection.query("DELETE FROM Organization WHERE id = ?",id, function(err, rows) {

				if (err)
					console.log("Error deleting : %s ", err);

				res.redirect('/organizations');

			});
	connection.end();
}


/*
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * access points
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 */

exports.getAccessPoints = function(req, res) {
	var id = req.params.id;

	var connection = mysqldb.getConnection();
	connection.query('SELECT * FROM AccessPoints where organization_id=?',
			[ id ], function(err, rows) {
				if (err)
					console.log("Error Selecting : %s ", err);
				console.log(rows);
				res.render('view_accesspoints', {
					page_title : "view acces points",
					data : rows,
					org_id : id
				});
			});

	connection.end();

};

exports.addAccessPoints = function(req, res) {
	var id = req.params.id;
	var connection = mysqldb.getConnection();
	connection.query('SELECT * FROM AccessPoints where organization_id= ?',
			[ id ], function(err, rows) {
				if (err)
					console.log("Error Selecting : %s ", err);
				console.log(rows);
				res.render('add_accesspoints', {
					page_title : "add AccessPoints",
					data : rows,
					org_id : id

				});
			});

	connection.end();

};

exports.saveAccessPoints = function(req, res) {
	var id = req.params.id;
	console.log("saveAccessPoints:" + id);
	var input = JSON.parse(JSON.stringify(req.body));
	console.log("input ------" + input);
	var data = {
		name : input.name,
		organization_id : id
	};
	console.log("data.name" + data.name);
	var connection = mysqldb.getConnection();
	console.log(data);
	connection.connect();
	var query = connection.query("Insert into AccessPoints set ?", data,
			function(err, rows) {
				if (err)
					console.log("Error inserting : %s", err);
				res.redirect('/organizations');
			});
	connection.end();
}

exports.editAccessPoints = function(req, res) {

	var connection = mysqldb.getConnection();
	var query = connection.query('SELECT * FROM AccessPoints', function(err,
			rows) {
		if (err)
			console.log("Error Selecting : %s ", err);
		console.log(rows);
		res.render('edit_accesspoints', {
			page_title : "edit",
			data : rows,

		});
	});

	connection.end();

};

exports.getDetailsAccessPoints = function(req, res) {
	var id = req.params.id;

	var connection = mysqldb.getConnection();
	connection.connect();
	var query = connection.query("select * from AccessPoints WHERE id = ?",
			[ id ], function(err, rows) {
				if (err)
					console.log("Error inserting : %s", err);
				console.log(rows);

				res.render('edit_accesspoints', {
					page_title : "Details",
					data : rows,
					id : rows[0].organization_id,
					name : rows[0].name,
					organization_id : rows[0].organization_id,
					org_id : id

				})
			});
	connection.end();
}

exports.saveDetailsAccessPoints = function(req, res) {

	var input = JSON.parse(JSON.stringify(req.body));
	//var id = req.params.id;
	var connection = mysqldb.getConnection();
	connection.connect();

	var data = {
		id : input.id,
		name : input.name,
		organization_id : input.organization_id,
	};
	
	var connection = mysqldb.getConnection();
	console.log("-------------"+data.id);
	connection.connect();

	var query = connection.query(
			"update AccessPoints set name = ? where id = ?",
			[data.name, data.id], function(err, rows) {
				if (err)
					
					console.log("Error Updating : %s ", err);
				console.log(rows);
				res.redirect('/organizations/accesspoints/edit/'+data.id);

			});

};

exports.deleteAccessPoints = function(req, res) {

	var id = req.params.id;
	var connection = mysqldb.getConnection();
	connection.connect();

	var query = connection.query("DELETE FROM AccessPoints WHERE id = ?",
			[ id ], function(err, rows) {
				
				if (err)
					console.log("Error deleting : %s ", err);

				res.redirect('/organizations');

			});
	connection.end();
}
