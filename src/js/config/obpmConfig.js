var obpmConfig = {};

define(['ojs/ojcore', 'knockout', 'jquery'],
  function(oj, ko, $) {
    $.getJSON('../../resources/bpmconfig.json', function(data) {
      obpmConfig = data;
    });
});