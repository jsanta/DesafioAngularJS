var fb   = require('./server.js'),
    data = require('./dummyData.js'),
    _    = require('lodash'),
    clients = data.dummyData.clients;

/*for(idx in clients){
    console.log(idx, clients[idx]);
    fb.storeClient(clients[idx]);
}*/

var remoteClients;
fb.retrieveAllClients().then(function(res){
    var extraInfo = {
        registerDate: (new Date()).getTime(),
        clientActive: true,
        owner: 'jsanta'
    };

    var result = res.val();
    remoteClients = _.map(result, function(v, k){
        var data = _.assign(v, { internalId: k });
        data = _.assign(data, extraInfo);
        fb.updateClient(k, data);
        return data;
    });

    console.log('remoteClients', remoteClients);

})



