/*globals Learn */
require('sproutcore');

Learn = SC.Application.create({
  VERSION: require('learn-sproutcore/~package').version,
  editor:  null
});

$(function () {
  var editor = Learn.ace.edit('ace'),
      JsMode;

  Learn.set('editor', editor);
  JsMode = Learn.aceRequire("ace/mode/javascript").Mode;
  editor.getSession().setMode(new JsMode());
});
