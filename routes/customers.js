
var mysqldb = require('../mysqldb.js');
var util = require('util');
/*
 * GET users listing.
 */

exports.list = function(req, res){
	var coneection = mysqldb.getConnection();
	connection.query('SELECT * FROM customer',function(err,rows)     {
        if(err)
           console.log("Error Selecting : %s ",err );
            res.render('customers',{page_title:"Customers - Node.js",data:rows});
         });
	connection.end();
  
};

exports.listCategory = function(req, res){
	//console.log(req.session.fname);
//	if(req.session.fname == undefined){
//		res.redirect("/");
//	}
//	else{
		var connection = mysqldb.getConnection();
		connection.connect();
		connection.query('SELECT * from category', function(err, rows){
			if(err)
				console.log("Error getting vlaues % s", err);
			res.render('categories', {page_title:"Categories", data:rows, isAdmin : sess.isAdmin, name: sess.fname, email : sess.email, lastlogin: sess.lastlogin});
		});
		connection.end();
	//}
}

exports.signup = function(req, res){
	res.render('signup', {page_title:"Sign Up"});
}
exports.add = function(req, res){
	res.render('add_customer', {page_title:"Add Customers"});
}

exports.addCategory = function(req,res){
//	if(req.session.fname == undefined){
//		res.redirect("/");
//	}
//	else{
		var input = JSON.parse(JSON.stringify(req.body));
		var data = {
				name : input.name,
				description : input.description,
		};
		var connection = mysqldb.getConnection();
		console.log(data);
		connection.connect();
		var query = connection.query("Insert into category set ? ", data, function(err, rows){
			if(err)
				console.log("Error inserting : %s", err);
			res.redirect('/home');
			//res.render('categories', {page_title:"Categories", data:rows, name:sess.fname, lastlogin: sess.lastlogin, email :sess.email});
		});
		connection.end();
	//}
}

exports.addElement = function(req, res){
//	if(req.session.fname == undefined){
//		res.redirect("/");
//	}
//	else {
//		
		var input = JSON.parse(JSON.stringify(req.body));
		var data = {
				name : input.name,
				description : input.description,
				address : input.address,
				total_reviews: 0,
				category_name : input.category_name
		};
		var connection = mysqldb.getConnection();
		console.log(data);
		connection.connect();
		
		var query = connection.query("Insert into element set ? ", data, function(err, rows){
			if(err)
				console.log("Error inserting : %s", err);
			res.redirect('/getDetails/'+data.category_name);
		});
		connection.end();
	//}
	
}
exports.edit = function(req,res){
	var id = req.params.id;
	req.getConnection(function(err, connection){
		connection.query('select * from customer where id = ?', [id], function(err, rows){
			if(err){
				cosole.log("error : %s", err);
			}
			res.render('edit_customer', {page_title:"Edit Customers",data : rows});
		});
	});
};

exports.save = function(req, res){
//	var input = JSON.parse(JSON.stringify(req.body));
//	console.log(input);
//	var connection = mysqldb.getConnection();
//	connection.connect();
//	var data = {
//			firstName : input.firstName,
//			lastName : input.lastName,
//			email : input.email,
//			password : input.password,
//			isAdmin : 'N',
//			lastlogin: new Date()
//	};
//	console.log(data);
//	var query = connection.query("Insert into users set ? ", data, function(err, rows){
//		if(err)
//			console.log("Error inserting : %s", err);
//		res.redirect('/');
//	});
//	connection.end();
	var rest = require('restler');

	rest.get('http://localhost:8080/NewGumBall/machines').on('complete', function(result) {
	  if (result instanceof Error) {
	    console.log('Error:', result.message);
	    this.retry(5000); // try again after 5 sec
	  } else {
	    console.log(result);
	  }
	});

}
exports.login = function(req, res){
//	console.log(mysqldb.getName());
	res.render('login', {page_title : "Login"});
};
exports.scan = function(req, res){
//	console.log(mysqldb.getName());
	res.render('scan', {page_title : "Scan"});
};

