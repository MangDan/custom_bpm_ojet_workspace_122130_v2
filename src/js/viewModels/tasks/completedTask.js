/**
 * Copyright (c) 2014, 2018, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/*
 * Your about ViewModel code goes here
 */
define(['ojs/ojcore', 'knockout', 'jquery', 'ojs/ojlistview', 'ojs/ojmodel', 'ojs/ojmoduleanimations', 'ojs/ojcollapsible', 'ojs/ojpagingcontrol', 'ojs/ojcollectiontabledatasource', 'ojs/ojpagingtabledatasource', 'ojs/ojselectcombobox'],
  function (oj, ko, $) {
    function CompletedTaskViewModel() {
      var self = this;

      self.router;
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

      let default_module = "list";

      self.currentTaskModule = ko.observable(default_module);
      self.taskId = ko.observable();
      self.contentHeight = ko.observable("calc(100vh - 620px)");

      self.modulePath = ko.pureComputed(
        function () {
          return ('tasks/common/' + self.currentTaskModule());
        }
      );

      self.switcherCallback = function (context) {
        if(self.currentTaskModule() === 'list')
          return 'navParent';
        else
          return 'navChild';
      };

      taskExpandHandler = function(event) {
        oj.Logger.info("expand:" + event.target.id);
        if(event.target.id === "my-task-performance") {
          self.contentHeight("calc(100vh - 620px)");
        }
      };

      taskCollapseHandler = function(event) {
        oj.Logger.info("collapse:" + event.target.id);
        if(event.target.id === "my-task-performance") {
          self.contentHeight("calc(100vh - 425px)");
        }
      };
      // not used
      self.moduleConfig = ko.pureComputed(function () {
        var mc = self.router.observableModuleConfig();
        var name = mc.name();
        /*
         * Create a module config from the router's observableModuleConfig
         * so that our module can access the observable state parameters.
         */
        var config = {};
        var key;
        for (key in mc) {
          if (mc.hasOwnProperty(key)) {
            config[key] = mc[key];
          }
        }
        config.name = 'tasks/common/' + name;
        return config;
      });
    }

    /*
     * Returns a constructor for the ViewModel so that the ViewModel is constructed
     * each time the view is displayed.  Return an instance of the ViewModel if
     * only one instance of the ViewModel is needed.
     */
    return new CompletedTaskViewModel();
  }
);