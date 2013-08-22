define(['underscore','backbone','text!./candidate.tmpl'], function(_,Backbone,template) {
  return {
    type: 'Backbone',
    events: {
      "click .candidate":"whclick"
    },
    resize:function() {
      var that=this;
      this.$el.css("height", (window.innerHeight - this.$el.offset().top -18) +"px");
      this.$el.unbind('scroll');
      this.$el.bind("scroll", function() {
        if (that.$el.scrollTop()+ that.$el.innerHeight()+3> that.$el[0].scrollHeight) {
          //that.loadscreenful();
        }
      });

    },     
    whclick:function(e) {
      var btn=$(e.target);
      this.sandbox.emit("wh.change",btn.text());
    },
    render:function() {
      this.resize();
      var tofind=this.model.get("tofind");
      var candidates=this.model.get("candidates");
      this.html(_.template(template,{ candidates:candidates, tofind:tofind}) );
    },
    model: new Backbone.Model(),
  
    initialize: function() {
      var that=this;
      this.sandbox.on('characterlist.change',function(data){
        that.model.set({"candidates":data});
      });
      this.sandbox.on('tofind.change',function(data){
        that.model.set({"tofind":data});
      }); 
      this.model.on("change:candidates",this.render,this);

      $(window).resize( _.bind(this.resize,this) );
    }
  };
});
