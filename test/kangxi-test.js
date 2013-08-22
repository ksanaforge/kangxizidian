var vows = require('vows'),
    assert = require('assert'),
    Yase=require('yase').use;
var fs=require('fs')
var services={};
vows.describe('kangxi test suite').addBatch({
    'texts': {
        topic: function () {
        	return Yase("../kangxizidian");
	},
	gettext:function(topic) {
		//console.log(topic)
		var r=topic.getText(2);
		console.log(r)
		//assert.equal(topic.getText(0).trim(),'རྒྱ་གར་སྐད་དུ།','gettext')
	},
	headsearch:function(topic) {
		//highlight true, rendering error == </</hl>wh>
		var tofind="正"
		var r=topic.phraseSearch(tofind,{tag:"wh",showtext:true,highlight:false});
		var first=r[Object.keys(r)[0]];
		console.log(first)
		assert.equal( tofind , first.match(/>(.*?)</)[1], "head search" )
	},
	gettagposting:function(topic) {
		console.time('gettagposting')
		var r=topic.getTagPosting('wh');
		//console.log(r)
		console.timeEnd('gettagposting')
		//console.log(r)
		//assert.deepEqual(r,{slot:16,offset:1},'gettag');
		//console.log(topic.getText(16));
	},
	findtag:function(topic) {
		//var r=topic.findTag('pb','id','1.2a');
	//	assert.equal(r,1,'findtag');
	},

	fetchpage:function(topic) {
	//	var r=topic.fetchPage('pb',1);
	//	assert.equal(r.match(/\n/g).length,8,'lines');
	},	
	finalize:function(topic) {
		topic.free();
	}

}	

}).export(module); // Export the Suite