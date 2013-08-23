define(['underscore','text!./text.tmpl'], function(_,template) {
  return {
    dbname : 'kangxizidian',
    type: 'Backbone',
    events: {
      'click .destroy':'closeme',
    },
    closeme:function() {
      var $el=this.$el;
      $el.hide('slow', function(){ $el.remove(); });
    },
    imagearrive:function(nimg,Base64) {
      return function(err,data){
        if (data) { //convert to base64
          var dataurl= "data:image/png;base64,"+Base64.encode(data)
          nimg.attr('width','5%');
          nimg.attr('height','5%');
          nimg.attr('src',dataurl);
          nimg.addClass('eudc');
        }
      }
    },
    loadimages:function() {
      var images=$("img[title]");
      var sandbox=this.sandbox;
      for (var i=0;i<images.length;i++) {
        $img=$(images[i]);
        var yase=this.sandbox.yase;
        var blobpath='images/'+$img.attr("title")+'.png';
        yase.getBlob({db:this.dbname, blob:blobpath}, 
          this.imagearrive($img,this.sandbox.Base64));
      }
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
                var html=_.template(template,data);
                html=html.replace(/&(.*?);/g,'<img src="missingcharacter.png" title="$1"/>');
                that.html(html);
                that.loadimages.call(that);
            });
        });
      });
      
    },

    initialize: function() {
      this.showdef(this.options.wh);      
    }
  };
});
