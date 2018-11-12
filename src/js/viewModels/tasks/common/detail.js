/**
 * Copyright (c) 2014, 2018, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/*
 * Your about ViewModel code goes here
 */
define(['ojs/ojcore', 'knockout', 'jquery', , 'ojs/ojbutton', 'ojs/ojcomposite', 'ojs/ojdialog', 'ojs/ojdefer', 'jet-composites/task-detail-component/loader', 'jet-composites/ojet-fileupload-component/loader'],
  function (oj, ko, $) {
    var taskDetailViewModel = function (params) {
      var self = this;

      oj.Logger.info(obpmConfig.serverurl, obpmConfig.resturi, obpmConfig.adminuser, obpmConfig.adminpw);

      var lgQuery = oj.ResponsiveUtils.getFrameworkQuery(
        oj.ResponsiveUtils.FRAMEWORK_QUERY_KEY.LG_UP);

      self.large = oj.ResponsiveKnockoutUtils.createMediaQueryObservable(lgQuery);

      self.taskId = ko.observable(params.taskId());
      self.contentHeight = ko.computed(function () {
        return params.contentHeight();
      });

      self.gotoTaskList = function (event) {
        params.currentTaskModule("list");
      };

      self.taskDetailExpandCollapseIcon = ko.observableArray(['oj-panel-expand-icon']);
      self.expandTaskDetail = function (event) {

        var popup = document.querySelector('#taskDetailModalDialog');
        popup.open();

        self.taskDetailExpandCollapseIcon.replace('oj-panel-expand-icon', 'oj-panel-collapse-icon');
      };

      self.collapseTaskDetail = function (event) {

        var popup = document.querySelector('#taskDetailModalDialog');
        popup.close();

        self.taskDetailExpandCollapseIcon.replace('oj-panel-collapse-icon', 'oj-panel-expand-icon');
      };

      self.taskActionListener = function(event) {
        params.currentTaskModule("list");
      };
    }

    /*
     * Returns a constructor for the ViewModel so that the ViewModel is constructed
     * each time the view is displayed.  Return an instance of the ViewModel if
     * only one instance of the ViewModel is needed.
     */
    return taskDetailViewModel;
  }
);