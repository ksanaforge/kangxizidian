/*
TODO , normalize all traditional and variants to simplified Chinese
*/
var kangxizidian="xml/kx01*.xml";
var phonetics={};
var wh="";
var do_zy=function(text,tag,attributes,status) {
	//build inverted table for zhuyin
	var zys=text.split(",");
	for (var i=0;i<zys.length;i+=1){
		var zy=zys[i];
		if (!phonetics[zy]) phonetics[zy]=[];
		phonetics[zy].push(wh);
	}
}
var do_juan=function(text,tag,attributes,status) {
	return [	
		{path:["head"],value:text}
		,{path:["head_vpos"],value:status.vposstart}
		,{path:["head_depth"],value:1}
		,{path:["head_len"],value:status.vpos-status.vposstart}
		];	
}
var do_part=function(text,tag,attributes,status) {
	return [	
		{path:["head"],value:text}
		,{path:["head_vpos"],value:status.vposstart}
		,{path:["head_depth"],value:2}
		,{path:["head_len"],value:status.vpos-status.vposstart}
		];	
}
var do_wh=function(text,tag,attributes,status) {
	wh=text;
	return [	
		{path:["head"],value:text}
		,{path:["head_vpos"],value:status.vposstart}
		,{path:["head_depth"],value:3}
		,{path:["head_len"],value:status.vpos-status.vposstart}
		];
}

var do_note=function(text,tag,attributes,status){
	return [	
		{path:["note"],value:attributes.n}
		,{path:["note_vpos"],value:status.vpos}
		];	
}
var captureTags={ // 建構目錄，所以要把 XML 的 head 抓出來
	"zy":do_zy,
	"wh":do_wh,
	"juan":do_juan,
	"part":do_part,
	"note":do_note,
};

var warning=function() {
	console.log.apply(console,arguments);
}

var onFile=function(fn) {
	if (typeof window!=="undefined") console.log("indexing ",fn);
	else process.stdout.write("indexing "+fn+"\033[0G");
}
var finalized=function(session) {
	console.log("VPOS",session.vpos);
	console.log("FINISHED")
}
var finalizeField=function(fields) {
	
}
var onFileName=function(fn){
	return fn.substr(0,fn.length-4);
}
var config={
	name:"kangxizidian"
	,meta:{
		config:"zidian1", //use zidian template
		toc:"head",
		title:"開放康熙字典"
	}
	,glob:kangxizidian
	,segsep:"wh.unicode"
	,warning:warning
	//,norawtag:true
	,captureTags:captureTags
	,callbacks: {
		onFile:onFile
		,finalized:finalized
		,finalizeField:finalizeField
		//,onRepeatSid:onRepeatSid
		,onFileName:onFileName
	},
	extra:{
		phonetics:phonetics
	}
	//,noWrite:true
}
require("ksana-indexer").build(config);
module.exports=config;