define(['underscore','backbone','text!./result.tmpl','text!./item.tmpl'], 
  function(_,Backbone,template,itemtemplate) {
  return {
    type: 'Backbone',
    events: {
      "click .search-result-item":"itemclick"
    },
    resize:function() {
      var that=this;
      this.$el.css("height", (window.innerHeight - this.$el.parent().offset().top) -10 +"px");
      this.$el.unbind('scroll');
      this.$el.bind("scroll", function() {
        if (that.$el.scrollTop()+ that.$el.innerHeight()+3> that.$el[0].scrollHeight) {
          var res=that.model.get("res");
          var totalcount=that.model.get("totalcount");
          if (that.displayed+10>res.length && that.displayed<totalcount) {
            that.dosearch(that.model.get("tofind"),res.length);
          }
          that.loadscreenful();
        }
      });

    },     
    itemclick:function(e) {
     // $e.parent().children().removeClass('active');
     // $(e.target).addClass('active');
      if (e.target.tagName!=="A") e.target=e.target.parentElement;
      $e=$(e.target);
      this.sandbox.emit("wh.change", $e.data("wh"),this.model.get("tofind")) ;
    },
    loadscreenful:function() {
      var res=this.model.get("res");

      var screenheight=this.$el.innerHeight();
      var $listgroup=$(".list-group");
      var startheight=$listgroup.height();
      if (this.displayed>=res.length) return;
      var now=this.displayed||0;
      var H=0,outputheight=0;
      for (var i=now;i<res.length;i++ ) {
        var newitem=_.template(itemtemplate,{wh:res[i].closest.head,slot:res[i].slot,text:res[i].text,seq:res[i].seq+1 });
        //protect kxr in tag
        newitem=newitem.replace(/="&(.*?);"/g,'="{$1}"');
        newitem=newitem.replace(/(&.*?;)/g,'<img src="missingcharacter.png" title="$1"/>');
        newitem=newitem.replace(/\{(.*?)\}/g,'&$1;');

        $listgroup.append(newitem); // this is slow  to get newitem height()
        outputheight+=20;
        //if ($listgroup.height()-startheight>screenheight) break;
        if (outputheight>screenheight) break;
      }
      this.displayed=i+1;
      this.sandbox.loadimages.apply(this,[$listgroup]);
    },    
    render:function() {
      this.resize();
      this.displayed=0;
      this.$el.html(_.template (template,{}));
      this.resize();

      this.loadscreenful();
    },
    totalcount:function(tofind) {
      var yase=this.sandbox.yase;
      var opts={db:this.db,grouped:true,tofind:tofind};
      var that=this;
      yase.phraseSearch(opts,function(err,data) {
        that.model.set("totalcount",Object.keys(data).length);
        that.$el.find("#totalcount").html(that.model.get("totalcount"))
      });
    },
    dosearch:function(tofind,start) {
      if (start>this.model.get("totalcount"))return;
      var opts={};
      var yase=this.sandbox.yase;
      if (!opts.db) opts.db=this.db;
      opts.showtext=true;
      opts.highlight=true;
      opts.sourceinfo=true;
      opts.start=start||0;
      opts.maxcount=30;
      opts.closesttag="wh";
      opts.tofind=tofind||this.model.get("tofind");
      this.model.set({tofind:opts.tofind});
      var that=this;
      yase.phraseSearch(opts,function(err,data) {
        if (opts.start==0) {
          that.model.set("res",data);
          that.render();
        } else {
          var res=that.model.get("res");
          that.model.set("res",res.concat(data));
        }
        that.loadscreenful();
      });
      console.log('search',opts.start)
    },
    model: new Backbone.Model(),
    initialize: function() {
      this.db=this.sandbox.dbname;
      $(window).resize( _.bind(this.resize,this) );
      
      this.sandbox.on("tofind.change",this.dosearch,this) ;
      this.sandbox.on("tofind.change",this.totalcount,this) ;

      //this.model.on('change:res',this.render,this);
      
    }
  };
});
