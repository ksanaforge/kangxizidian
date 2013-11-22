define(['jquery','backbone','../node_server/cli-js/rpc_yase'],
function($,Backbone,yase){
  var view=null;
  var m=new Backbone.Model();
  var DB="kangxizidian";
  var getdef=function(wh) {
      var that=this;
      var opts={db:DB,tag:"wh",tofind:wh,grouped:true};
      yase.phraseSearch(opts,function(err,res){
        var first=parseInt(Object.keys(res[0])[0],10);
        if (isNaN(first)) {
          alert("查無此字"+wh)
          return null;
        }
        yase.closestTag( {db:DB, tag:["wh","pb[id]"], slot:first} 
          ,function(err,data){
            opts.ntag=data[0][0].ntag;
            opts.sourceinfo=true;
            
            yase.getTextByTag(opts, function(err,data2) {
                $("#defination").html(data2.text);
                $("#pagenumber").html(data[0][1].value)
            });

        });
      });
      
  };


  var AppRouter = Backbone.Router.extend({
    routes: {
      // Default
      '*actions': 'defaultAction'
    },
    defaultAction: function(actions){ // any string after # in url
    	var text=getdef(actions);
    	$("#wordhead").html(actions);    	
    }
  });


  var initialize = function(){
	var app_router = new AppRouter();
	Backbone.history.start();
  };
   return {
    initialize: initialize
  };
});
  


