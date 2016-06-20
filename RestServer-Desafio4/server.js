/*global require, process, console */
/*jslint plusplus: true, newcap: true */
var firebase = require('firebase'),
	_   = require('lodash'),
	express = require('express'),
	sysInfo = require('./utils/sys-info');

var fbconfig = {
	databaseURL: "https://desafioangularjs.firebaseio.com",
	serviceAccount: "./RestServer-ServiceAccount.json"
};
firebase.initializeApp(fbconfig);

var bodyParser = require('body-parser');
var app        = express();

var ipaddress = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
var port = process.env.OPENSHIFT_NODEJS_PORT || 8666;

// Set port
app.set('port', port);

app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
	extended: true
}));

/**
 * Enables CORS for Rest API
 */
app.use(function (req, res, next) {
	'use strict';
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

// Ref. http://stackoverflow.com/questions/3653065/get-local-ip-address-in-node-js
var os = require('os');
var ifaces = os.networkInterfaces();
/**
 * Gets local IP address.
 * @returns {string} Local IP as String
 */
var getLocalIP = function () {
	'use strict';
	var result = '';
	Object.keys(ifaces).forEach(function (ifname) {
		var alias = 0;

		ifaces[ifname].forEach(function (iface) {
			if ('IPv4' !== iface.family || iface.internal !== false) {
				// skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
				return;
			}

			if (alias >= 1) {
				// this single interface has multiple ipv4 addresses
				result += ifname + ':' + alias + ' ' + iface.address;
			} else {
				// this interface has only one ipv4 adress
				result += ifname + ' ' + iface.address;
			}
			++alias;
		});
	});

	return result;
};


var clientsRef = firebase.database().ref('clients');

/**
 * Stores the client information on Firebase
 * @param clientInfo client information
 */
var storeClient = function (clientInfo) {
	var extraInfo = {
			registerDate: (new Date()).getTime(),
			clientActive: true
		},
		client = clientInfo;
	_.assign(client, extraInfo);
	clientsRef.push(client, function () {
		console.log('Client presumely registered in Firebase');
	});
};

/**
 * Updates a client
 * @param clientId Client identifier
 * @param updatedClient An updated client Object (must be an object)
 */
var updateClient = function (clientId, updatedClient) {
	var clientRef = firebase.database().ref('clients/' + clientId);
	clientRef.update(updatedClient, function () {
		console.log('Client presumely updated');
	});
};

/**
 * Retrieves all clients for a certain owner
 * @param owner The list owner
 */
var retrieveClients = function (owner) {
	return clientsRef.orderByChild('owner')
		.startAt(owner).endAt(owner)
		.once('value');
};

/**
 * Retrieves all registered clients
 */
var retrieveAllClients = function () {
	return clientsRef.orderByChild('registerDate').once('value');
};


// Openshift health
app.get('/health', function (req, res) {
	'use strict';
	res.writeHead(200);
	res.end();
});

// Openshift info
app.get('/info/:cmd', function (req, res) {
	'use strict';
	res.setHeader('Content-Type', 'application/json');
	res.setHeader('Cache-Control', 'no-cache, no-store');
	res.end(JSON.stringify(sysInfo[req.params.cmd]()));
});


// Retrieves the registered clients
app.get('/clients', function (req, res) {
	'use strict';

	var listOwner = req.query.owner;

	retrieveClients(listOwner).then(function(devices){
		var result = devices.val();
		result = _.map(result, function(v, k){
		   var data = _.assign(v, { internalId: k });
		   return data;
		});

		res.json(result);
	});
});

// Registers a new client
app.post('/clients', function (req, res) {
	'use strict';
	storeClient(req.body);

	res.json(req.body);
});

// Updates a client
app.put('/clients/:client_id', function (req, res) {
	'use strict';
	var clientId = req.params.client_id;
	updateClient(clientId, req.body);

	res.json(req.body);
});

app.listen(app.get('port'), ipaddress, function () {
	'use strict';
	console.log('Server started on localhost:' + app.get('port') + '; Press Ctrl-C to terminate.');
	console.log('Please connect to: ', getLocalIP(), '\nor to configured IP: ', ipaddress);
	console.log(`Application worker ${process.pid} started...`);
});

/**
 * Methods are exported so they can be used from other scripts
 * @type {{storeClient: storeClient, updateClient: updateClient, retrieveClients: retrieveClients, retrieveAllClients: retrieveAllClients}}
 */
module.exports = {
	storeClient: storeClient,
	updateClient: updateClient,
	retrieveClients: retrieveClients,
	retrieveAllClients: retrieveAllClients
}
