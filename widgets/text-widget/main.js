define(['underscore','text!./text.tmpl'], function(_,template) {
  return {
    dbname : 'kangxizidian',
    type: 'Backbone',
    events: {
    },
    
    resize:function() {
      var that=this;
      this.$el.css("height", (window.innerHeight - this.$el.offset().top -18) +"px");
      this.$el.unbind('scroll');
      this.$el.bind("scroll", function() {
        if (that.$el.scrollTop()+ that.$el.innerHeight()+3> that.$el[0].scrollHeight) {
          that.loadscreenful();
        }
      });

    },    
    showdef:function(wh) {
      this.resize();
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
      $(window).resize( _.bind(this.resize,this) );
      this.sandbox.on('wh.change',this.showdef,this);
      height
    }
  };
});
