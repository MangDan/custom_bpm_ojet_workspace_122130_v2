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
        return "resources/sample_tasks.json";
      };

      self.taskDetailQueryURL = function (taskId) {
        //return "resources/sample_task_detail.json/" + context.properties.taskId;
        return "resources/sample_task_detail.json";
      };

      self.taskPayloadQueryURL = function (taskId) {
        //return "resources/sample_task_detail.json/" + context.properties.taskId;
        return "resources/sample_task_payload.json";
      };

      self.taskCommentsURL = function (taskId) {
        //return "resources/sample_task_detail.json/" + context.properties.taskId;
        return "resources/sample_task_comments.json";
      };

      self.taskAttachmentsURL = function (taskId) {
        //return "resources/sample_task_detail.json/" + context.properties.taskId;
        return "resources/sample_task_attachments.json";
      };

      // Generate authorization headers to inject into rest calls
      self.getHeaders = function () {
        return {
          'headers': {
            'Authorization': 'Bearer token',
            'userToken': 'self.token()',
            'DD-Process-Type': 'spatial'
          }
        };
      };

      self.taskModel = function (url) {
        var taskModel = oj.Model.extend({
          urlRoot: url,
          idAttribute: 'number'
        });
        return new taskModel();
      };

      self.listTaskCol = function (url, fetchSize) {
        var taskCollection = oj.Collection.extend({
          url: url,
          model: self.taskModel(),
          fetchSize: fetchSize
          //customURL: rootViewModel.getHeaders,
        });

        return new taskCollection();
      };

      self.taskSummaryPayloadModel = function (url) {
        var taskSummaryPayloadModel = oj.Model.extend({
          urlRoot: url
          //customURL: rootViewModel.getHeaders,
        });

        return new taskSummaryPayloadModel();
      };

      self.taskCommentModel = function (url) {
        var taskCommentModel = oj.Model.extend({
          urlRoot: url
        });
        return new taskCommentModel();
      };

      self.taskCommentCol = function (url, fetchSize) {
        var taskCommentCollection = oj.Collection.extend({
          url: url,
          fetchSize: fetchSize
          //customURL: rootViewModel.getHeaders,
        });

        return new taskCommentCollection();
      };

      self.taskAttachmentModel = function (url) {
        var taskAttachmentModel = oj.Model.extend({
          urlRoot: url
        });
        return new taskAttachmentModel();
      };

      self.taskAttachmentCol = function (url, fetchSize) {
        var taskAttachmentCollection = oj.Collection.extend({
          url: url,
          fetchSize: fetchSize
          //customURL: rootViewModel.getHeaders,
        });

        return new taskAttachmentCollection();
      };

      // Create handler
      self.addComment = function (commentStr) {
        var comment = { commentStr: commentStr };
        self.taskCommentCol().create(comment, {
          wait: true,
          contentType: 'application/json',
          success: function (model, response) {
            console.log("add comment success..");
          },
          error: function (jqXHR, textStatus, errorThrown) {
            console.log('Error in Create: ' + textStatus);
          }
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
