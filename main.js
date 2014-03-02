require.config({
//    baseUrl:'../src/',
    urlArgs: 'cb=' + Math.random(),
    paths: {
        jquery: 'lib/jquery/jquery-1.10.2',
        underscore: 'lib/underscore/underscore',
        backbone: 'lib/backbone/backbone',
        text: 'lib/require/text',
        jsx: 'lib/require/react-plugin',
        react: 'lib/react-0.8.0/build/react',
        JSXTransformer: 'lib/react-0.8.0/build/JSXTransformer'
    },
    shim: {
        underscore: {
            exports: '_'
        },
        backbone: {
            deps: ["underscore", "jquery"],
            exports: "Backbone"
        }
    }
});

require([
    'jquery',
    'react',
    'underscore',
    //'js/views/padlock'
    'jsx!js/components/padlock'
], function($, React, _, Padlock) {

//    var padlock = new Padlock();
//    $('body').html(padlock.render().el).show();

});
