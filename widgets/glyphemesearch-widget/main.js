/*
non visual widget for filtering slot by tofind
*/
define(['backbone','glyphemesearch'], function(Backbone,glyphemesearch) {
  return {
    search:function(m,tofind) {
    	var that=this,map={};
      if (!this.db) return;
      if (isNaN(parseInt(tofind))) {
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
        var res=glyphemesearch.withstroke(parseInt(tofind));
        this.sandbox.emit("characterlist.change",res);
      }
    },

    model:new Backbone.Model(),
    initialize: function() {;
      if (!this.sandbox.minversion('yase','0.0.13')) console.error('yase version too old');
      if (!this.sandbox.minversion('yadb','0.0.9')) console.error('yadb version too old');
      var that=this;
      this.db=this.sandbox.dbname;

      this.sandbox.on("tofind.change",function(data) {
      	that.model.set({tofind:data})
      });

     this.model.on("change:tofind",this.search,this);
   }
 };
});
