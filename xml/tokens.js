var token2tree_western=function(tk) {
//for chinese. 
	var vowels=['a','ā','i','o','u','ī','ū','e'];
	
	var res=[];
	var key="";
	var i=0;
	while (i<tk.length) {
		key+=tk[i];
		if (vowels.indexOf(tk[i])>-1) {
			if (tk[i+1]=='ṅ' || tk[i+1]=='ṃ') { //not a stand alone consonant
				i++;
				key+=tk[i];
			}
			res.push(key);
			key="";
			if (res.length>=3) {
				res.push( tk.substring(i+1));
				break;
			}
		}
		i++;
	}
	if (key) res.push(key);
	
	while (res.length<4) res.push(' ');
	return res;
	
}
var token2tree=function(tk) {
	var c=tk.charCodeAt(0);
	if ((c>=0x61 && c<=0x7a) || c==0xF1 ||
	  (c>=0x100 && c<=0x24f  ) || (c>=0x1E00 && c<=0x1EFF)) {
		var T=token2tree_western(tk);
	} else {
		var T=[];
		T.push( '$'+(c >> 8).toString(16) );
		T.push( tk );
		while (T.length<4) T.push(' ');
	}
	return T;
}
var postings2tree=function(o) {
	var res={};
	for (var i in o) {
		var T=token2tree(i);
		var node=res;
		for (var j=0;j<T.length-1;j++) {
			if (!node[ T[j] ]) node[ T[j] ]={};
			node=node[ T[j] ];
		}
		node[ T[T.length-1] ]=o[i];
	}
	return res;
}
var normalizetoken=function(tk) {
	return tk.toLowerCase();
}
var preprocesstext=function(text) {
	return text.replace(/\r/g,'').replace(/\n/g,'');
}
var splitter=require('../ksanadb/splitter');
exports.token2tree=token2tree;
exports.normalizetoken=normalizetoken;
exports.postings2tree=postings2tree;
exports.preprocesstext=preprocesstext;
exports.splitter=splitter;