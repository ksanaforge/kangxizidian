define(['underscore','text!./text.tmpl'], function(_,template) {
  return {
    //dbname : 'kangxizidian',
    type: 'Backbone',
    events: {
      'click .destroy':'closeme',
    },
    closeme:function() {
      var $el=this.$el;
      $el.hide('slow', function(){ $el.remove(); });
    },

    showdef:function(wh) {
      if (!this.db) return;
      var that=this;
      var yase=this.sandbox.yase;
      var opts={db:this.db,tag:"wh",tofind:wh,grouped:true};
      yase.phraseSearch(opts,function(err,res){
        var first=parseInt(Object.keys(res)[0]);
        yase.closestTag( {db:that.db, tag:"wh", slot:first} 
          ,function(err,data){
            opts.ntag=data[0].ntag;
            //TODO pass in tofind and  highlight
            yase.getTextByTag(opts, function(err,data) {
                var html=_.template(template,data);
                html=html.replace(/(&.*?;)/g,'<img src="missingcharacter.png" title="$1"/>');
                that.html(html);
                that.sandbox.loadimages.apply(that,[that.$el]);
            });
        });
      });
      
    },

    initialize: function() {
      this.db=this.sandbox.dbname;
      this.showdef.call(this,this.options.wh);    
      this.sandbox.on("tofind.change",function(data) {
        this.tofind=data
      },this)
    }
  };
});
