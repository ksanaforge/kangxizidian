var fs=require('fs');
var files=fs.readFileSync('kangxizidian.lst','utf8').replace(/\r\n/g,'\n').split('\n');
var pinyin=require('../../node_webkit/jslib/cjk/pinyin');
var py2wh={}
var outback = function (s) {
    while (s.length < 70) s += ' ';
    var l = s.length; 
    for (var i = 0; i < l; i++) s += String.fromCharCode(8);
    process.stdout.write(s);
}
var dofile=function(fn) {
	outback(fn);
	var lastwh='';
	var arr=fs.readFileSync(fn,'utf8').split('\n');//.replace(/\r\n/g,'\n').split('\n');
	for (var i=0;i<arr.length;i++) {
		var prefix=arr[i].substring(0,4);
		if (prefix==='<wh ') {
			lastwh=arr[i].substring(arr[i].indexOf('>')+1);
			lastwh=lastwh.substring(0,lastwh.indexOf('<'));
			if (lastwh.length>2 && lastwh[0]!='&')
			console.log('long wh',lastwh,fn,i);
		} else if (prefix=='<zy>') {
			var zys=arr[i].match(/<zy>(.*?)</)[1].split(',');
			for (var j in zys) {
				var py=pinyin.fromzhuyin(zys[j]);
				if (!py2wh[py]) py2wh[py]=[];
				py2wh[py].push(lastwh);
			}
		}
	}
};

for (var i in files) {
	dofile(files[i])
}

fs.writeFileSync('py2wh.js','module.exports='+JSON.stringify(py2wh),'utf8');
