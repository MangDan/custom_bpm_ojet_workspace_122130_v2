/**
 * Copyright (c) 2014, 2017, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
define(['ojs/ojcore', 'knockout', 'ojs/ojknockout'],
function(oj, ko)
{
  function ProcessTrackingViewModel(params)
  {
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

      $(document).ready(function() {
        self.processAuditDiagramByAjax(params.processId);
      });

      oj.Logger.info(obpmConfig.serverurl, obpmConfig.resturi, obpmConfig.adminuser, obpmConfig.adminpw);

      var userToken = sessionStorage.getItem("userToken");
      self.processAuditDiagram = ko.observable();
      
      // JQuery AJAX로는 어떻게 하는지 모르겠음... 아래처럼 하니 됨..
      self.processAuditDiagramByAjax = function (processId) {
        // 동희샘이 만든 URL로 대체
        //
        //console.log("http://soabpm-vm:7003/BPMProcessMap/vPilot/BPMProcessMap.jsp?bpmnInstanceID="+processId);
        //$("#processAuditDiagram").attr("src", "http://soabpm-vm:7003/BPMProcessMap/vPilot/BPMProcessMap.jsp?bpmnInstanceID="+processId);
        //$("#box").html('<img src="'+src+'">');

        // 순수 JSON API만 사용할 경우 아래 코드 사용
        var image = document.images[0];
        var oReq = new XMLHttpRequest();
        oReq.open("GET", obpmConfig.serverurl + obpmConfig.resturi + "processes/" + params.processId + "/audit", true);
        oReq.responseType = "blob";
        oReq.setRequestHeader("Authorization", "Basic " + btoa("weblogic:welcome1"));
        oReq.onreadystatechange = function () {
          if (oReq.readyState == oReq.DONE) {
            var img = new Image(oReq.response);
            img.src = window.URL.createObjectURL(oReq.response);
            self.processAuditDiagram(img.src);

            // 이미지의 원본 사이즈를 알아야 함... 그래야 원본 그대로 출력이 됨.. 스크롤바와 함께..
          }
        }
        oReq.send();
      }
  }

  // Return constructor function
  return ProcessTrackingViewModel;
});