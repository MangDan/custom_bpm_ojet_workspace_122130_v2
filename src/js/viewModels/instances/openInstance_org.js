/**
 * Copyright (c) 2014, 2018, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/*
 * Your about ViewModel code goes here
 */
define(['ojs/ojcore', 'knockout', 'jquery', 'ojs/ojmodule-element-utils', 'ojs/ojmodule-element', 'obpmConfig', 'ojs/ojmodel', 'ojs/ojtable', 'ojs/ojcollectiontabledatasource', 'ojs/ojpagingcontrol', 'ojs/ojpagingtabledatasource', 'ojs/ojarraytabledatasource', 'ojs/ojmodule', 'ojs/ojbutton', 'ojs/ojdialog', 'ojs/ojcollapsible'],
  function (oj, ko, $, moduleUtils) {
    function OpenInstanceViewModel() {
      var self = this;
      // Below are a subset of the ViewModel methods invoked by the ojModule binding
      // Please reference the ojModule jsDoc for additional available methods.

      /**
       * Optional ViewModel method invoked when this ViewModel is about to be
       * used for the View transition.  The application can put data fetch logic
       * here that can return a Promise which will delay the handleAttached function
       * call below until the Promise is resolved.
       * @param {Object} info - An object with the following key-value pairs:
       * @param {Node} info.element - DOM element or where the binding is attached. This may be a 'virtual' element (comment node).
       * @param {Function} info.valueAccessor - The binding's value accessor.
       * @return {Promise|undefined} - If the callback returns a Promise, the next phase (attaching DOM) will be delayed until
       * the promise is resolved
       */
      self.handleActivated = function (info) {
        // Implement if needed
      };

      /**
       * Optional ViewModel method invoked after the View is inserted into the
       * document DOM.  The application can put logic that requires the DOM being
       * attached here.
       * @param {Object} info - An object with the following key-value pairs:
       * @param {Node} info.element - DOM element or where the binding is attached. This may be a 'virtual' element (comment node).
       * @param {Function} info.valueAccessor - The binding's value accessor.
       * @param {boolean} info.fromCache - A boolean indicating whether the module was retrieved from cache.
       */
      self.handleAttached = function (info) {
        // Implement if needed
      };


      /**
       * Optional ViewModel method invoked after the bindings are applied on this View. 
       * If the current View is retrieved from cache, the bindings will not be re-applied
       * and this callback will not be invoked.
       * @param {Object} info - An object with the following key-value pairs:
       * @param {Node} info.element - DOM element or where the binding is attached. This may be a 'virtual' element (comment node).
       * @param {Function} info.valueAccessor - The binding's value accessor.
       */
      self.handleBindingsApplied = function (info) {
        // Implement if needed
      };

      /*
       * Optional ViewModel method invoked after the View is removed from the
       * document DOM.
       * @param {Object} info - An object with the following key-value pairs:
       * @param {Node} info.element - DOM element or where the binding is attached. This may be a 'virtual' element (comment node).
       * @param {Function} info.valueAccessor - The binding's value accessor.
       * @param {Array} info.cachedNodes - An Array containing cached nodes for the View if the cache is enabled.
       */
      self.handleDetached = function (info) {
        // Implement if needed
      };

      oj.Logger.info(obpmConfig.serverurl, obpmConfig.resturi, obpmConfig.adminuser, obpmConfig.adminpw);

      $(document).ready(function () {
        instanceListByAjax();
      }
      );

      self.refresh = function (event) {
        console.log("refresh");
        instanceListByAjax();
      };

      var userToken = sessionStorage.getItem("userToken");
      self.pagingDatasource = ko.observable();
      self.instanceListArray = ko.observableArray();
      self.selectedinstanceId = ko.observable();
      self.processId = ko.observable();
      self.instanceTitle = ko.observable();

      instanceListByAjax = function (status, limit, offset) {
        var instanceListArray = [];
        $.ajax({
          type: "GET",
          url: obpmConfig.serverurl + obpmConfig.resturi + "processes?processState=OPEN&orderBy=processId:desc",
          cache: false,
          headers: {
            Authorization: "Basic " + btoa("weblogic:welcome1")
          },
          success: function (data) {
            instanceListArray.push(data.items);
            self.pagingDatasource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(instanceListArray[0], { idAttribute: 'processId' })));
          },
          error: function () {
            console.log("Get instance List failed.");
          }
        });
      };

      // Process Tracking PoPup (Load Module 공통으로 사용 가능.. 나중에 모듈화..)
      self.loadTrackingModule = function (loadModuleConfig) {
        var divId = self.counter++;
        var moduleConfig;

        var instanceAuditTraceDiv = document.getElementById("instanceAuditTrace");

        // 기존 Node가 존재하면 삭제
        if (instanceAuditTraceDiv.childNodes.length > 0) {
          instanceAuditTraceDiv.removeChild(instanceAuditTraceDiv.childNodes[0]);
        }
        //

        var trackingModuleWrapperDiv = document.createElement('div');
        trackingModuleWrapperDiv.setAttribute('id', "trackingModuleWrapperDiv");

        for (var i = 0; i < loadModuleConfig.modules.length; i++) {
          //console.log(JSON.stringify(loadModuleConfig.modules[i].params));
          moduleConfig = "{" +
            "ojModule: {" +
            "name: 'instances/tracking/" + loadModuleConfig.modules[i].name + "'," +
            "params:" + JSON.stringify(loadModuleConfig.modules[i].params) +
            "}" +
            "}";

          var oj_collapsible = document.createElement('oj-collapsible');
          oj_collapsible.setAttribute('id', "collapsible_" + loadModuleConfig.modules[i].name + "_" + i);
          oj_collapsible.setAttribute('expanded', true);

          var header = document.createElement('h4');
          header.setAttribute('id', "h" + i);
          header.setAttribute('slot', "header");
          header.textContent = loadModuleConfig.modules[i].title;

          var moduleDiv = document.createElement('div');
          moduleDiv.setAttribute('id', loadModuleConfig.modules[i].name + "_" + i);
          moduleDiv.setAttribute('data-bind', moduleConfig);

          oj_collapsible.appendChild(header);
          oj_collapsible.appendChild(moduleDiv);

          trackingModuleWrapperDiv.appendChild(oj_collapsible);
        };

        instanceAuditTraceDiv.appendChild(trackingModuleWrapperDiv);
        ko.applyBindings(null, trackingModuleWrapperDiv); // 새로 만든 DIV로 바인딩...
      };

      self.reloadInstanceAuditDiagram = function (event) {
        // Module 공통화 (아래와 같이 세팅하고 실행하면 해당 모듈이 로드되는 구조.)
        var loadModuleConfig = {
          'modules': [{ 'title': 'Process Map', 'name': 'processTrackingIframe', 'params': { 'processId': self.processId() } },
          { 'title': 'Activity History', 'name': 'activityHistory', 'params': { 'processId': self.processId() } }]
        };
        self.loadTrackingModule(loadModuleConfig);
      };

      // Tracking Module Dialog 띄우기.
      self.instanceAuditDialog = function (data, event) {
        console.log(data);
        if (data.processId === undefined)
          return;

        //var processId = data.shortSummary.substring(data.shortSummary.indexOf(":")+1);
        self.instanceTitle(data.title);
        self.processId(data.processId);

        // Module 공통화 (아래와 같이 세팅하고 실행하면 해당 모듈이 로드되는 구조.)
        var loadModuleConfig = {
          'modules': [{ 'title': 'Process Map', 'name': 'processTrackingIframe', 'params': { 'processId': data.processId } },
          { 'title': 'Activity History', 'name': 'activityHistory', 'params': { 'processId': data.processId } }]
        };
        self.loadTrackingModule(loadModuleConfig);

        document.querySelector("#instanceAuditDiagramDialog").open();
      };

      // Tracking Module Dialog 띄우기.
      self.instanceAuditDialog2 = function (data, event) {
        console.log(data);
        if (data.processId === undefined)
          return;

        //var processId = data.shortSummary.substring(data.shortSummary.indexOf(":")+1);
        self.instanceTitle(data.title);
        self.processId(data.processId);

        // Module 공통화 (아래와 같이 세팅하고 실행하면 해당 모듈이 로드되는 구조.)
        var loadModuleConfig = {
          'modules': [{ 'title': 'Process Map', 'name': 'processTracking', 'params': { 'processId': data.processId } },
          { 'title': 'Activity History', 'name': 'activityHistory', 'params': { 'processId': data.processId } }]
        };
        self.loadTrackingModule(loadModuleConfig);

        document.querySelector("#instanceAuditDiagramDialog").open();
      };

      self.clickPaging = function (event) {
        var paging = $("#paging")[0];
        console.log(paging.page());
      };

    }

    /*
     * Returns a constructor for the ViewModel so that the ViewModel is constructed
     * each time the view is displayed.  Return an instance of the ViewModel if
     * only one instance of the ViewModel is needed.
     */
    return new OpenInstanceViewModel();
  }
);
