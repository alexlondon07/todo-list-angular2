import { Injectable } from '@angular/core';

@Injectable()
export class ServicioIndexedBD {

    /*Nombre de la BD*/
    static DATABASE_NAME = 'bd_indexedBD';
    /*Versión de la Base da datos*/
    static DATABASE_VERSION = 2;
    /*Nombre del Store o Tabla de items*/
    static ITEMS_TABLE = 'todo';
    /*Objeto de IndexedDB*/
    db;
    items = [];

    constructor() {
        this.inicializarIndexedDB();
    }

    inicializarIndexedDB() {
        /*Obtenemos una referencia del servicio*/
        let self = this;
        /*Verificamos si el Browser en el que se ejecuta la aplicacion soporta IndexedDB*/
        if (!window.indexedDB) {
            /*En caso de que no soporte lo notificamos con alert al usuario*/
            window.alert('Su navegador no soporta una versión estable de indexedDB.');
            return;
        } else {
            /*En caso de que el Browser si soporte IndexedBD creamos/instaciamos nuestra BD
            con el método open pasandole el nombre y la versión de la misma*/
            let request = window.indexedDB.open(ServicioIndexedBD.DATABASE_NAME, ServicioIndexedBD.DATABASE_VERSION);

            /*Definimos un callback del evento onupgradeneeded para saber cuando esta lista
            la BD para craer el o los Store necesarios*/
            request.onupgradeneeded = function (event) {
                self.db = request.result;
                if (self.db != null) {
                    /*Llamamos al método para crear el o los Stores*/
                    self.crearItemsStore();
                }
            };

            /*Definimos un callback del evento onerror para saber si ha ocurrido algun error y 
            notificarlo al usario con un alert*/
            request.onerror = function (event) {
                window.alert('onError' + request.error);
            };

            /*Definimos un callback del evento onsuccess para saber que hemos instanciado la BD correctamentE*/
            request.onsuccess = function (event) {
                self.db = request.result;
                /*Llamamos la método para leer todos los items que tenemos almacenados*/
                self.cargarTodosItems();
            };
        }
    }

    crearItemsStore() {
        /*Creamos el Items Store, el cual funciona como una tabla para almacenar los datos */
        let objectStore = this.db.createObjectStore(ServicioIndexedBD.ITEMS_TABLE, { autoIncrement: true });

        /*Definimos un campo o indice para guardar el item*/
        objectStore.createIndex('newTodo', 'newTodo', { unique: true });

        /*Implementamos un callback para el evento oncomplete con la finalidad de saber cuando 
        se ha logrado crear el Store */
        objectStore.transaction.oncomplete = function (event) {
            console.log('El store ya ha esta creado y listo para ser usado');
        }
    }

    cargarTodosItems() {
        let self = this;
        /*Obtenemos una referencia del Store items mediante una transaction al Store items de tipo readonly
        ya que lo que buscamos es solo leer el contenido del mismo*/

        let itemObjectStore = self.db.transaction(ServicioIndexedBD.ITEMS_TABLE, 'readonly').objectStore(ServicioIndexedBD.ITEMS_TABLE);
        /*Con la referencia del Store item abrimos un cursor para iterar sobre cada uno de los obejto Product 
        que contiene el Store y lo agreamos a nuetro array de items*/
        itemObjectStore.openCursor().onsuccess = function (event) {
            let cursor = event.target.result;
            if (cursor) {
                self.items.push(cursor.value);
                cursor.continue();
            } else {
                console.log('Ya hemos culminado de iterar sobre todos los Items guardado');
            }
        };
    }

    agregarItemDB(newTodo: any) {
        let self = this;
        /*Almacenamos los valores de la nueva tarea en el Items Store
        mediante un objeto transaction al Store items de tipo readwrite*/
        let itemObjectStore = this.db.transaction(ServicioIndexedBD.ITEMS_TABLE, 'readwrite').objectStore(ServicioIndexedBD.ITEMS_TABLE);

        /*Con el objeto del Items Store creamos una peticion de tipo inserción de datos usando el método add del objectStore*/
        let req = itemObjectStore.add(newTodo);

        /*Implementamos un callback para el evento onsuccess para saber cuando hemos agregado con éxito el nuevo objeto Product*/
        req.onsuccess = function (event) {
            console.log('Se ha agregado con éxito');
        };

        /*Implementamos un callback para el evento onerror para saber si ha ocurrido algun error durante la inserción del objeto
        y en caso tal lo notificamos al usuario con un alert*/
        req.onerror = function (event) {
            window.alert('agregarItemDB onError' + req.error);
        };
    }

    eliminarItemDB(item: any) {
        item += 1;
        this.db.transaction(ServicioIndexedBD.ITEMS_TABLE, 'readwrite').objectStore(ServicioIndexedBD.ITEMS_TABLE).delete(+item);
    }


    editarItemDB(item: any) {

    }
}