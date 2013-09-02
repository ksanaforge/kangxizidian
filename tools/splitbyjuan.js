/*
	Split kangxi-xml into smaller chapter xml for github
	yapcheahshen@gmail.com 2013/8/21

	convert tags into english
*/
var fs=require('fs');
var lastjuan='';
var juantext='';
var volno='';
var convert=[
	{from:/<頁 n=/g , to:"<pb id="},
	{from:/<部首-筆畫>部首-筆畫：(.*?)<\/部首-筆畫>/g , to:'<ps n="$1"/>'},
	{from:/<\/部首-筆畫>/g , to:"</ps>"},
	{from:/<字 /g , to:"<wh "},
	{from:/<\/字>/g , to:"</wh>"},
	{from:/注音>/g , to:"zy>"},
	{from:/古文>/g , to:"an>"},
	{from:/<文 /g , to:"<ch "},
	{from:/<\/文>/g , to:"</ch>"},
	{from:/部首>/g , to:"part>"},
	{from:/<部首 t="字.">/g , to:"<part>"},
	{from:/<總筆畫>總筆畫：(.*?) <\/總筆畫>/g , to:'<sc n="$1"/>'},
	{from:/<音\/>/g , to:"<ph/>"},
	{from:/<卷/g , to:"<juan"},
	{from:/<\/卷>/g , to:"</juan>"},

	{from:/<例\/>/g , to:"<d/>"},
	{from:/<注 /g , to:"<note "},
	{from:/內文>/g , to:"t>"},
]
var lastpage="";

var removerepeatedpage=function() {
	var out=[];
	for (var i=0;i<juantext.length;i++) {
		var t=juantext[i];
		var m=t.match(/<pb id="(.*?)"\/>/);
		if (m) {
			m=m[1];
			if (m==lastpage) {
				continue;
			}
			lastpage=m;
		}
		out.push(t);
	}
	juantext=out;

}
var converttag=function() {
	for (var i=0;i<juantext.length;i++) {
		var t=juantext[i];
		for (var j=0;j<convert.length;j++) {
			t=t.replace( convert[j].from, convert[j].to);
		}

		juantext[i]=t;
	}
}
var savejuan=function() {
	var fn='kx'+lastjuan+'.xml';
	console.log('saving '+fn);
	converttag();
	removerepeatedpage();
	juantext.unshift('<xml src="'+fn+'">');
	juantext.push('</xml>');
	fs.writeFileSync(fn, juantext.join('\r\n'),'utf8');
	juantext=[];
}
var juantext=[]
var splitfile=function(fn) {
	var arr=fs.readFileSync(fn,'ucs2').replace(/\r\n/g,'\n').split('\n');
	//skip leading <?xml tag
	for (var i=21;i< arr.length;i++) {
		var b=arr[i].indexOf('<卷 ');
		if (b>-1) {
			if (lastjuan) savejuan();
			lastjuan=arr[i].match(/.*? n="(.*?)"/)[1];
		}
		volno=parseInt(fn,10);	
		juantext.push(arr[i]);
	}
	savejuan();
}
splitfile('kx(20130813).xml');

