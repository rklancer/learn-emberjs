// ==========================================================================
// Project:   Learn.Sproutcore
// Copyright: ©2011 Richard Klancer
// ==========================================================================
/*globals Learn */

require('./core');

exports.main = function () {

  SC.View.create({
    templateName: 'learn-sproutcore/~templates/main-page'
  }).append();

  Learn.sampleCodeController.load();
};
