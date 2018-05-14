/**
 * Copyright (c) 2014, 2018, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/*
 * Your customer ViewModel code goes here
 */
define(['ojs/ojcore', 'knockout', 'jquery', 'ojs/ojarraydataprovider'],
  function (oj, ko, $) {

    // To-Do : ModuleBinding 정리 필요.
    // Change the default location for the viewModel and view files
    //j.ModuleBinding.defaults.modelPath = 'viewModels/tasks/';
    //oj.ModuleBinding.defaults.viewPath = 'text!views/tasks/';
    function InstancesViewModel() {
      var self = this;

      // router 초기화
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
        // 이미 생성했으면, 패스
        if (self.router) {
          // 상단 네비게이션 이동시에만 동작.
          self.currentModule("openInstance");
          return;
        }

        // Tasks의 하위 라우터 생성
        var parentRouter = info.valueAccessor().params['ojRouter']['parentRouter'];
        self.router = parentRouter.getChildRouter('instance');

        self.router = parentRouter.createChildRouter('instance')
            .configure(
              {
                'openInstance': { label: 'Open Instance', isDefault: true },
                'closeInstance': { label: 'Close Instance' }
              });

        //URL과 동기화
        oj.Router.sync();
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

      // 이건 모였는지 기억이....
      var lgQuery = oj.ResponsiveUtils.getFrameworkQuery(oj.ResponsiveUtils.FRAMEWORK_QUERY_KEY.LG_UP);
      self.large = oj.ResponsiveKnockoutUtils.createMediaQueryObservable(lgQuery);

      // To-Do : Module 정리
      self.currentModule = ko.observable("openInstance");
 
      self.modulePath = ko.pureComputed(
        function () {
          var name = self.currentModule();

          return (name === 'oj:blank' ? name : "instances/" + name);
        }
      );

      // To-Do :  createChildRouter 정리 (Root 에서 만들어진 Child(This)에 대해서 navData 생성)
      // Navigation setup
      var instancesNavData = [
        {
          name: 'Open Instance', id: 'openInstance',
          iconClass: 'oj-navigationlist-item-icon demo-icon-font-24 demo-chart-icon-24'
        },
        {
          name: 'Close Instance', id: 'closeInstance',
          iconClass: 'oj-navigationlist-item-icon demo-icon-font-24 demo-fire-icon-24'
        }
      ];

      self.dataSource = new oj.ArrayDataProvider(instancesNavData, {
        idAttribute: 'id'
      });

      self.selectHandler = function (event) {
        if ('instanceMenu' === event.target.id && event.detail.originalEvent) {
          //self.router.go(event.detail.key); 라우터는 동일한 페이지에서 이동할 때 사용하는 듯...
          self.currentModule(event.detail.key);
        }
      };
    }

    /*
     * Returns a constructor for the ViewModel so that the ViewModel is constructed
     * each time the view is displayed.  Return an instance of the ViewModel if
     * only one instance of the ViewModel is needed.
     */
    return new InstancesViewModel();
  }
);