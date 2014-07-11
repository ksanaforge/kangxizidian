define(['underscore','backbone','text!./result.tmpl','text!./item.tmpl','text!./notfound.tmpl'], 
  function(_,Backbone,template,itemtemplate,notfoundtemplate) {
  return {
    type: 'Backbone',
    events: {
      "click .candidate":"whclick"
    },
    resize:function() {
      var that=this;
      // this.$el.css("height", (window.innerHeight - this.$el.offset().top -18) +"px");
    },
    whclick:function(e) {
      var btn=$(e.target);
      this.sandbox.emit("wh.change",btn.text() || btn.find("img").attr("title") || btn.attr("title"));
      //this.sandbox.emit("tofind.change",btn.text() || btn.find("img").attr("title") || btn.attr("title"));
      //$("#tofind").val(btn.text() || btn.find("img").attr("title") || btn.attr("title"));
      //$("#page9_explain > div").hide();
      //$("#explain").show();
    },
    render:function() {
      this.resize();
      var tofind=this.model.get("tofind");
      var candidates=this.model.get("pbcandidates");
      if (candidates && !candidates.length) {
        this.html(notfoundtemplate);
        return;
      };
      this.html(template);
      if (!candidates) return;

      var screenheight=this.$el.innerHeight();
      var $candidates=this.$el.find(".pbcandidates");
      for (var i=0;i<candidates.length;i++ ) {
        var newitem=_.template(itemtemplate,{wh:candidates[i]});
        newitem=this.sandbox.dgg.tagify(newitem);
        $candidates.append(newitem); // this is slow  to get newitem height()
      }
      this.sandbox.dgg.loadglyphs.apply(this,[ $candidates]);
      $candidates.find(".glyphwiki").removeClass("glyphwiki");
      
    },
    findpbwid:function(tofind) {
      if (!tofind) {
        this.model.set("pbcandidates",undefined);
        return;
      }      
      var pbwid=tofind.split('.');
      pbwid[0]=parseInt(pbwid[0]);
      pbwid[1]=pbwid[1] || 0;
      pbwid[1]=parseInt(pbwid[1]);
      if (isNaN(pbwid[0])) {
        this.model.set("pbcandidates",[]);
        return null;
      }
      var pb='000'+pbwid[0], pbend='000'+(pbwid[0]+1); //pad to 4 digits
      pb=pb.substring(pb.length-4);
      pbend=pbend.substring(pbend.length-4);
      var wid='00'+pbwid[1];//pad to 3 digits
      wid=wid.substring(wid.length-3);
      var that=this;
      var yase=this.sandbox.yase;
      var db=this.db;
      yase.findTag({db:db,tag:'pb',attribute:'id',value:[pb,pbend]},
        function(err,data){
          yase.getTagInRange({db:db,start:data[0].slot,end:data[1].slot,tag:'wh',attributes:['wid']},
            function(err,data){
              var pbcandidates=[];
              for (var i=0;i<data.length;i++) {
                if (data[i].values.wid==wid || wid=='000') {
                  pbcandidates.push(data[i].head);  
                }
              }
              that.model.set("pbcandidates",pbcandidates);
              if (!pbcandidates.length) that.render();
          });
      })
    },
    model: new Backbone.Model(),
  
    initialize: function() {
      var that=this;
      this.db=this.sandbox.dbname;
      this.sandbox.on('tofind.change',this.findpbwid,this);
      this.model.on("change:pbcandidates",this.render,this);
      this.render();
      this.$el.resize( _.bind(this.resize,this) );
    }
  };
});
