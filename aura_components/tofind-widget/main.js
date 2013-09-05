define(['underscore','text!./tofind.tmpl'], function(_,template) {
  return {
    type: 'Backbone',
    events: {
    	"keyup #tofind":"dosearch",
    },
    dosearch:function() {
        if (this.timer) clearTimeout(this.timer);
        var that=this;
        this.timer=setTimeout(function(){
          var tofind=that.$("#tofind").val();
          that.sandbox.emit('tofind.change',tofind);
          if  (tofind) {
            localStorage.setItem("tofind",tofind);
          }
        },300);
    },

    initialize: function() {
     	this.html(_.template(template,{ value:this.options.value||""}) );
      $("#tofind").focus();
      $("#tofind").val(localStorage.getItem("tofind"));
      this.dosearch();
    }
  };
});
