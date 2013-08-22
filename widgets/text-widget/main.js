define(['underscore','text!./text.tmpl'], function(_,template) {
  return {
    dbname : 'kangxizidian',
    type: 'Backbone',
    events: { 
      'click .destroy':'closeme'
    },
    closeme:function() {
      this.$el.hide('slow', function(){ this.$el.remove(); });
    },
    showdef:function(wh) {
      var that=this;
      var yase=this.sandbox.yase;
      var opts={db:this.dbname,tag:"wh",tofind:wh,grouped:true};
      yase.phraseSearch(opts,function(err,res){
        var first=parseInt(Object.keys(res)[0]);
        yase.closestTag( {db:that.dbname, tag:"wh", slot:first} 
          ,function(err,data){
            opts.ntag=data[0].ntag;
            yase.getTextByTag(opts, function(err,data) {
                that.html(_.template(template,data));
            });
        });
      });
      
    },

    initialize: function() {
      this.showdef(this.options.wh);      
    }
  };
});
