define(['underscore','text!./controls.tmpl'], function(_,template) {
  return {
    type: 'Backbone',
    events: {
      "click #btnclearall":"clearall",
      "click #btncopy":"copy",
    },
    copy:function(e) {

      var gui = require('nw.gui');
      if (gui) {
        bootbox.alert("only node-webkit supports copy-to-clipboard<br>use ctrl+c or right-click menu",function(){})
        return;
      }
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
   
    render:function() {
      this.html(_.template(template,{}));
    },

    initialize: function() {
      this.render();
    }
  };
});
