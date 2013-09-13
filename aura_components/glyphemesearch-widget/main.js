/*
non visual widget for filtering slot by tofind
*/
define(['backbone'], function(Backbone) {
  return {
    search:function(m,tofind) {
    	var that=this,map={};
      if (!this.db) return;
      if (isNaN(parseInt(tofind,10))) {
        var paths=[], expanded=[];

        for (var i in tofind) {
          paths.push( (this.db+'/extra/decompose/'+tofind[i]).split('/'));
          //load variants of the parts
          var v=this.sandbox.radicalvariants[tofind[i]];
          for (var j in v) {
              paths.push( (this.db+'/extra/decompose/'+v[j]).split('/'));
              expanded.push(v[j])
          }
          expanded.push(tofind[i]);
        }
      	this.sandbox.yadb.getRaw(paths,function(err,data) {
          for (var i=0;i<expanded.length;i++) {
            map[expanded[i]]=data[i];
          }
          var res=that.sandbox.glyphemesearch(map,tofind);
          that.sandbox.emit("characterlist.change",res);
      	});
      } else {
        var res=this.sandbox.glyphemesearch.withstroke(parseInt(tofind,10));
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
