var beapi = require('./beapi.js');
var expect = require('chai').expect;
var conf = require('./test.json');

beapi.baseUrl = conf.baseUrl;

describe('bebeapi.js', function() {
    describe('hello world', function() {
        var response = null;

        beforeEach(function(done) {
            var p = beapi.get('/');
            p.then(function(res) {
                response = res;
                done();
            }, function() {
                done();
            });
        });

        it('it should return the hello world message', function() {
            expect(response).to.not.equal(null);
            expect(response.message).to.not.equal(undefined);
            expect(response.message).to.equal('Hello World!');
        });
    });
    describe('authentication', function() {
        var accessToken = null;
        var refreshToken = null;
        var expireTime = null;
        var profile = null;
        var newAccessToken = null;
        var hasLogout = false;

        var count = 0;

        beforeEach(function(done) {
            if (count == 0) {
                var p = beapi.auth(conf.auth.username, conf.auth.password);
                p.then(function(res) {
                    if (res && res.data) {
                        accessToken = res.data.access_token;
                        refreshToken = res.data.refresh_token;
                        expireTime = res.data.expires_in;
                    }
                    done();
                }, function() {
                    done();
                });
            }
            if (count == 1) {
                beapi.refreshToken().then(function(res) {
                    if (res && res.data) {
                        newAccessToken = res.data.access_token;
                        refreshToken = res.data.refresh_token;
                        expireTime = res.data.expires_in;
                    }
                    done();
                }, function(res) {
                    done();
                });
            }
            if (count == 2) {
                beapi.logout().then(function() {
                    hasLogout = true;
                    newAccessToken = beapi.getAccessToken();
                    done();
                }, function() {
                    done();
                });
            }
            count++;
        });

        it('it should return access and refresh tokens', function() {
            expect(accessToken).to.not.equal(null);
            expect(refreshToken).to.not.equal(null);
            expect(expireTime).to.not.equal(null);
            expect(typeof accessToken).to.equal('string');
            expect(typeof refreshToken).to.equal('string');
        });

        it('it should return the a new access token after refresh', function() {
            expect(newAccessToken).to.not.equal(null);
            expect(accessToken).to.not.equal(newAccessToken);
        });

        it('it should logout and destroy the session', function() {
            expect(newAccessToken).to.equal(undefined);
            expect(hasLogout).to.equal(true);
        });
    })
});