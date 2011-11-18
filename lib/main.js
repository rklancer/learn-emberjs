// ==========================================================================
// Project:   Learn.Sproutcore
// Copyright: ©2011 Richard Klancer
// ==========================================================================
/*globals Learn */

require('./core');

exports.main = function () {

  SC.View.create({
    templateName: 'learn-sproutcore/~templates/main-page',

    didInsertElement: function() {
      Learn.set('jsEditorView',       SC.View.views['js-editor-view']);
      Learn.set('templateEditorView', SC.View.views['template-editor-view']);
      Learn.set('outputView',         SC.View.views['output-view']);
    }
  }).append();

  Learn.sampleCodeController.load();
};