exports.logindo = function(req, res){
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
				email : input.userid,
				password : input.password,
		};
		connection.connect();
		console.log("das"+data);
		var result = 'false';
		var query = connection.query("SELECT * from user WHERE email = ? ", [data.email], function(err, rows){
			if(err)
				console.log("Error fecthing details : %s", err);
			if(rows[0]==undefined){
				result = 'false';
			}
			if(rows[0].password==data.password){
//				sess = req.session;
//				console.log(req.session);
//				console.log(rows[0].firstName);
//				sess.fname = rows[0].firstName;
//				sess.lname = rows[0].lastName;
//				sess.email = rows[0].email;
				console.log(rows);
				result = 'true';
				
			}
			else {
				res.redirect('/');
			}
			console.log(result);
			res.json({"email": data.email, "result": result});
			//res.end(result);
		});
	}
	
}
exports.reviews = function(req, res){
	var name = req.params.name;
	res.render('review_submit',{page_title:"Categories",element_name:name, name:sess.fname, lastlogin: sess.lastlogin, email :sess.email});
}
exports.get_reviews = function(req, res){
	var name = req.params.name;
//	if(req.session.fname == undefined){
//		res.redirect("/");
//	}
//	else {
		var connection = mysqldb.getConnection();

		connection.query("Select * from reviews where element_name = ?",[name], function(err, rows){
			if(err)
				console.log("Error fetching results : %s", err);
			res.render('get_reviews',{page_title:"Categories", data: rows, element_name:name, name:sess.fname, lastlogin: sess.lastlogin, email :sess.email});
		});
		connection.end();
	//}
		
}
exports.write_reviews = function(req, res){
	var input = JSON.parse(JSON.stringify(req.body));
//	if(req.session.fname == undefined){
//		res.redirect("/");
//	}
//	else {
		var connection = mysqldb.getConnection();

		var data = {
				element_name : input.element_name,
				rating : input.rating,
				review : input.review,
				submitted_by : sess.email,
				submitted_on : new Date(),
		};
		
		var query  = connection.query("Insert into reviews set ? ", data, function(err, rows){
			  if (err)
	              console.log("Error inserting : %s ",err );
			  else{

					connection.query("Select * from reviews where element_name = ?",[input.element_name], function(err, rows){
						if(err)
							console.log("Error fetching results : %s", err);
						console.log(rows + "************");
						res.render('get_reviews',{page_title:"Categories", data: rows, element_name:data.element, name:sess.fname, lastlogin: sess.lastlogin, email :sess.email});
					});
					connection.end();
			  }
		});
	
	//}
	
};
exports.save_edit = function(req,res){
    var input = JSON.parse(JSON.stringify(req.body));
    var id = req.params.id;
    req.getConnection(function (err, connection) {
        var data = {
            name    : input.name,
            address : input.address,
            email   : input.email,
            phone   : input.phone 
        
        };
        
        connection.query("UPDATE customer set ? WHERE id = ? ",[data,id], function(err, rows)
        {
  
          if (err)
              console.log("Error Updating : %s ",err );
         
          res.redirect('/customers');
          
        });
    
    });
};

exports.delete_customer = function(req,res){
          
     var id = req.params.id;
    
     req.getConnection(function (err, connection) {
        
        connection.query("DELETE FROM customer  WHERE id = ? ",[id], function(err, rows)
        {
            
             if(err)
                 console.log("Error deleting : %s ",err );
            
             res.redirect('/customers');
             
        });
        
     });
};

exports.getDetails = function(req,res){
	var name = req.params.name;
//	if(req.session.fname == undefined){
//		res.redirect("/");
//	}
//	else {
		var connection = mysqldb.getConnection();

		connection.query("Select * from element where category_name = ?",[name], function(err, rows){
			if(err)
				console.log("Error fetching results : %s", err);
			console.log(rows + "************");
			
			res.render('details',{page_title:"Details", isAdmin : sess.isAdmin, data : rows, category_name : name, data:rows, name : sess.fname, lastlogin: sess.lastlogin});
		});
		
		connection.end();
	//}
}

exports.logout = function(req, res){
	var email = sess.email;
	var lastlogin = new Date();
	console.log(email);
	req.session.destroy(function(err){
		if(err){
			console.log(err);
		}
		else{
			var connection = mysqldb.getConnection();

			connection.query("UPDATE users set lastlogin = ? WHERE email = ? ", [lastlogin,email], function(err, rows){
				if(err){
					cosole.log("error : %s", err);
				}
				res.redirect('/');
			});
		
			connection.end();
		}
	});
}

exports.getHistoryPage = function(req, res){
	res.render('History', {page_title:"",dataVar : "ABC"});
}

