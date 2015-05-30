var fs=require("fs");
var lst=fs.readFileSync("./xml/kangxizidian.lst","utf8").split(/\r?\n/);
var titles={},total=0;

var ignores={集韻:true,廣韻:true,韻會:true,說文:true,玉篇:true,正韻:true,唐韻:true,字彙補:true,
類篇:true,正字通:true,爾雅:true,篇海:true,字彙:true,博雅:true,龍龕:true,方言:true,篇海類編:true,康熙字典:true,五音集韻:true,五音篇海:true,搜眞玉鏡:true,增韻:true,廣雅:true,韻補:true,海篇:true,
};
var dofile=function(fn,idx){
	var content=fs.readFileSync("xml/"+fn,"utf8");
	content.replace(/《(.+?)》/g,function(m,m1){
		m1.split("．").map(function(title,idx){
			if (idx)return;
			if (ignores[title])return;
			if (!titles[title])  titles[title]=0;
			titles[title]++;
			total++;
		});
	});
}
lst.map(dofile);
var out=[];
for (var title in titles) {
	out.push([titles[title],title]);
}

out.sort(function(a,b){return b[0]-a[0]});

var accumulate=0;
out.forEach(function(t){
	accumulate+=t[0];	
	t[2]=((accumulate/total)*100).toFixed(2);
	//t[3]=accumulate;
});
out=out.map(function(t){return t.join("\t")})
console.log(accumulate)
fs.writeFileSync("kangxi_titles.txt",out.join("\n"),"utf8")