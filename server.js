var connect = require('connect');
var serveStatic = require('serve-static');

const app = connect();

const port = 8080;

app.use(serveStatic(__dirname+'/public')).listen(port, function(){
	console.log('Server running on 8080...');
	
	var url = 'http://localhost:'+port;
	var start = (process.platform == 'darwin'? 'open': process.platform == 'win32'? 'start': 'xdg-open');
	require('child_process').exec(start + ' ' + url);
});