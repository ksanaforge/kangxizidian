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
        var newitem=_.template(itemtemplate,{wh:res[i].closest.head,slot:res[i].slot,text:res[i].text });
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
    dosearch:function(tofind) {
      var yase=this.sandbox.yase;
      var opts={db:this.db,showtext:true,closesttag:"wh",highlight:true,tofind:tofind};
      this.model.set({tofind:tofind});
      var that=this;
      yase.phraseSearch(opts,function(err,data) {
        that.model.set({res:data});
      });
    },
    model: new Backbone.Model(),
    initialize: function() {
      this.db=this.sandbox.dbname;
      $(window).resize( _.bind(this.resize,this) );
      
      this.sandbox.on("tofind.change",this.dosearch,this) ;

      this.model.on('change:res',this.render,this);
      
    }
  };
});
