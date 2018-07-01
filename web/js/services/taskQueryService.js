/**
 * Copyright (c) 2014, 2018, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/*
 * Your about ViewModel code goes here
 */
define(['ojs/ojcore', 'knockout', 'jquery'],
  function (oj, ko, $) {

    function TaskQueryServiceModel() {
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

      self.listTaskQueryURL = function (param) {
        //return "resources/sample_tasks.json";
        return obpmConfig.resturi + "tasks";
      };

      self.taskDetailQueryURL = function (taskId) {
        //return "resources/sample_task_detail.json/" + context.properties.taskId;
        //return "resources/sample_task_detail.json";
        return obpmConfig.resturi + "tasks/"+taskId;
      };

      self.taskPayloadQueryURL = function (taskId) {
        //return "resources/sample_task_detail.json/" + context.properties.taskId;
        return obpmConfig.resturi + "tasks/"+taskId+"/summaryField";
      };

      self.taskCommentsURL = function (taskId) {
        //return "resources/sample_task_detail.json/" + context.properties.taskId;
        //return "resources/sample_task_comments.json";
        return obpmConfig.resturi + "tasks/"+taskId+"/comments";
      };

      self.taskAttachmentsURL = function (taskId) {
        //return "resources/sample_task_detail.json/" + context.properties.taskId;
        return obpmConfig.resturi + "tasks/"+taskId+"/attachments";
      };

      self.taskCommentCol = ko.observable();

      // Generate authorization headers to inject into rest calls
      function getHeaders (operation, collection, options) {
        var headers = {};

        //request['url'] = "http://daniel-kim-svr.iptime.org:7003/bpm/api/3.0/tasks";
        
        headers['headers'] = {};
        headers["headers"]["Authorization"] = "Basic "+sessionStorage.getItem("userToken");
        
        return headers;
      };

      self.taskModel = function (url) {
        var taskModel = oj.Model.extend({
          urlRoot: url,
          customURL: getHeaders,
          idAttribute: 'number'
        });
        return new taskModel();
      };

      self.listTaskCol = function (url, fetchSize) {
        var taskCollection = oj.Collection.extend({
          url: url,
          customURL: getHeaders,
          model: self.taskModel(),
          fetchSize: fetchSize
        });

        return new taskCollection();
      };

      self.taskSummaryPayloadModel = function (url) {
        var taskSummaryPayloadModel = oj.Model.extend({
          urlRoot: url,
          customURL: getHeaders
          //customURL: rootViewModel.getHeaders,
        });

        return new taskSummaryPayloadModel();
      };

      self.taskCommentModel = function (url) {
        var taskCommentModel = oj.Model.extend({
          urlRoot: url,
          customURL: getHeaders
        });
        return new taskCommentModel();
      };

      self.taskCommentCol = function (url) {
        var taskCommentCollection = oj.Collection.extend({
          url: url,
          customURL: getHeaders
          //customURL: rootViewModel.getHeaders,
        });

        return new taskCommentCollection();
      };

      self.taskAttachmentModel = function (url) {
        var taskAttachmentModel = oj.Model.extend({
          urlRoot: url,
          customURL: getHeaders
        });
        return new taskAttachmentModel();
      };

      self.taskAttachmentCol = function (url, fetchSize) {
        var taskAttachmentCollection = oj.Collection.extend({
          url: url,
          customURL: getHeaders,
          fetchSize: fetchSize
          //customURL: rootViewModel.getHeaders,
        });

        return new taskAttachmentCollection();
      };

      // wrapper function for HTTP POST
      self.uploadAttachment = function (url, content, contentType) {

        oj.Logger.info(url);
        oj.Logger.info(content);
        oj.Logger.info(contentType);

        var bytes = new Uint8Array(content.length);
        for (var i = 0; i < content.length; i++) {
          bytes[i] = content.charCodeAt(i);
        }

        return $.ajax({
          type: 'POST',
          url: url,
          cache: false,
          processData: false,
          data: bytes,
          contentType: contentType,
          beforeSend: function (xhr) {
            //xhr.setRequestHeader('Authorization', pcsUtil.getAuthInfo());
            //if (pcsUtil.isTestMode()) {
            //  xhr.setRequestHeader('pcs_mode', 'dev');
            //}
          },
          xhrFields: {
            withCredentials: true
          },
          xhr: function () {
            var jqXHR = null;
            if (window.ActiveXObject) {
              jqXHR = new window.ActiveXObject("Microsoft.XMLHTTP");
            }
            else {
              jqXHR = new window.XMLHttpRequest();
            }

            // 여기서 부터 ...... progress event를 done()과 같이 callback 할 수 있는지...
            // 실제로 업로드 해봐야 할 것 같음...
            if (jqXHR instanceof window.XMLHttpRequest) {
              console.log(jqXHR);
              jqXHR.addEventListener('progress', this.progress, false);
            }

            if (jqXHR.upload) {
              console.log(jqXHR);
              jqXHR.upload.addEventListener('progress', this.progress, false);
            }

            // jqXHR.upload.addEventListener("progress", function (evt) {
            //   if (evt.lengthComputable) {
            //     var percentComplete = Math.round((evt.loaded * 100) / evt.total);
            //     //Do something with upload progress
            //     console.log('Uploaded percent', percentComplete);
            //   }
            // }, false);
            // //Download progress
            // jqXHR.addEventListener("progress", function (evt) {
            //   if (evt.lengthComputable) {
            //     var percentComplete = Math.round((evt.loaded * 100) / evt.total);
            //     //Do something with download progress
            //     console.log('Downloaded percent', percentComplete);
            //   }
            // }, false);
            return jqXHR;
          },
        });
      };
    }

    /*
     * Returns a constructor for the ViewModel so that the ViewModel is constructed
     * each time the view is displayed.  Return an instance of the ViewModel if
     * only one instance of the ViewModel is needed.
     */
    return new TaskQueryServiceModel();
  }
);
