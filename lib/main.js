// ==========================================================================
// Project:   Learn.Sproutcore
// Copyright: ©2011 Richard Klancer
// ==========================================================================
/*globals Learn */

require('./core');

Learn.main = function main() {
  var sampleCode;

  SC.View.create({
    templateName: 'learn-sproutcore/~templates/main-page'
   }).append();

  // set sample data
  sampleCode = require('./sample-code');
  Learn.sampleCodeController.set('js', sampleCode.js);
  Learn.sampleCodeController.set('handlebars', sampleCode.handlebars);
};