exports.getBiddingHistory  = function(req, res){
	var connection = mysqldb.getConnection();
	var id = 1 //session user-id
	connection.query("select p.id as purchase_id, pr.id as product_id, pr.name as product_name, pr.details as product_details, " +
			" pr.image, s.id as seller_id," +
			" s.firstname as seller_name, s.membership_no as membership_no, p.bid_amount, p.submitted_on, p.rating " +
			" from Purchase p JOIN Products pr" +
			" ON p.product_id = pr.id " +
			" JOIN person s ON s.id = pr.seller_id " +
			" WHERE p.customer_id = ? AND pr.isForAuction = 1",[id], function(err, rows){
			if(err)
			console.log("Error fetching results : %s", err);
			console.log(rows + "************");
			res.render('BiddingHistory',{page_title:"",dataVar : rows});
	});
	
	connection.end();
}


exports.getPurchaseHistory  = function(req, res){
	var connection = mysqldb.getConnection();
	var id = 1 //session user-id
	connection.query("	select p.id as purchase_id, pr.id as product_id, pr.name " +
			" as product_name,pr.details as product_details, pr.image, s.id " +
			" as seller_id,s.firstname as seller_name, p.bid_amount, " +
			" p.submitted_on, p.rating " +
			" from Purchase p JOIN Products pr ON p.product_id = pr.id JOIN person s " +
			" ON s.id = pr.seller_id WHERE p.customer_id = ? AND p.sold=1",[id], function(err, rows){
			if(err)
			console.log("Error fetching results : %s", err);
			console.log(rows + "************");
			res.render('BiddingHistory',{page_title:"",dataVar : rows});
	});
	
	connection.end();
}




exports.getSellingHistory  = function(req, res){
	var connection = mysqldb.getConnection();
	var id = 2 //session user-id
	connection.query("select p.id as purchase_id, pr.id as product_id, pr.name as product_name, pr.image as image, " +
			" s.id as seller_id, s.firstname as seller_name, p.bid_amount as bid_amount, p.submitted_on, p.rating, " +
			" c.firstname as customer_name, c.id as customer_id, p.quantity " +
			" from Purchase p JOIN Products pr ON p.product_id = pr.id " +
			" JOIN person s ON s.id = pr.seller_id JOIN  person c " +
			" ON c.id = p.customer_id WHERE pr.seller_id = 2 AND p.sold=1",[id], function(err, rows){
			if(err)
			console.log("Error fetching results : %s", err);
			console.log(rows + "************");
			res.render('SellingHistory',{page_title:"",dataVar : rows});
	});
	
	connection.end();
}

exports.imageForm = function(req, res) {
    res.render('upload', {
        title: 'Upload Images'
    });
};
 

exports.options = function(req, res){
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
exports.uploadImage = function(req, res, next){
       // console.log('file info: ',req.files.image);
 
        //split the url into an array and then get the last chunk and render it out in the send req.
        var pathArray = req.files.image.path.split( '/' );
 
        var ts = new Date();
        console.log('A : '+ req.files.image.name);
        console.log('A1 : ' + req.files.image.size);
        console.log('A2 : '+req.files.image.path);
        console.log('A3 : '+req.body.title);
        console.log('A4 : '+req.files.image);
        console.log('A5 :'+ pathArray)
      
        
        var fs = require('fs');
        fs.rename( req.files.image.path, '/Users/prashantyadav/Documents/images/uploads/AF.png', function(err) {
            if ( err ) console.log('ERROR: ' + err);
        });
        
        res.send(util.format('<img src="/Users/prashantyadav/Documents/images/uploads/AF.png">'
        ));
};

exports.verify = function(req,res){
	var text = req.params.email;
	var param = text.split(",");
	var email = param[0];
	var hash = param[1];
	
	var connection = mysqldb.getConnection();
	connection.connect();
	console.log(email + " : "+ hash);
	var result = null;
	var query = connection.query("select u.user_id from user u join Access a on u.id = a.user_id " +
			"join AccessPoints ap on ap.id = a.access_id " +
			"WHERE u.email = ? and ap.access_point_id = ? " +
			"and a.isAllowed = 1 and a.valid_upto > now()", [email, hash], function(err, rows){
		if(err)
			console.log("Error fecthing details : %s", err);
		if(rows[0]==undefined){
			result = 'false';
		}
		else{
			console.log(rows);
			result = 'true';
			
		}
		console.log(result);
		res.send(result);
		//res.end(result);
	});

	
}
exports.home = function(req, res){
	res.render('admin-home');
}
exports.test = function(req, res){
	res.render('index-1');
}
