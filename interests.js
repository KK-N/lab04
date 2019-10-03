const http = require('http'); 
const url = require('url');

/*
function SimpleInterests() {
	this.principal = p;
	this.rate = r;
	this.period = t;
	this.interests = this.principal * this.rate * this.period;
}
*/
const principal = 1000000;
const rate = 0.01;
const period = 10;
const numberCompound = 12;

class SimpleInterests {
	constructor(p = principal,r = rate,t = period) { // default parameter values
		this.principal = p;
		this.rate = r;
		this.period = t;
		this.interests = this.principal * this.rate * this.period;
	}

	toString() {
		return(`Interests for $${this.principal} at an annual rate of \
${this.rate *100}% for ${this.period} years = $${this.interests}`);
	}
}
class CompoundInterests {
	constructor(p = principal,r = rate,t = period, n = numberCompound) { // default parameter values
		this.principal = p;
		this.rate = r;
		this.period = t;
		this.numberCompound = n;
		let amount = Math.pow( (1 + ( r / n )), n * t ) * p;
		this.interests = amount - p;
	}

	toString() {
		return(`Interests for $${this.principal} at an annual rate which is compounded per ${this.numberCompound} times of ${this.rate *100}% for ${this.period} years = $${this.interests}`); 
	}
}

// function handle_incoming_request(req,res) {
const handle_incoming_request = (req, res) => {
	let timestamp = new Date().toISOString();
    console.log(`Incoming request ${req.method}, ${req.url} received at ${timestamp}`);

	var parsedURL = url.parse(req.url,true); // true to get query as object 
	
	if(parsedURL.query.isCompounded == "true"){
		var obj = new CompoundInterests(parsedURL.query.p, parsedURL.query.r,parsedURL.query.t, parsedURL.query.n); 
	
	}else{
		// extract query string parameters
	var obj = new SimpleInterests(parsedURL.query.p, parsedURL.query.r,parsedURL.query.t); 
	}
	
	if (parsedURL.query.format == 'json') {
		res.writeHead(200, {"Content-Type" : "text/json"}); 
		res.end(JSON.stringify(obj));
	} else {
		res.writeHead(200, {"Content-Type" : "text/html"});
		res.write('<html><h1>');
		res.write(obj.toString());
		res.end('</h1></html>');
	}
}

const server = http.createServer(handle_incoming_request); 
server.listen(process.env.PORT || 8099);
