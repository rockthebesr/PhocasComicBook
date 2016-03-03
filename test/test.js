var request = require("request");
var assert = require("assert");
var base_url = "http://localhost:3000/";

describe("Phocas Server", function(){ 
	describe("GET /", function(){
		it("return status code 200", function(done){
			request.get(base_url, function(error, response, body){
				//expect(statusCode).toBe(200)
				assert.equal(200, response.statusCode);
				done();
			})
		});

		it("return Phocas", function(done){
			request.get(base_url, function(error, response, body){
				//expect(body).toBe("Phocas");
				assert.equal("Phocas", body);
				phocas.closeServer();
				done();
			})
		});
	});
});