/*
** Initiates the Peer2Peer Network and sets up the SuperNode
*/

/* Required Packages */
var config = require('app-config');	// Module to parse configuration data
var mongojs = require('mongojs'); 	// MongoDB Driver
var smoke = require('smokesignal');	// Module for p2p helper

var db = mongojs(config.db.db,config.p2p.collections); // Create a connection to the database

db.netConfig.findOne(function(err,doc){
	if(err || !doc){
		console.error("Error retrieving Supernode configuration");
		db.close();
		process.kill(1);
	}

	/* Create a network node */
	var node = smoke.createNode({
  	port: doc.port,
		address: smoke.localIp(doc.gateway + '/' + doc.netmask),
	 	seeds: [{port: doc.port, address:doc.seed}]
	}); //var node

	console.log("ID",node.id); // This p2p network node's identifier

	/* Start a new network Node and listen for the proper events*/
	node.on('connect', function() {
  	console.log("Node Connected\n");
	}).on('disconnect',function(){
  	console.log("Node Disconnected\n");
	}).on('error',function(err){
		throw err
	}).start();
	
	/* DEBUG Print out comms */
	process.stdin.pipe(node.broadcast).pipe(process.stdout)
}); //db.netConfig.findOne
