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
        this.timeout(5000);

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
                setTimeout(function() {
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
                }, 1000);
            }
            if (count == 2) {
                setTimeout(function() {
                    beapi.logout().then(function() {
                        hasLogout = true;
                        newAccessToken = beapi.getAccessToken();
                        done();
                    }, function(res) {
                        console.log(res);
                        done();
                    });
                }, 1500);
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
            expect(newAccessToken).to.equal(null);
            expect(hasLogout).to.equal(true);
        });
    });
    describe('get an object', function() {
        var object = null;

        beforeEach(function(done) {
            var p = beapi.objects(conf.publication_id);
            p.then(function(res) {
                if (res && res.data && res.data.object) {
                    response = res.data.object;
                }
                done();
            }, function() {
                done();
            });
        });

        it('it should return a be object', function() {
            expect(response).to.not.equal(null);
            expect(typeof response.id).to.equal('number');
            expect(typeof response.nickname).to.equal('string');
        });
    });
});