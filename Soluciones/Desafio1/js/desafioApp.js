/*jslint browser: true*/
/*global angular, console, alert*/
// El código de esta aplicación fue pasado por un validador de estilo JSLint

angular.module('desafioApp', [])
    .controller('desafioController', function () {
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

            };

        /**
        * Realiza una copia de los datos ingresados en el formulario, para poder desplegarlos
        * en el formulario de confirmación.
        */
        dCtrl.sendData = function () {
            dCtrl.confirmData = angular.copy(dCtrl.inputData);
            
            // Cambia el valor de la variable para despliegue del botón de confirmación
            dCtrl.showConfirm = true;
        };
    
        /**
        * Realiza la limpieza de los datos a desplegar en los formularios de la vista.
        */
        dCtrl.cleanData = function () {
            // Llama a la función init
            init();
            
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
        };

        // Inicializa las variables para el despliegue de datos en el formulario
        init();
    });
