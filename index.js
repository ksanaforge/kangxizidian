define(['underscore','backbone','aura'], function(_,Backbone,Aura) {
 console.log('loading index.js')
  var app=Aura({debug: { enable: false}});
  app.registerWidgetsSource('aura', '../node_webkit/auraext');

    app.use('../node_webkit/auraext/aura-backbone')
    .use('../node_webkit/auraext/aura-yadb')
    .use('../node_webkit/auraext/aura-yase')
    .use('../node_webkit/auraext/aura-module')    
    .start({ widgets: 'body' }).then(function() {
    	console.log('Aura Started')
    })

});