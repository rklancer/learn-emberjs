// ==========================================================================
// Project:   Learn.Ember.js
// Copyright: ©2011 Richard Klancer
// ==========================================================================
/*globals Learn */

require('./core');

exports.main = function () {

  Ember.View.create({
    templateName: 'learn-emberjs/~templates/main-page',

    didInsertElement: function() {
      Learn.set('jsEditorView',       Ember.View.views['js-editor-view']);
      Learn.set('templateEditorView', Ember.View.views['template-editor-view']);
    }
  }).append();

  Learn.sampleCodeController.load();
};
