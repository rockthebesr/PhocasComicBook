///<reference path='../types/DefinitelyTyped/jquery/jquery.d.ts'/>
var request = require("request");
var assert = require("assert");
var phocas = require('../app.js');
var base_url = "http://localhost:3000/";
var Browser = require('zombie');
var browser = new Browser();
describe("Phocas Server", function () {
    describe("GET /", function () {
        it("return status code 200", function (done) {
            request.get(base_url, function (error, response, body) {
                //expect(statusCode).toBe(200)
                assert.equal(200, response.statusCode);
                done();
            });
        });
        it("should show the login page", function (done) {
            browser.visit(base_url + 'login', function () {
                assert.equal(this.browser.text('h1'), "login");
                done();
            });
        });
    });
});
