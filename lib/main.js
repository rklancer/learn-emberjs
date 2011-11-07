// ==========================================================================
// Project:   Learn.Sproutcore
// Copyright: ©2011 Richard Klancer
// ==========================================================================
/*globals Learn */

require('./core');

Learn.main = function main() {
  SC.View.create({
    templateName: 'learn-sproutcore/~templates/main-page'
  }).append();
};
