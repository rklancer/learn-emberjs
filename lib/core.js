/*globals Learn */
require('sproutcore');

Learn = SC.Application.create({
  VERSION: require('learn-sproutcore/~package').version,

  jsEditorView:       null,
  templateEditorView: null
});


Learn.EditorView = SC.View.extend({

  didInsertElement: function() {
    var self = this;
    this.initEditor();
    $(window).resize(function() { self.resize(); });
  },

  initEditor: function() {
    var viewId = this.$().attr('id'),
        // bless the ac-editor div with a unique id for the benefit of (Learn.)ace.edit
        aceId  = viewId + '-ace-editor';

    this._$aceEditor = this.$('.ace-editor');
    this._$aceEditor.attr('id', aceId);

    this.resizeAceEditorDiv();
    this.set('aceEditor', Learn.ace.edit(aceId));
  },

  resizeAceEditorDiv: function() {
    this._$aceEditor.css({ height: this.$().height(), width: this.$().width() });
  },

  resize: function (evt) {
    this.resizeAceEditorDiv();
    this.get('aceEditor').resize();
  }

});


Learn.JsEditorView = Learn.EditorView.extend({

  didInsertElement: function() {
    this._super();
    Learn.set('jsEditorView', this);
  },

  initEditor: function() {
    this._super();
    var JsMode = Learn.aceRequire("ace/mode/javascript").Mode;
    this.get('aceEditor').getSession().setMode(new JsMode());
    this.set('aceMode', JsMode);
  }

});
