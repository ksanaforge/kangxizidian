define(['underscore','text!./text.tmpl'], 
  function(_,template) {
  return {
    //dbname : 'kangxizidian',
    type: 'Backbone',
    events: {
      'click .destroy':'closeme',
      'click samezy':'samezy',
      'click samepy':'samepy'
    },
    samezy:function(e) {
      var zy=$(e.target).html();
      this.searchsound(this.sandbox.pinyin.fromzhuyin(zy));
    },
    samepy:function(e) {
      this.searchsound($(e.target).html());
    },
    searchsound:function(py) {
      this.sandbox.emit('samesound',py);
    },
    closeme:function() {
      var $el=this.$el;
      $el.hide('slow', function(){ $el.remove(); });
    },
    addpinyin:function() {
      var that=this;
      $zy=this.$el.find("zy");
      if (!$zy.length)return;
      var zy=$zy.html().replace('注音：','').split(',');
      var py=[];
      zy=zy.map( function(k) {
        py.push('<samepy>'+that.sandbox.pinyin.fromzhuyin(k)+'</samepy>');
        return "<samezy>"+k+"</samezy>";
      });
      $zy.html(zy.join(","));
      $zy.after("<py>"+py.join(",")+"</py>");

    },
    adjustlayout:function(def) {
      def='<div class="row"><div class="col-4">'+def;
      def=def.replace('</wh>','</wh></div><div class="col-8">');
      def=def.replace('<t>','</div></div><t>');
      return def;
    },
    showdef:function(wh,data2,tagdata) {
        data2.text=this.adjustlayout(data2.text);
        data2.unicode=this.sandbox.cjkutil.getutf32ch(wh).toString(16).toUpperCase();
        var html=_.template(template,data2);
        var that=this;
        html=html.replace(/(&.*?;)/g,'<img src="missingcharacter.png" title="$1"/>');
        html=html.replace(/<note n="(.*)"\/>/g,'<span class="note" data-toggle="tooltip" title="$1"/>');

        html=that.sandbox.dgg.tagify(html);
        this.html(html);

        this.sandbox.loadimages.apply(that,[that.$el]);
        var opts={db:this.db};
        opts.attr="id";opts.tag="pb";opts.ntag=tagdata[0][1].ntag;
        this.sandbox.yase.getTagAttr(opts,function(err,pn){
          var wid=that.$el.find("wh").attr("wid");
          that.$el.find("#pagenumber").html(pn);
          that.$el.find("#wid").html(wid);
        })

        this.addpinyin();
        this.sandbox.dgg.loadglyphs.apply(that,[that.$el]);
    },
    fetchdef:function(wh,tofind) {
      this.sandbox.emit("getdef",wh,"text-widget",tofind);
    },

    initialize: function() {
      //TODO repeat initializing 
      console.log('initializing ',this.options.wh)
      this.db=this.sandbox.dbname;
      this.tofind=this.options.tofind;
      this.fetchdef(this.options.wh,this.tofind);   
      this.sandbox.once("getdef.text-widget",this.showdef,this);
    }
  };
});
