define(['underscore','backbone','text!./result.tmpl','text!./item.tmpl','text!./notfound.tmpl'], 
  function(_,Backbone,template,itemtemplate,notfoundtemplate) {
  return {
    type: 'Backbone',
    events: {
      "click .candidate":"whclick"
    },
    resize:function() {
      var that=this;
      this.$el.css("height", (window.innerHeight - this.$el.offset().top -18) +"px");
    },
    whclick:function(e) {
      var btn=$(e.target);
      this.sandbox.emit("wh.change",btn.text() || btn.find("img").attr("title") || btn.attr("title"));
    },
    render:function() {
      this.resize();
      var tofind=this.model.get("tofind");
      var candidates=this.model.get("pycandidates");
      if (candidates&&  !candidates.length) {
        this.html(notfoundtemplate);
        return;
      };
      this.html(_.template(template,{pinyin:this.model.get("pinyin")}));
      if (!candidates) return;
      var screenheight=this.$el.innerHeight();
      var $candidates=this.$el.find(".pycandidates");
      for (var i=0;i<candidates.length;i++ ) {
        var newitem=_.template(itemtemplate,{wh:candidates[i]});
        newitem=this.sandbox.dgg.tagify(newitem);
        $candidates.append(newitem); // this is slow  to get newitem height()
      }
      this.sandbox.dgg.loadglyphs.apply(this,[ $candidates]);
      $candidates.find(".glyphwiki").removeClass("glyphwiki");
      
    },
    samesound:function(pinyin) { //from text-widget
      $("li a[href=#pron]").tab("show");
      this.searchpy(pinyin);
    },
    searchpy:function(pinyin) {
      var that=this;
      this.model.set("pinyin",pinyin);
      this.sandbox.yase.getRaw([this.db,'extra','py2wh',pinyin],
        function(err,data){
          if (typeof data=='undefined') data=[];
          that.model.set("pycandidates",data);
        })
    },
    extractpiyin:function(wh,def) {
      var zy=def.text.match(/<zy>(.*?)</);
      if (!zy){
        this.model.set("pycandidates",[]);
        this.render();//not found message
        return;
      } 

      zy=zy[1].split(',');
      this.searchpy(this.sandbox.pinyin.fromzhuyin(zy[0]));
    },
    find:function(tofind) {
      if (!tofind) {
        this.model.set("pycandidates",undefined);
        return;
      }
      var code=tofind.charCodeAt(0)
      if (code<128) {
        this.searchpy(tofind);
      } else if (code>=0x3100 && code<=0x312f)  {
        this.searchpy(this.sandbox.pinyin.fromzhuyin(tofind));
      } else {
        this.sandbox.emit("getdef",tofind,"py");
      } 
    },
    model: new Backbone.Model(),
  
    initialize: function() {
      var that=this;
      this.db=this.sandbox.dbname;
      this.sandbox.on('tofind.change',this.find,this);
      this.sandbox.on('getdef.py',this.extractpiyin,this);
      this.model.on("change:pycandidates",this.render,this);
      this.sandbox.on("samesound",this.samesound,this);
      this.$el.resize( _.bind(this.resize,this) );
      this.resize();
      this.render();
    }
  };
});
