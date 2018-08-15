'use strict';

var expect = require('expect.js');

// TODO: write tests
describe('models/index', function () {
  // it('returns the task model', function () {
  //   var models = require('../../models');
  //   expect(models.Task).to.be.ok();
  // });

  it('returns the user model', function () {
    var models = require('../../models');
    expect(models.User).to.be.ok();
  });
});
