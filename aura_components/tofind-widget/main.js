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
      //var tofind=localStorage.getItem("tofind");

      if (location.hash) {
        tofind=location.hash.substring(1);
        if (tofind[0]=='%') tofind=decodeURIComponent(tofind);
      }
     	this.html(_.template(template,{ value:this.options.value||""}) );
      $("#tofind").focus();
      //$("#tofind").val(tofind);
      //this.dosearch();
    }
  };
});
