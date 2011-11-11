/*globals Learn */
require('sproutcore');

Learn = SC.Application.create({

  VERSION: require('learn-sproutcore/~package').version,

  jsEditorView: null,
  templateEditorView: null,
  outputView: null,

  _window: null,
  _document: null,
  _SC: null,
  _$: null

});


Learn.sampleCodeController = SC.Object.create({

  code:     '',
  template: '',

  load: function() {
    var sampleCode = require('./sample-code');
    this.set('code', sampleCode.code);
    this.set('template', sampleCode.template);
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
  MODE: 'ace/mode/javascript',
  sampleCodeBinding: 'Learn.sampleCodeController.code'
});


Learn.TemplateEditorView = Learn.EditorView.extend({
  MODE: 'ace/mode/html',
  sampleCodeBinding: 'Learn.sampleCodeController.template'
});


Learn.OutputView = SC.View.extend({

  codeBinding: 'Learn.sampleCodeController.code',
  templateStringBinding: 'Learn.sampleCodeController.template',

  iframeIsLoaded: false,
  _window:        null,
  _document:      null,
  _$:             null,
  _SC:            null,

  didInsertElement: function() {
    var self = this;
    this.$('.output-iframe').load(function() { self.iframeDidLoad(this); });
  },

  iframeDidLoad: function (iframeElem) {
    this.set('_document', iframeElem.contentDocument);
    this.set('_window', iframeElem.contentWindow);
    this.set('_$', this._window.$);
    this.set('_SC', this._window.SC);

    this.updateCode();
    this.updateTemplate();
    this.set('iframeIsLoaded', true);
  },

  templateStringDidChange: function() {
    if (this.get('iframeIsLoaded')) this.updateTemplate();
  }.observes('templateString'),

  codeDidChange: function() {
    if (this.get('iframeIsLoaded')) this.reloadIframe();
  }.observes('code'),

  reloadIframe: function() {
    this._window.location.reload();
    this.set('iframeIsLoaded', false);
  },

  updateTemplate: function() {
    this._window.Output.view.set('template', this._SC.Handlebars.compile(this.get('templateString')));
    this._window.Output.view.rerender();
  },

  updateCode: function() {
    // http://stackoverflow.com/questions/610995/jquery-cant-append-script-element/3603496#3603496
    var script = this._document.createElement('script');
    script.type = 'text/javascript';
    script.text = this.get('code');
    this._document.body.appendChild(script);
  }

});
