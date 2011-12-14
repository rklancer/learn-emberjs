/*globals Learn */

require('sproutcore');

Learn = SC.Application.create({

  VERSION: require('learn-sproutcore/~package').version,

  // The main app views. These properties are observable, and they are set when the main app view is appended.

  jsEditorView:       null,
  templateEditorView: null,
  lastOutputView:     null,

  // These properties are observable, but they are set by an observer on lastOutputView to facilitate access by
  // simple dot accessors without needing the get() method (this is useful at the console).

  _document: null,      // iframe's document
  _window:   null,      // iframe's window
  _SC:       null,      // iframe's SC
  _$:        null,      // iframe's jQuery
  _view:     null,      // The anonymous SC.View in the iframe that is used to render the template.

  lastOutputViewIframeChanged: function() {
    var lastOutputView = this.get('lastOutputView');

    if (!lastOutputView) return;

    this.set('_window',    lastOutputView._window);
    this.set('_document',  lastOutputView._document);
    this.set('_SC',        lastOutputView._SC);
    this.set('_$',         lastOutputView._$);
    this.set('_view',      lastOutputView._view);

  }.observes('.lastOutputView.iframeIsLoaded')

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
        aceId  = viewId + '-ace-editor',
        self = this;

    this.$aceEditor = this.$('.ace-editor');
    this.$aceEditor.attr('id', aceId);

    this.set('aceEditor', Learn.ace.edit(aceId));
    this.setMode();
    this.setEditorStyle();
    // Turns out you need to do this last, or else the initialization of the *other* ace editor somehow messes up the
    // calculation of this.$().width() and this.$().height() (They report the wrong values during initEditor, only
    // reporting the correct values after a wall clock delay; this results in our editor being incorrectly sized.)
    this.resizeAceEditorDiv();

    this.get('aceEditor').getSession().on('change', function () { self.editorTextDidChange(); });
  },

  resizeAceEditorDiv: function() {
    this.$aceEditor.css({ height: this.$().height() - 2, width: this.$().width() - 2 });
  },

  resize: function(evt) {
    this.resizeAceEditorDiv();
    this.get('aceEditor').resize();
  },

  setMode: function(mode) {
    var AceMode;

    mode = mode || this.get('MODE');
    AceMode = Learn.aceRequire(mode).Mode;
    // NOTE the following line throws exceptions in FF3.6. A workaround is to use a for..in loop to delete properties
    // added to Array.prototype by Sproutcore, then call setMode as below, then restore Array.prototype's properties in
    // the subsequent line. Another solution might be to run the ace editor in its own iframe.
    this.get('aceEditor').getSession().setMode(new AceMode());
    this.set('AceMode', AceMode);
  },

  // Hook for updating editor style as desired.
  setEditorStyle: function() {
    var editor =  this.get('aceEditor'),
        session = editor.getSession();

    editor.setHighlightActiveLine(false);
    editor.renderer.setHScrollBarAlwaysVisible(false);
    // FIXME: We're just manhandling the vertical scrollbar for now; a better solution would be to implement
    // setVScrollBarAlwaysVisible in Ace.
    // See: http://groups.google.com/group/ace-discuss/browse_thread/thread/8b191d3324264bb9/786026290fdd8e46
    this.$('.ace_sb').hide();
    editor.renderer.setShowPrintMargin(false);
    editor.renderer.setShowGutter(false);
    session.setUseSoftTabs(true);
    session.setTabSize(2);
  },

  // Handle 2-way sync
  codeDidChange: function() {
    var aceEditor = this.get('aceEditor'),
        code = this.get('code');

    if (aceEditor && code !== this._codeFromEditor) {
      this._codeFromUpdate = code;
      aceEditor.getSession().setValue(code);
    }
  }.observes('code', 'aceEditor'),

  editorTextDidChange: function() {
    var aceEditor = this.get('aceEditor'),
        code;

    if (aceEditor) {
      code = aceEditor.getSession().getValue();
      if (code !== this._codeFromUpdate) {
        this._codeFromEditor = code;
        this.set('code', code);
      }
    }
  }

});


Learn.JsEditorView = Learn.EditorView.extend({
  MODE: 'ace/mode/javascript',
  codeBinding: 'Learn.sampleCodeController.code'
});


Learn.TemplateEditorView = Learn.EditorView.extend({
  MODE: 'ace/mode/html',
  codeBinding: 'Learn.sampleCodeController.template'
});


Learn.OutputView = SC.View.extend({
  templateName: 'learn-sproutcore/~templates/output-view',

  codeBinding:           'Learn.sampleCodeController.code',
  templateStringBinding: 'Learn.sampleCodeController.template',

  isHidden:          true,
  iframeIsLoaded:    false,
  iframeHasRendered: false,
  _window:           null,
  _document:         null,
  _$:                null,
  _SC:               null,
  _view:             null,

  _renderAfterLoad:  false,

  didInsertElement: function() {
    var self = this;
    this.$('.output-iframe').load(function() { self.iframeDidLoad(this); });
  },

  iframeDidLoad: function(iframeElem) {
    var _window = iframeElem.contentWindow;

    this.set('_document', iframeElem.contentDocument);
    this.set('_window', _window);
    this.set('_$', _window.$);
    this.set('_SC', _window.SC);
    this.set('_view', _window.eval("SC.View.create().append();"));

    if (this._renderAfterLoad) {
      this.renderIframeContents();
      this._renderAfterLoad = false;
    }

    this.set('iframeIsLoaded', true);
  },

  reloadIframe: function() {
    this._window.location.reload();

    this.set('_document', null);
    this.set('_window', null);
    this.set('_$', null);
    this.set('_SC', null);
    this.set('_view', null);

    this.set('iframeHasRendered', false);

    // Finally, let the world know these properties have changed.
    this.set('iframeIsLoaded', false);
  },

  run: function() {
    Learn.set('lastOutputView', this);

    if (this.get('iframeHasRendered')) {
      this._renderAfterLoad = true;
      this.reloadIframe();
    }
    else if (this.get('iframeIsLoaded')) {
      this.renderIframeContents();
    }

    this.set('isHidden', false);
  },

  renderIframeContents: function() {
    this.appendCode();
    this.renderTemplate();
    this.set('iframeHasRendered', true);
  },

  renderTemplate: function() {
    this._view.set('template', this._SC.Handlebars.compile(this.get('templateString')));
    this._view.rerender();
  },

  appendCode: function() {
    // http://stackoverflow.com/questions/610995/jquery-cant-append-script-element/3603496#3603496
    var script = this._document.createElement('script');
    script.type = 'text/javascript';
    script.text = this.get('code');
    this._document.body.appendChild(script);
  },

  rerunButton: SC.Button.extend({
    disabledBinding: SC.Binding.not('parentView.iframeHasRendered'),
    click: function() {
      this.get('parentView').run();
    }
  }),

  helpButton: SC.Button.extend({
    disabled: true
  })

});


Learn.RunButton = SC.Button.extend({
  click: function () {
    var outputViewId = this.$().parents('p').nextAll('.output-view:first').attr('id');
    if (outputViewId) {
      SC.View.views[outputViewId].run(this);
      this.set('disabled', true);
    }
  }
});


Learn.HelpButton = SC.Button.extend({
    // TODO
    disabled: true
});
