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
                
                // Carga el listado de clientes desde el arreglo de datos simulados
                dCtrl.clientList = dummyData.clients;
                
                // Laa variable visibleClientsList hace una copia de 10 elementos segun la pagina 
                // que se esté visitando
                dCtrl.visibleClientsList = dCtrl.clientList.slice(0,10);
                
                // Se calcula el total de páginas
                // IMPORTANTE: Se debe tomar el valor entero de la división
                dCtrl.totalPages = 1+Math.floor(dCtrl.clientList.length/10);                                
                
            }; 
    
        
        /**
         * Despliega el formulario de edición de datos de cliente
         * @param JSON client Datos del cliente que se está editando
         * @param int idx    Índice del registro asociado al cliente
         */
        dCtrl.editClient = function(client, idx){            
            // Si no se realiza una copia la edicion se  efectua directamente
            // indepemndiente se presione o no se presione el botón de confirmación
            dCtrl.editData = angular.copy(client);            
            
            // Muestra el formulario para actualización del cliente seleccionado
            // deshabilitado para la edición
            dCtrl.showEdit = true;
            dCtrl.editEnabled = false; 
            
            // Guarda del índice asociado al registro del cliente seleccionado
            // Este índice es propio de la vista y coincidirá con el ínidice real del registro en 
            // el arreglo de clientes solamente cuando NO haya paginación.
            dCtrl.activeRecord = idx;
        }
        
        /**
         * Habilita el formulario para que  se puedan actualizar los campos
         */
        dCtrl.enableEdit = function(){            
            dCtrl.editEnabled  = true;
        }
        
        /**
         * Actualiza el registro activo con los datos modificados del formulario
         * @param JSON updatedClient Objeto con los datos actualizados del cliente 
         */
        dCtrl.updateClientInfo = function(updatedClient){
            // En rigor no se está utilizando el parámetro updatedClient
            
            // Se deshabilita la edición en el formulario
            dCtrl.editEnabled = false;            
            
            // En caso de haber paginacion se calcula el índice del registro a editar
            // en el arreglo original
            var idx = dCtrl.activeRecord;
            if(!!dCtrl.showPaged){
                idx = (dCtrl.currentPage-1)*10+idx;
            }
            // Se asigna el valor actualizado
            dCtrl.clientList[idx] = updatedClient;
            
            // Si hay paginación, se refresca la página actual
            if(!!dCtrl.showPaged){
                dCtrl.gotoPage(dCtrl.currentPage);
            }            
            
            // Se despliega la alerta de confirmacion
            alert('Registro actualizado');
            
        }        
        
        /**
         * Limpia los campos editables del formulario
         * @param event      event Se debe pasar $event como parametro de modo de poder 
         *                         interceptar el funcionamiento por defecto del botoón 
         *                         de tipo reset
         */
        dCtrl.cleanForm = function(event){
            // Intercepta el evento por defecto
            event.preventDefault();
            
            // Copia valores nulos en los campos editables
            angular.extend(dCtrl.editData, { address1: null,
                                             address2: null,
                                             rut: null,
                                             phone: null });            
            
            //return false;            
        }
        
        /**
         * Borra el registro cuyo índice se pasa como parámetro
         * @param int idx Índice del registro a borrar
         */
        dCtrl.deleteClient = function(client, idx){            
            // En caso de haber paginación recalcula el índice
            if(!!dCtrl.showPaged){
                idx = (dCtrl.currentPage-1)*10+idx;
            }
            
            if(confirm('¿Esta seguro de querer eliminar el cliente ' + dCtrl.clientList[idx].name + ' ' + dCtrl.clientList[idx].lastname + '?')){
                // Elimina el registro de la lista original
                // IMPORTANTE: El método splice es destructivo, es decir afecta 
                // el arreglo original
                dCtrl.clientList.splice(idx, 1);
                
                dCtrl.totalPages = 1+Math.floor(dCtrl.clientList.length/10);

                // Si hay paginación, se refresca la página actual
                if(!!dCtrl.showPaged || dCtrl.currentPage === 1){
                    dCtrl.gotoPage(dCtrl.currentPage);
                }    
            } 
            
            // Deshabilita la vista de edición
            dCtrl.showEdit = false;
            
        }
        
        // Funciones de control de paginacion
        dCtrl.currentPage = 1;
    
        // No es necesario realizar la validación de si existe o no
        // página siguiente o anterior, ya que los métodos están restringidos 
        // por la visualización de los botones Siguiente y Anterior, que ya incorporan 
        // dicha validación
    
        /**
         * Se desplaza a la página anterior
         */
        dCtrl.prevPage = function(){
            dCtrl.gotoPage(dCtrl.currentPage-1);
        }
        
        /**
         * Se desplaza a la página siguiente
         */
        dCtrl.nextPage = function(){
            dCtrl.gotoPage(dCtrl.currentPage+1);
        }
        
        /**
         * Despliega los registros correspondientes a la página indicada
         * como parámetro
         * @param int page  Página de destino
         * @param event event opcional) Evento para interceptar la accion por defecto
         */
        dCtrl.gotoPage = function(page, event){
            if(!!event) event.preventDefault();            
            dCtrl.currentPage = page;
            
            // Saca un segmento de 10 registros desde el arreglo original
            // IMPORTANTE: El método slice es un método no destructivo
            dCtrl.visibleClientsList = dCtrl.clientList.slice((page-1)*10,(page-1)*10+10);
            
            // Se actualiza variable para que no despliegue el formulario de edición
            dCtrl.showEdit = false;
            //return false;
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
        
        /**
         * Verfica si lapagina actual es o no es la 1era página
         * @returns boolean true si la página actual es la 1era página
         */
        dCtrl.isFirstPage = function(){            
            return dCtrl.currentPage === 1 && dCtrl.currentPage >= 1;
        }
        
        /**
         * Verifica si la página actual es o no la última página
         * @returns boolean true si la página actual es la última página
         */
        dCtrl.isLastPage = function(){            
            return dCtrl.currentPage === dCtrl.totalPages && dCtrl.currentPage <= dCtrl.totalPages;
        }        

        // Inicializa las variables para el despliegue de la pantalla
        init();
    });
