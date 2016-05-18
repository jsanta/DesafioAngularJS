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
                dCtrl.editData   = {};
                dCtrl.clientList = dummyData.clients;
                
                // Laa variable visibleClientsList hace una copia de 10 elementos segun la pagina 
                // que se esté visitando
                dCtrl.visibleClientsList = dCtrl.clientList.slice(0,10);
                
                dCtrl.totalPages = 1+Math.floor(dCtrl.clientList.length/10);                                
                console.log(dCtrl.totalPages)
            }; 
    
        
    
        dCtrl.editClient = function(client){
            console.log('editClient');
            dCtrl.editData = client;
        }
        
        dCtrl.updateClientInfo = function(updatedClient){
            
        }
        
        // Funciones de control de paginacion
        dCtrl.currentPage = 1;
        dCtrl.prevPage = function(){
            dCtrl.gotoPage(dCtrl.currentPage-1);
        }
        dCtrl.nextPage = function(){
            dCtrl.gotoPage(dCtrl.currentPage+1);
        }
        dCtrl.gotoPage = function(page){
            console.log('dCtrl.gotoPage', page)
            dCtrl.currentPage = page;
            dCtrl.visibleClientsList = dCtrl.clientList.slice((page-1)*10,(page-1)*10+10);
            console.log(dCtrl.visibleClientsList)
            return false;
        }
        
        /**
         * Verifica si la página entregada como parámetro corresponde a la 
         * página actual
         * @param   int        page página actual a validar 
         * @returns boolean    true si la página entregada como parámetro corrsponde 
         *                          a la página actual
         */
        dCtrl.isCurrentPage = function(page){
            return page === dCtrl.currentPage;
        }
        dCtrl.isFirstPage = function(){
            console.log('isFirstPage', dCtrl.currentPage)
            return dCtrl.currentPage === 1 && dCtrl.currentPage >= 1;
        }
        
        /**
         * Verifica si la página actual es o no la última página
         * @returns boolean true si la página actual es la última página
         */
        dCtrl.isLastPage = function(){
            console.log('isLastPage', dCtrl.currentPage)
            return dCtrl.currentPage === dCtrl.totalPages && dCtrl.currentPage <= dCtrl.totalPages;
        }
        

        // Inicializa las variables para el despliegue de datos en el formulario
        init();
    });
