/*
non visual widget for filtering slot by tofind
*/
define(['backbone','glyphemesearch'], function(Backbone,glyphemesearch) {
  return {
    search:function(m,tofind) {
    	var that=this,map={};
      if (!this.db) return;
      if (isNaN(parseInt(tofind,10))) {
        var paths=[];
        for (var i in tofind) {
          paths.push( (this.db+'/extra/decompose/'+tofind[i]).split('/'));
        }
      	this.sandbox.yadb.getRaw(paths,function(err,data) {
          for (var i=0;i<tofind.length;i++) {
            map[tofind[i]]=data[i];
          }
          var res=glyphemesearch(map,tofind);
          that.sandbox.emit("characterlist.change",res);
      	});
      } else {
        var res=glyphemesearch.withstroke(parseInt(tofind,10));
        this.sandbox.emit("characterlist.change",res);
      }
    },

    model:new Backbone.Model(),
    initialize: function() {;
      var that=this;
      setTimeout(function(){ //this is not good, but server mode response is slower than client code initialization
        if (!that.sandbox.minversion('yase','0.0.13')) console.error('yase version too old');
        if (!that.sandbox.minversion('yadb','0.0.9')) console.error('yadb version too old');
      },5000)

      this.db=this.sandbox.dbname;

      this.sandbox.on("tofind.change",function(data) {
      	that.model.set({tofind:data})
      });

     this.model.on("change:tofind",this.search,this);
   }
 };
});
