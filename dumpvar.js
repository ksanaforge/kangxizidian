fs=require('fs')
var arr=fs.readFileSync("unihan.txt","utf8").split("\n");
var key="kCompatibilityVariant"
var right=29;
for (var i=0;i<arr.length;i++) {
	line=arr[i]
	if (line.substr(7,21)==key ||line.substr(8,21)==key) {
		if (line.substr(8,21)==key) right=30;
		from=line.substr(right+2);
		to=line.substr(2,5).trim();
		console.log(',"'+from+'"',":",'"'+to+'"');
	}
}