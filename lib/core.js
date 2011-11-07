/*globals Learn */
require('sproutcore');

Learn = SC.Application.create({
  VERSION: require('learn-sproutcore/~package').version,
  editor:  null
});

Learn.EditorView = SC.View.extend({
  didInsertElement: function() {
    this.aceEditor = Learn.ace.edit(this.$()[0].id);
    this.JsMode    = Learn.aceRequire("ace/mode/javascript").Mode;
    this.aceEditor.getSession().setMode(new this.JsMode());

    Learn.editorView = this;
  }
});
