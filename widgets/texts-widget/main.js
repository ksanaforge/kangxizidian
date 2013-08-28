define(['underscore','text!./texts.tmpl'], function(_,template) {
  return {
    type: 'Backbone',
    events: {
      "click #btnclearall":"clearall",
      "click #btncopy":"copy",
    },
    copy:function(e) {
      var gui = require('nw.gui');

      // We can not create a clipboard, we have to receive the system clipboard
      var clipboard = gui.Clipboard.get();
      // Or write something
      var sel=window.rangy.getSelection().getRangeAt(0).toString();
      clipboard.set(sel, 'text');
      var oldlabel=$("#btncopy").html();
      $("#btncopy").html('Copies!!');
      setTimeout( function() {
        $("#btncopy").html(oldlabel)
      },2000);

    },
    clearall:function() {
      $('.texts').children().fadeOut(500).promise().then(function() {
          $('.texts').empty();
      });
    },
    resize:function() {
      var that=this;
      this.$el.css("height", (window.innerHeight - this.$el.offset().top -18) +"px");
      /*
      this.$el.unbind('scroll');
      this.$el.bind("scroll", function() {
        if (that.$el.scrollTop()+ that.$el.innerHeight()+3> that.$el[0].scrollHeight) {
          // scroll to bottom
        }
      });
      */

    },    
    showdef:function(wh,tofind) {
      var exists=$('div[data-wh="'+wh+'"]');
      if (exists.length) {
        this.$el.animate({scrollTop: exists.offset().top })
      } else {
        var textdom=$('<div><div data-aura-widget="text-widget" data-wh="'+wh+'" data-tofind="'+tofind+'"></div></div>');
        var dom=this.$el.find(".texts").prepend(textdom);
        this.sandbox.start(textdom);
        //this.sandbox.widgets.start('text-widget',textdom);
        this.$el.animate({scrollTop: 0 })
      }
    },
    render:function() {
      this.html(_.template(template,{}));
    },

    initialize: function() {
      $(window).resize( _.bind(this.resize,this) );
      this.resize();
      this.render();
      this.sandbox.on('wh.change',this.showdef,this);
      //this.sandbox.on('tofind.change',this.showdef,this);
    }
  };
});
