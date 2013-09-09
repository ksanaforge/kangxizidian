-define(['underscore','text!./controls.tmpl','text!./origin.tmpl'], function(_,template,origin_template) {
  return {
    type: 'Backbone',
    events: {
      "click #btnclearall":"clearall",
      "click #btncopy":"copy",
      "click #btnexcerptcopy":"excerptcopy"
    },
    checkbrowser:function(){
      var gui = require('nw.gui');
      if (!gui) {
        bootbox.alert("only node-webkit supports copy-to-clipboard<br>use ctrl+c or right-click menu",function(){})
        return true;
      }      
      return false;
    },
    excerptcopy:function(e) {
      if (this.checkbrowser())return;
      var clipboard = require('nw.gui').Clipboard.get();
      // Or write something
      var range=window.rangy.getSelection().getRangeAt(0);
      var sel=range.toString();
      var div=$(range.startContainer).parent();
      while (div.length && !div.hasClass('pagetext')){
        div=div.parent();
      }
      var params={};
      var wh=div.find("wh");
      params.wh=wh.html();
      params.wid=parseInt(wh.attr("wid"));
      params.pagenumber=parseInt(div.parent().find("#pagenumber").html());
      var origin=_.template(origin_template,params);
      clipboard.set(sel+origin, 'text');
      var oldlabel=$("#btnexcerptcopy").html();
      $("#btnexcerptcopy").html('Copies!!');
      setTimeout( function() {
        $("#btnexcerptcopy").html(oldlabel)
      },2000);      
    },
    copy:function(e) {
      if (this.checkbrowser())return;
      // We can not create a clipboard, we have to receive the system clipboard
      var clipboard = require('nw.gui').Clipboard.get();
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
   
    render:function() {
      this.html(_.template(template,{}));
      if (typeof process=='undefined') {
        console.log("hiding buttons")
        $("#btncopy").hide();
        $("#btnexcerptcopy").hide();
      }
    },

    initialize: function() {
      this.render();
    }
  };
});
