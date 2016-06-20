/*global angular, console */
angular.module('desafioApp', ['ngResource'])
	.service('clientService', function ($resource) {
		'use strict';

		var clientService = this,
			//baseUrl   = 'http://desafioangularjs-jsantacl.rhcloud.com',
			baseUrl   = 'http://localhost:8666',
			ownerInfo = '?owner=jsanta',
			Client    = $resource(baseUrl + '/clients/:internalId' + ownerInfo, { internalId: '@internalId' }, {
				update: {
					method: 'PUT'
				}
			});

		clientService.retrieveClients = function () {
			return Client.query();
		};

		/**
		 * Creates a new client
		 * @param Client clientInfo JSON object with new client data
		 * @param function callback   Callback function to be executed on successful
		 */
		clientService.createClient = function (clientInfo, callback, finallyCallback) {
			callback        = (!callback) ? function (res) { console.log('createClient', res); } : callback;
			finallyCallback = (!finallyCallback) ? function () { console.log("Finished update") } : finallyCallback;

			var client = new Client(clientInfo);
			client.$save()
				.then(callback)
				.catch(function (req) { console.error("ERROR saving client", req); })
				.finally(finallyCallback);
		};

		/**
		 * Actualiza un cliente presentado en el listado de clientes.
		 * Notar que no es necesario  realizar una instancia del $resource, ya que
		 * los objetos de arreglo ya son un $resource, por ende tiene los métodos
		 * requeridos.
		 * @param Client client Cliente a actualizar
		 * @param function callback Funcion a ejecutar cuando termine la operacion
		 */
		clientService.updateClient = function (client, callback, finallyCallback) {
			callback        = (!callback) ? function (res) { console.log('updateClient', res); } : callback;
			finallyCallback = (!finallyCallback) ? function () { console.log("Finished update") } : finallyCallback;

			client.$update()
				.then(callback)
				.catch(function (req) { console.error("ERROR updating client", req); })
				.finally(finallyCallback);

		};

		clientService.deleteClient = function (client, callback, finallyCallback) {
			callback        = (!callback) ? function (res) { console.log('updateClient', res); } : callback;
			finallyCallback = (!finallyCallback) ? function () { console.log("Finished update") } : finallyCallback;

			client.$delete()
				.then(callback)
				.catch(function (req) { console.error("ERROR deleting client", req); })
				.finally(finallyCallback);

		};

		return clientService;
		/*return {
			retrieveClients: clientService.retrieveClients,
			createClient: clientService.createClient,
			updateClient: clientService.updateClient
		};*/
	});
