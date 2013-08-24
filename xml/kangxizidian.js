console.log(require('yase').build({
	dbid:'kangxizidian',
	blockshift:7,
	schema:function() {
		this.toctag(["wh"])
		      .emptytag("pb").attr("pb","id",{"depth":1})
		      .emptytag("sc").attr("sc","n",{"depth":1,"allowrepeat":true})
		      .emptytag("d").emptytag("ph")
		      .attr("detshen","tid",{"depth":3,"allowrepeat":false})
			  .attr("xml","src",{"allowrepeat":false})
	},
	extra: {
		decompose: require('./decompose_kangxi.js')
	},
	min_yase_version:'0.0.16',
	input:'kangxizidian.lst',
	output:'../kangxizidian.ydb',
	author:'chipanwang@gmail.com',
	url:'http://www.ksana.tw',
	version:'0.0.2',
	blob: { 'images' : './images'},
	//maxfile:2  
}));