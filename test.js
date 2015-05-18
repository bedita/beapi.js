var beapi = require('./beapi.js');
var expect = require('chai').expect;
var conf = require('./test.json');

var api = new beapi({
    baseUrl: conf.baseUrl
});

describe('beapi.js', function() {
    describe('hello world', function() {
        var response = null;

        beforeEach(function(done) {
            var p = api.get('/');
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
                var p = api.auth(conf.auth.username, conf.auth.password);
                p.then(function(res) {
                    if (res) {
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
                api.get('me').then(function(res) {
                    if (res && res.data) {
                        profile = res.data.object;
                    }
                    done();
                }, function() {
                    done();
                });
            }
            if (count == 2) {
                api.refreshToken().then(function(res) {
                    if (res) {
                        newAccessToken = res.data.access_token;
                        refreshToken = res.data.refresh_token;
                        expireTime = res.data.expires_in;
                    }
                    done();
                }, function(res) {
                    done();
                });
            }
            if (count == 3) {
                api.logout().then(function() {
                    console.log('weee', api.getAccessToken());
                    hasLogout = true;
                    newAccessToken = api.getAccessToken();
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

        it('it should return the profile id', function() {
            expect(profile).to.not.equal(null);
            expect(typeof profile.id).to.equal('number');
        });

        it('it should return the a new access token after refresh', function() {
            expect(newAccessToken).to.not.equal(null);
            expect(accessToken).to.not.equal(newAccessToken);
        });

        // it('it should logout and destroy the session', function() {
        //     expect(newAccessToken).to.equal(undefined);
        //     expect(hasLogout).to.equal(true);
        // });
    })
});