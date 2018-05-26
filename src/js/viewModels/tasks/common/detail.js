/**
 * Copyright (c) 2014, 2018, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/*
 * Your about ViewModel code goes here
 */
define(['ojs/ojcore', 'knockout', 'jquery', , 'ojs/ojbutton', 'ojs/ojcomposite', 'jet-composites/task-detail-component/loader'],
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
    }

    /*
     * Returns a constructor for the ViewModel so that the ViewModel is constructed
     * each time the view is displayed.  Return an instance of the ViewModel if
     * only one instance of the ViewModel is needed.
     */
    return taskDetailViewModel;
  }
);