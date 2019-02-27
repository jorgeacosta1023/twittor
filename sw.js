//imports

importScripts('js/sw-utils.js');


const STATIC_CACHE = 'static-v2';
const DYNAMIC_CACHE = 'dinamic-v1';
const INMUTABLE_CACHE = 'inmutable-v1';

// CORAZON DE LA APLICACIÓN
const APP_SHELL = [
    // '/',
    'index.html',
    'css/style.css',
    'img/favicon.ico',
    'img/avatars/spiderman.jpg',
    'img/avatars/ironman.jpg',
    'img/avatars/wolverine.jpg',
    'img/avatars/thor.jpg',
    'img/avatars/hulk.jpg',
    'js/app.js',
    'js/sw-utils.js'
];

// Lo que no se va a modificar jamas 

const APP_SHELL_INMUTABLE = [
    'css/animate.css',
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
    'js/libs/jquery.js'
];


self.addEventListener('install', e=>{

    const cacheStatico= caches.open(STATIC_CACHE).then(cache => 
        cache.addAll(APP_SHELL));

    const cacheInmutable= caches.open(INMUTABLE_CACHE).then(cache => 
        cache.addAll(APP_SHELL_INMUTABLE));

   e.waitUntil(Promise.all([cacheStatico,cacheInmutable])); 

});

self.addEventListener('activate',e=>{

    const respuesta = caches.keys().then( keys => {

        keys.forEach( key =>{

            if ( key !== STATIC_CACHE && key.includes('static')) {
                return caches.delete(key);
                
            }

        });

    });

    e.waitUntil(respuesta);
});

self.addEventListener('fetch', e=>{

    const respuesta  = caches.match(e.request).then( res =>{

        if (res) {
            return res;
            
        }else{

            return fetch (e.request).then (newRes=>{

                return actualizaCacheDinamico(DYNAMIC_CACHE, e.request, newRes);

            });
            
        }




    });


    e.respondWith(respuesta);
});