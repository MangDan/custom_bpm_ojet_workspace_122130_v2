/**
 * Copyright (c) 2014, 2018, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/*
 * Your about ViewModel code goes here
 */
define(['ojs/ojcore', 'knockout', 'jquery', 'services/taskQueryService', 'ojs/ojlistview', 'ojs/ojmodel', 'ojs/ojcollapsible', 'ojs/ojpagingcontrol', 'ojs/ojcollectiontabledatasource', 'ojs/ojpagingtabledatasource', 'ojs/ojselectcombobox'],
  function (oj, ko, $, taskQueryService) {
    var taskListViewModel = function (params) {
      var self = this;
      
      self.handleActivated = function (info) {
        // Implement if needed
        self.listTask();
      };

      oj.Logger.info(obpmConfig.serverurl, obpmConfig.resturi, obpmConfig.adminuser, obpmConfig.adminpw);

      var lgQuery = oj.ResponsiveUtils.getFrameworkQuery(
        oj.ResponsiveUtils.FRAMEWORK_QUERY_KEY.LG_UP);

      self.large = oj.ResponsiveKnockoutUtils.createMediaQueryObservable(lgQuery);
      
      self.pageSize = ko.observable(10);
      self.taskOrder = ko.observable("title");
      self.searchTitle = ko.observable();
      self.taskId = ko.observable(20000);
      self.listTaskDataSource = ko.observable();
      self.listTaskCol = ko.observable();
      self.mdContainerHeight = 425;
      self.lgContainerHeight = 505;

      self.contentHeight = ko.computed(function(){
        return params.contentHeight();
      });

      self.handleSortCriteriaChanged = function (event, ui) {
        self.listTask();
      };

      // "count":5,
      // "hasMore":true,
      // count, hasMore, items => 표준 Json Type인 듯...
      // 이와 같은 스타일일 경우에는 paging이 자동으로 이뤄짐...

      self.listTaskQueryURL = ko.computed(function () {
        return taskQueryService.listTaskQueryURL("?" + params.query + "&orderBy=" + self.taskOrder() + ":desc");
      });

      oj.Logger.info("tasks query parameter : " + params.query);

      self.listTask = function () {
        self.listTaskCol(taskQueryService.listTaskCol(self.listTaskQueryURL(), self.pageSize()));

        self.listTaskDataSource(new oj.PagingTableDataSource(new oj.CollectionTableDataSource(self.listTaskCol())));
      };

      self.gotoTaskDetail = function (event) {
        var id = event.detail.value;

        oj.Logger.info("id:" + id);

        if (id != null) {
          params.taskId(id);
          params.contentHeight(params.contentHeight());
          params.currentTaskModule("detail");
        }
      };
    }

    /*
     * Returns a constructor for the ViewModel so that the ViewModel is constructed
     * each time the view is displayed.  Return an instance of the ViewModel if
     * only one instance of the ViewModel is needed.
     */
    return taskListViewModel;
  }
);