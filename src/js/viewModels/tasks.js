/**
 * Copyright (c) 2014, 2018, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/*
 * Your customer ViewModel code goes here
 */
define(['ojs/ojcore', 'knockout', 'jquery', 'ojs/ojkeyset', 'ojs/ojbutton', 'ojs/ojoffcanvas'],
  function (oj, ko, $, keySet) {

    // To-Do : ModuleBinding 정리 필요.
    // Change the default location for the viewModel and view files
    //j.ModuleBinding.defaults.modelPath = 'viewModels/tasks/';
    //oj.ModuleBinding.defaults.viewPath = 'text!views/tasks/';
    function TasksViewModel() {
      var self = this;

      let default_page = "assignedTask";
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
          self.currentModule(default_page);
          return;
        }

        // Tasks의 하위 라우터 생성
        var parentRouter = info.valueAccessor().params['ojRouter']['parentRouter'];
        self.router = parentRouter.getChildRouter('task');

        self.router = parentRouter.createChildRouter('task')
          .configure({
            'assignedTask': {
              label: 'Assigned Task',
              isDefault: true
            },
            'completedTask': {
              label: 'Completed Task'
            },
            'managedTask': {
              label: 'Managed Task'
            },
            'taskDetail/{taskId}': {
              label: 'Task Detail'
            },
            'startTask1': {
              label: 'Start Task1'
            },
            'startTask2': {
              label: 'Start Task2'
            },
            'startTask3': {
              label: 'Start Task3'
            }
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

      // Responsible (Menu...)
      var lgQuery = oj.ResponsiveUtils.getFrameworkQuery(oj.ResponsiveUtils.FRAMEWORK_QUERY_KEY.LG_UP);
      self.large = oj.ResponsiveKnockoutUtils.createMediaQueryObservable(lgQuery);

      // offcanvas code
      self.infoEndDrawer = {
        "edge": "end",
        "displayMode": "overlay",
        "selector": "#infoEndDrawer",
        "content": "#taskMainContent"
      };

      self.expanded = new keySet.ExpandedKeySet(['taskList']);

      self.toggleEnd = function () {
        self._toggleOpenClose();
      }

      self.handleAttached = function(info) {
        oj.OffcanvasUtils.setupResponsive(self.infoEndDrawer);
      }

      self.closeEnd = function () {
        return oj.OffcanvasUtils.close(self.infoEndDrawer);
      };

      self.isOffcanvasOpen = function (offcanvas) {
        return $(offcanvas.selector).hasClass("oj-offcanvas-open");
      }

      self._toggleOpenClose = function () {
        if (self.isOffcanvasOpen(self.infoEndDrawer)) {
          return oj.OffcanvasUtils.close(self.infoEndDrawer);
        } else {
          return oj.OffcanvasUtils.open(self.infoEndDrawer);
        }
      }
      // offcanvas code end
      
      // Menu에서 Item 선택만 가능하도록...
      self.itemOnly = function (context) {
        return context['leaf'];
      };

      // To-Do : Module 정리
      // Routing은 Redirect 개념이고, Module은 Iframe과 비슷한 기능으로 보면 됨.
      // Routing은 Child Route 정의후 Module의 Configure안에서 Route Name으로 Module에 Attach가 가능.
      self.currentModule = ko.observable(default_page);

      self.modulePath = ko.pureComputed(
        function () {
          var name = self.currentModule();

          return (name === 'oj:blank' ? name : "tasks/" + name);
        }
      );

      // To-Do :  createChildRouter 정리 (Root 에서 만들어진 Child(This)에 대해서 navData 생성)
      // Navigation setup
      self.tasksNavItems = [{
        label: 'Task List',
        id: 'taskList',
        iconStyleClass: 'oj-navigationlist-item-icon demo-icon-font-24 demo-fire-icon-24',
        children: [{
          id: "assignedTask",
          label: "Assigned Task",
          iconStyleClass: "oj-navigationlist-item-icon demo-catalog-icon-24 demo-icon-font-24"
        }, {
          id: "completedTask",
          label: "Completed Task",
          iconStyleClass: "oj-navigationlist-item-icon demo-catalog-icon-24 demo-icon-font-24"
        }, {
          id: "managedTask",
          label: "Managed Task",
          iconStyleClass: "oj-navigationlist-item-icon demo-catalog-icon-24 demo-icon-font-24"
        }]
      },{
        label: 'Start Task',
        id: 'startTask',
        iconStyleClass: 'oj-navigationlist-item-icon demo-icon-font-24 demo-fire-icon-24',
        children: [{
          id: "startTask1",
          label: "Start Task1",
          iconStyleClass: "oj-navigationlist-item-icon demo-catalog-icon-24 demo-icon-font-24"
        }, {
          id: "startTask2",
          label: "Start Task2",
          iconStyleClass: "oj-navigationlist-item-icon demo-catalog-icon-24 demo-icon-font-24"
        }, {
          id: "startTask3",
          label: "Start Task3",
          iconStyleClass: "oj-navigationlist-item-icon demo-catalog-icon-24 demo-icon-font-24"
        }]
      }];

      self.selectHandler = function (event) {
        if ('taskMenu' === event.target.id && event.detail.originalEvent) {
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
    return new TasksViewModel();
  }
);