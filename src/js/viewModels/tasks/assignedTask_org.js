/**
 * Copyright (c) 2014, 2018, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/*
 * Your about ViewModel code goes here
 */
define(['ojs/ojcore', 'knockout', 'jquery', 'ojs/ojmodel', 'ojs/ojtable', 'ojs/ojcollectiontabledatasource', 'ojs/ojpagingcontrol', 'ojs/ojpagingtabledatasource', 'ojs/ojarraytabledatasource', 'ojs/ojmodule', 'ojs/ojbutton', 'ojs/ojdialog', 'ojs/ojmenu', 'ojs/ojoption', 'ojs/ojcollapsible'],
  function (oj, ko, $) {
    function AssignedTaskViewModel() {
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
        $('#taskDetailDialogLink').click(function(event){
          alert('Sign new href executed.'); 
        }); 

        taskListByAjax();
      }
      );

      self.refresh = function(event) {
        console.log("refresh");
        taskListByAjax();
      };

      var userToken = sessionStorage.getItem("userToken");
      self.pagingDatasource = ko.observable();
      self.taskListArray = ko.observableArray();
      self.selectedTaskId = ko.observable();
      self.instanceTitle = ko.observable();
      self.processAuditDiagram = ko.observable();
      self.instanceTitle = ko.observable();

      taskListByAjax = function (status, limit, offset) {
        var taskListArray = [];
        $.ajax({
          type: "GET",
          url: obpmConfig.serverurl + obpmConfig.resturi + "tasks?status=ASSIGNED&orderBy=number:desc",
          cache: false,
          headers: {
            Authorization: "Basic " + userToken
          },
          success: function (data) {
            //console.log(JSON.stringify(data));
            taskListArray.push(data.tasks);
            self.pagingDatasource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(taskListArray[0], { idAttribute: 'number' })));
          },
          error: function () {
            console.log("Get tasklist failed.");
          }
        });
      };
      
      self.taskDetailDialogLink = function (data, event) {
        console.log(data.number);
        if (data.number !== undefined) {
          // Open Task Detail...
          var taskId = data.number;
          //console.log(event.detail);;
          self.taskId(taskId);

          // Task Detail.
          self.taskDetailByAjax(taskId);
          document.querySelector("#taskDetailDialog").open();
        }
      }

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
        //console.log(data);
        if (data.shortSummary === undefined)
          return;

        self.instanceTitle(data.longSummary);
        var processId = data.shortSummary.substring(data.shortSummary.indexOf(":")+1);

        //var processId = data.shortSummary.substring(data.shortSummary.indexOf(":")+1);
        //self.instanceTitle(data.title);
        self.processId(processId);

        // Module 공통화 (아래와 같이 세팅하고 실행하면 해당 모듈이 로드되는 구조.)
        var loadModuleConfig = {
          'modules': [{ 'title': 'Process Map', 'name': 'processTrackingIframe', 'params': { 'processId': processId } },
          { 'title': 'Activity History', 'name': 'activityHistory', 'params': { 'processId': processId } }]
        };

        //console.log(loadModuleConfig);
        self.loadTrackingModule(loadModuleConfig);

        document.querySelector("#instanceAuditDiagramDialog").open();
      };

      self.processId = ko.observable();
      self.taskId = ko.observable();
      self.taskTitle = ko.observable();
      self.receiptTitle = ko.observable();
      self.receiptDate = ko.observable();
      self.receiptContent = ko.observable();
      self.receiptor = ko.observable();
      self.inspector = ko.observable();
      self.receiptType = ko.observable("1");
      self.description = ko.observable();
      self.taskAction = ko.observable("OK");
      self.taskActorToken = ko.observable();
      self.businessKey = ko.observable();
      self.judgeConsignment = ko.observable("Y");
      self.causeConstruction = ko.observable("Y");
      self.investmentReview = ko.observable("Y");
      self.publicPriceRequired = ko.observable("Y");
      self.autoDesign = ko.observable("Y");
      self.processingType = ko.observable("단순이설");
      self.constructionType = ko.observable("인입선로");
      self.barcodeEquipment = ko.observable("Y");
      self.preparationCompletionDrawing = ko.observable("Y");
      self.makeremoveMaterials = ko.observable("Y");
      self.customField1 = ko.observable();
      self.customField2 = ko.observable();
      self.customField3 = ko.observable();

      self.actionItems = ko.observableArray([]);
      self.taskDetailByAjax = function (taskId) {
        $.ajax({
          type: "GET",
          url: obpmConfig.serverurl + obpmConfig.resturi + "tasks/" + taskId,
          cache: false,
          headers: {
            Authorization: "Basic " + userToken
          },
          success: function (data) {
            var actionCode, actionTitle;
            
            //console.log(JSON.stringify(data));
            self.actionItems().length = 0;

            if(data.title.startsWith("작업완료처리") > 0 || data.title.startsWith("준공서류등록") > 0) {
              self.actionItems.push({id: "OK", label: "처리", disabled: false});
            } else if(data.title.startsWith("정산확인") > 0) {
              self.actionItems.push({id: "APPROVE", label: "승인", disabled: false});
              self.actionItems.push({id: "REJECT", label: "반려", disabled: false});
            } else {
              if(data.availableActions.length > 0) {
                for(var i=0; i < data.availableActions.length; i++) {
                  if(data.availableActions[i].actionType === "Custom") {
                    
                    actionCode = data.availableActions[i].href.substring(data.availableActions[i].href.indexOf("=")+1);
                    actionTitle = data.availableActions[i].title;
                    self.actionItems.push({id: actionCode, label: actionTitle, disabled: false});
                    
                    console.log("actionCode:actionTitle="+actionCode+":"+actionTitle);
                    
                  }
                }
              }
            }

            //console.log(data.title);
            self.taskTitle("[TOSS]" + data.title); // 안찍힘..
          },
          error: function () {
            console.log("Get tasklist failed.");
          }
        });

        $.ajax({
          type: "GET",
          url: obpmConfig.serverurl + obpmConfig.resturi + "tasks/" + taskId + "/summaryField",
          cache: false,
          headers: {
            Authorization: "Basic " + userToken
          },
          success: function (data) {
            //console.log(JSON.stringify(data));
            self.taskId(self.taskId()); // BPM에서 TaskID 매핑 X (Param에서 받음.)
            self.taskAction(self.taskAction());
            self.taskActorToken(data.summaryFields[2].value);
            self.businessKey(data.summaryFields[3].value);
            self.receiptTitle(data.summaryFields[4].value);
            self.receiptContent(data.summaryFields[5].value);
            self.receiptDate(data.summaryFields[6].value);
            self.receiptor(data.summaryFields[7].value);
            self.inspector(data.summaryFields[8].value);
            self.receiptType((data.summaryFields[9].value == 1 ? "지장이설 접수" : "한전위해개소등록"));
            self.description(data.summaryFields[10].value);
            self.judgeConsignment(data.summaryFields[11].value);
            self.causeConstruction(data.summaryFields[12].value);
            self.investmentReview(data.summaryFields[13].value);
            self.publicPriceRequired(data.summaryFields[14].value);
            self.autoDesign(data.summaryFields[15].value);
            self.processingType(data.summaryFields[16].value);
            self.constructionType(data.summaryFields[17].value);
            self.barcodeEquipment(data.summaryFields[18].value);
            self.preparationCompletionDrawing(data.summaryFields[19].value);
            self.makeremoveMaterials(data.summaryFields[20].value);
          },
          error: function () {
            console.log("Get tasklist failed.");
          }
        });
      };

      self.handleOKClose = function () {
        document.querySelector("#taskDetailDialog").close();
      };

      self.taskUpdateAndActionByAjax = function (action) {
        console.log(action);
        var requestJsonData = {
          "p_taskid": self.taskId(),
          "p_taskaction": action,
          "p_taskactortoken": "Basic " + userToken,
          "p_businesskey": self.businessKey(),
          "p_receipttitle": self.receiptTitle(),
          "p_receiptcontent": self.receiptContent(),
          "p_receiptdate": self.receiptDate(),
          "p_receiptor": self.receiptor(),
          "p_inspector": self.inspector(),
          "p_receipttype": self.receiptType(),
          "p_description": self.description(),
          "p_judgeconsignment": self.judgeConsignment(),
          "p_causeconstruction": self.causeConstruction(),
          "p_investmentreview": self.investmentReview(),
          "p_publicpricerequired": self.publicPriceRequired(),
          "p_autodesign": self.autoDesign(),
          "p_processingtype": self.processingType(),
          "p_constructiontype": self.constructionType(),
          "p_barcodeequipment": self.barcodeEquipment(),
          "p_preparationcompletiondrawing": self.preparationCompletionDrawing(),
          "p_makeremovematerials": self.makeremoveMaterials()
        };
        //console.log(JSON.stringify(requestJsonData));
        $.ajax({
          type: "POST",
          url: obpmConfig.ordsserverurl + obpmConfig.ordsresturi + "humantask/update_task_action",
          data: JSON.stringify(requestJsonData),
          contentType: "application/json",
          cache: false,
          success: function (data) {
            //console.log(data);
            setTimeout(function () {
              self.handleOKClose();
              //$(location).attr('href', "?root=tasks&task=assignedTask");
              self.refresh();
            }, 5000);
          },
          error: function () {
            console.log("Get tasklist failed.");
          }
        });

        // Module Refresh하는 방법이 없나? 이 방법말고....

      };

      self.submit = function (event) {
        console.log(event.currentTarget.id.substring(event.currentTarget.id.indexOf("_")+1));
        self.taskUpdateAndActionByAjax(event.currentTarget.id.substring(event.currentTarget.id.indexOf("_")+1));
        return true;
      };

      self.pagingtest = function (event) {
        console.log("pagingtest : ");
        var paging = $("#paging")[0];
        paging.nextPage();
      };







      //$("#").addEventListener('currentRowChanged', self.selectedTaskListener);

      // 나중에 연구해보자.... 페이징할때 데이터를 offset과 limit으로 추가하는 부분??
      //oj-table과 관련있을지도... 아래 참고..
      // http://www.oracle.com/webfolder/technetwork/jet/jetCookbook.html?component=table&demo=checkboxSelectableTable
      //http://www.oracle.com/webfolder/technetwork/jet/jetCookbook.html?component=listView&demo=selectionListView
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
    return new AssignedTaskViewModel();
  }
);
