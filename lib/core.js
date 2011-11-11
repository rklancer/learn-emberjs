/*globals Learn */
require('sproutcore');

Learn = SC.Application.create({

  VERSION: require('learn-sproutcore/~package').version,

  jsEditorView: null,
  templateEditorView: null,
  outputView: null,

  Output: null

});


Learn.sampleCodeController = SC.Object.create({

  js:         null,
  handlebars: null,

  load: function() {
    var code = require('./sample-code');
    this.set('js',         code.js);
    this.set('handlebars', code.handlebars);
  }

});


Learn.EditorView = SC.View.extend({

  $aceEditor: null,
  aceEditor:  null,
  AceMode:    null,

  didInsertElement: function() {
    var self = this;
    this.initEditor();
    $(window).resize(function() { self.resize(); });
  },

  initEditor: function() {
    var viewId = this.$().attr('id'),
        // bless the ac-editor div with a unique id for the benefit of (Learn.)ace.edit
        aceId  = viewId + '-ace-editor';

    this.$aceEditor = this.$('.ace-editor');
    this.$aceEditor.attr('id', aceId);

    this.resizeAceEditorDiv();
    this.set('aceEditor', Learn.ace.edit(aceId));
    this.setMode();
    this.setEditorStyle();
  },

  resizeAceEditorDiv: function() {
    this.$aceEditor.css({ height: this.$().height(), width: this.$().width() });
  },

  resize: function(evt) {
    this.resizeAceEditorDiv();
    this.get('aceEditor').resize();
  },

  setMode: function(mode) {
    var AceMode;

    mode = mode || this.get('MODE');
    AceMode = Learn.aceRequire(mode).Mode;
    this.get('aceEditor').getSession().setMode(new AceMode());
    this.set('AceMode', AceMode);
  },

  // Hook for updating editor style as desired.
  setEditorStyle: function() {
    this.get('aceEditor').setHighlightActiveLine(false);
  },

  updateSampleCode: function() {
    var aceEditor = this.get('aceEditor');
    if (aceEditor) aceEditor.getSession().setValue( this.get('sampleCode') );
  }.observes('sampleCode', 'aceEditor')

});


Learn.JsEditorView = Learn.EditorView.extend({

  init: function () {
    this._super();
    Learn.jsEditorView = this;
  },

  MODE: 'ace/mode/javascript',
  sampleCodeBinding: 'Learn.sampleCodeController.js'
});


Learn.TemplateEditorView = Learn.EditorView.extend({

  init: function () {
    this._super();
    Learn.templateEditorView = this;
  },

  MODE: 'ace/mode/html',
  sampleCodeBinding: 'Learn.sampleCodeController.handlebars'
});


Learn.OutputView = SC.View.extend({

  init: function () {
    this._super();
    Learn.outputView = this;
  },

  _window: null,
  _$: null,

  didInsertElement: function() {
    var self = this;

    this.$('.output-iframe').load( function() {
      var _window = this.contentWindow,
          _$ = _window.$;

      self.set('_window', _window);
      self.set('_$', _$);

      Learn.set('_window', _window);
      Learn.set('_$', _$);
      Learn.set('Output', _window.Output);

      Output = _window.Output;
    });
  }

});
