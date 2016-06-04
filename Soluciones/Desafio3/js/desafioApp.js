/*jslint browser: true, nomen: true */
/*global angular, console, alert, comunas, _*/
// El código de esta aplicación fue pasado por un validador de estilo JSLint

angular.module('desafioApp', ['ngMessages'])
    .controller('desafioController', function ($scope) {
        // 'use strict'; se utiliza para mejorar el rendimiento de ciertas funciones
        // habitualmente cuando es necesario hacer comparaciones y se sabe exactamente
        // el tipo de datos de las variables (uso de comparaciones estrictas).
        'use strict';

        // Por un tema de claridad (y buenas prácticas) se asigna el valor this a una variable
        // con el mismo nombre que el utilizado en la asignación de controllerAs
        // Al hacer esto se evita inyectar el $scope para todo aquello que es exclusivo de la vista,
        // y que no requiere explícitamente del $scope (a veces es necesario).
        var dCtrl = this,
            /**
            * Inicializa los objetos utilizados para el despliegue de datos en la vista
            */
            init = function () {
                dCtrl.inputData = {};
                dCtrl.confirmData = {};

                // Toma el arreglo de comunas y utiliza lodash para agruparlas
                // utilizando la region como llave
                dCtrl.comunas  = _.groupBy(comunas, 'region');

                // Crea el listado de regiones a partir delas llaves del objeto comunas agrupado
                dCtrl.regiones = _.keys(dCtrl.comunas);

                console.log('Comunas', dCtrl.comunas);
                console.log('Regiones', dCtrl.regiones);

                // Nos aseguramos que al inicializar el controlador no se despliegue el botón confirmar
                dCtrl.showConfirm = false;

                // La variable forceClean deshabilita el boton Ingresar de modo que
                // el usuario no pueda enviar nuevamente los datos, a menos que limpie
                // el formulario y los ingrese nuevamente
                dCtrl.forceClean  = false;

                // El formulario se inicializa como válido
                dCtrl.formValid = true;
            };

        // Expresion regular para validacion estricta de forma para correos electronicos
        dCtrl.emailRegExp = /^(("[\w\-\s]+")|([\w\-]+(?:\.[\w\-]+)*)|("[\w-\s]+")([\w\-]+(?:\.[\w\-]+)*))(@((?:[\w\-]+\.)*\w[\w\-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/;

        /**
        * Realiza una copia de los datos ingresados en el formulario, para poder desplegarlos
        * en el formulario de confirmación.
        */
        dCtrl.sendData = function (formValid) {
            // Realiza la copia unicamente si el formulario es valido
            if (formValid) {
                dCtrl.confirmData = angular.copy(dCtrl.inputData);

                // Cambia el valor de la variable para despliegue del botón de confirmación
                dCtrl.showConfirm = true;
            }
            dCtrl.formValid = formValid;

        };

        /**
        * Realiza la limpieza de los datos a desplegar en los formularios de la vista.
        */
        dCtrl.cleanData = function (form) {
            // Llama a la función init
            init();

            // Reestablece el estado inical del formulario
            form.$setPristine();
            form.$setUntouched();

            // retorna true para que el flujo del evento continúe normalmente (está asociado
            // a un botón de tipo reset)
            return true;
        };

        /**
        * Despliga el mensaje de alerta
        */
        dCtrl.showConfirmation = function () {
            alert('Información guardada');

            // Cambia el valor de la variable para ocultar el botón de confirmación
            dCtrl.showConfirm = false;
            dCtrl.forceClean  = true;
        };

        // Inicializa las variables para el despliegue de datos en el formulario
        init();
    });
