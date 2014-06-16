define(['underscore','text!./variants.json'], 
  function(_,vars) {
  return {
    //dbname : 'kangxizidian',
    variants:JSON.parse(vars),
    type: 'Backbone',
    getdefTag:function(db,first,wh,target) {
        var yase=this.sandbox.yase;
        var that=this;
        var opts={db:db,grouped:true,tag:"wh"};
        yase.closestTag( {db:db, tag:["wh","pb"], slot:first} 
          ,function(err,data){
            opts.ntag=data[0][0].ntag;
            opts.tofind=tofind;
            opts.sourceinfo=true;
            //TODO pass in tofind and  highlight
            yase.getTextByTag(opts, function(err,data2) {
                that.sandbox.emit('getdef.'+target,wh,data2,data);
            });
        });
    },
    getdef:function(wh,target,tofind,noretry) {
      if (!this.db) return;
      var that=this;
      var yase=this.sandbox.yase;
      var opts={db:this.db,tag:"wh",tofind:wh,grouped:true};
      yase.phraseSearch(opts,function(err,res){
        var first=parseInt(Object.keys(res[0])[0],10);
        if (isNaN(first)) { 
          
          var unicode=that.sandbox.cjkutil.getutf32ch(wh).toString(16).toUpperCase();
          var variant=that.variants[unicode];
          if (variant) variant=that.sandbox.cjkutil.ucs2string( parseInt(variant,16) );
          if (!noretry && variant)       that.getdef(variant,target,tofind,true);
          return;
        }
        that.getdefTag(that.db,first,wh,target);
      });
    },

    initialize: function() {
      this.db=this.db=this.sandbox.dbname;
      //TODO repeat initializing 
      this.sandbox.on('getdef',this.getdef,this);
    }
  };
});
