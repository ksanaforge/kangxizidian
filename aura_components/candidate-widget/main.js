define(['underscore','backbone','text!./candidate.tmpl','text!./item.tmpl'], 
  function(_,Backbone,template,itemtemplate) {
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
          that.loadscreenful();
        }
      });

    },
    loadscreenful:function() {
     var candidates=this.model.get("candidates");
     if (!candidates) return null;
      var screenheight=this.$el.innerHeight();
      var $candidates=this.$el.find(".candidates");
      var startheight=$candidates.height();
      if (this.displayed>=candidates.length) return;
      var now=this.displayed||0;
      var H=0,outputheight=0;
      for (var i=now;i<candidates.length;i++ ) {
        var newitem=_.template(itemtemplate,{name:candidates[i]});
        //protect kxr in tag

        $candidates.append(newitem); // this is slow  to get newitem height()
        if (i-now>100) break;
      }
      this.displayed=i+1;
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
      this.displayed=0;
      this.loadscreenful();
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

      this.$el.resize( _.bind(this.resize,this) );
    }
  };
});
