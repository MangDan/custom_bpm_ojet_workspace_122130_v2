/**
 * Copyright (c) 2014, 2018, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/*
 * Your about ViewModel code goes here
 */
define(['ojs/ojcore', 'knockout', 'jquery', 'ojs/ojchart'],
  function (oj, ko, $) {

    function TotalTaskChartViewModel() {
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
        console.log("ajax reload..");
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

      self.barSeriesValue = ko.observableArray();
      self.barGroupsValue = ko.observableArray();
      self.legendSectionsValue = ko.observableArray();

      var data1 = [{
          name: 'Coke',
          value: 42
        },
        {
          name: 'Fanta',
          value: 55
        },
        {
          name: 'Sprite',
          value: 36
        },
        {
          name: 'Dr Pepper',
          value: 22
        },
        {
          name: 'Pepsi',
          value: 12
        },
        {
          name: 'Pepsi',
          value: 12
        },
        {
          name: 'Pepsi',
          value: 12
        }
      ];

      /* Returns bar series array based on provided data and colorHandler */
      var getBarSeries = function (data, colorHandler) {
        var items = [];
        for (var i = 0; i < data.length; i++) {
          items.push({
            value: data[i].value,
            text: data[i].name,
            color: colorHandler.getValue(data[i].name),
          });
        }
        return [{
          items: items
        }];
      };

      /* Returns bar groups array based on provided data */
      getBarGroups = function (data) {
        var groups = [];
        for (var i = 0; i < data.length; i++) {
          groups.push(data[i].name);
        }
        return groups;
      };

      self.yAxis = ko.pureComputed(function () {
        return {
          rendered: "off",
          majorTick: {
            lineWidth: 0
          }
        };
      });

      /* chart style defaults */
      self.styleDefaults = ko.pureComputed(function () {
        return {
          barGapRatio: 0.1
        };
      });

      var colorHandler = new oj.ColorAttributeGroupHandler();
      self.barSeriesValue(getBarSeries(data1, colorHandler));
      self.barGroupsValue(getBarGroups(data1));

    }

    /*
     * Returns a constructor for the ViewModel so that the ViewModel is constructed
     * each time the view is displayed.  Return an instance of the ViewModel if
     * only one instance of the ViewModel is needed.
     */
    return new TotalTaskChartViewModel();
  }
);