'use strict';

requirejs.config({
  baseUrl: '/js/lib',
  paths: {
    app: '../app',
    rx: 'https://cdnjs.cloudflare.com/ajax/libs/rxjs/4.0.7/rx.lite.min',
    lodash: 'https://cdnjs.cloudflare.com/ajax/libs/lodash.js/3.10.1/lodash.min',
    jquery: 'https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.4/jquery.min'
    //uri: 'https://cdnjs.cloudflare.com/ajax/libs/URI.js/1.17.0/URI.min'
  }
});

requirejs(['app/main']);