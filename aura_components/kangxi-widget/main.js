define(['underscore'], 
  function(_) {
  return {
    //dbname : 'kangxizidian',
    type: 'Backbone',

    getdef:function(wh,target,tofind) {
      if (!this.db) return;
      var that=this;
      var yase=this.sandbox.yase;
      var opts={db:this.db,tag:"wh",tofind:wh,grouped:true};
      yase.phraseSearch(opts,function(err,res){
        var first=parseInt(Object.keys(res[0])[0],10);
        if (isNaN(first)) {          
          return null;
        }
        yase.closestTag( {db:that.db, tag:["wh","pb"], slot:first} 
          ,function(err,data){
            opts.ntag=data[0][0].ntag;
            opts.tofind=tofind;
            opts.sourceinfo=true;
            //TODO pass in tofind and  highlight
            yase.getTextByTag(opts, function(err,data2) {
                that.sandbox.emit('getdef.'+target,wh,data2,data);
            });

        });
      });
      
    },

    initialize: function() {
      this.db=this.db=this.sandbox.dbname;
      //TODO repeat initializing 
      this.sandbox.on('getdef',this.getdef,this);
    }
  };
});
