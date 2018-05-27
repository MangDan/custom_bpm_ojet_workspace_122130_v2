/**
 * Copyright (c) 2014, 2018, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/*
 * Your about ViewModel code goes here
 */
define(['ojs/ojcore', 'knockout', 'jquery', 'ojs/ojlabel', 'ojs/ojknockout', 'ojs/ojinputtext', 'ojs/ojdatetimepicker', 'ojs/ojselectcombobox', 'ojs/ojtimezonedata', 'ojs/ojmessages'],
  function (oj, ko, $) {

    function StartTaskViewModel() {
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

      oj.Logger.log(obpmConfig.serverurl, obpmConfig.resturi, obpmConfig.adminuser, obpmConfig.adminpw);

      var bpmContext = sessionStorage.getItem("bpmContext");
      var bpmContextObj = JSON.parse(bpmContext); //userFirstName, email, type, language
      self.receiptor = ko.observable((bpmContextObj.userFirstName === null ? bpmContextObj.identityName : bpmContextObj.userFirstName));

      self.validators = ko.computed(function () {
        return [{
          type: 'regExp',
          options: {
            pattern: '[a-zA-Z0-9]{1,}',
            messageDetail: 'You must enter at least 1 letters or numbers'
          }
        }];
      });

      self.dateValidators = ko.computed(function () {
        return [{
          type: 'regExp',
          options: {
            pattern: '/^(19|20)\d{2}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[0-1])$/',
            messageDetail: 'You must enter at valid date format'
          }
        }];
      });

      self.currentDay = ko.observable(oj.IntlConverterUtils.dateToLocalIso(new Date()));
      var dateFormat = "yyyy-MM-dd";
      self.dateConverter = ko.observable(oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).
        createConverter(
          {
            pattern: dateFormat
          }));

      self.receiptTitle = ko.observable();

      self.submit = function (event) {
        var valiation = false;
        var receiptTitle = $("#receiptTitle")[0];
        var inspector = $("#inspector")[0];
        // var receiptType = $("#receiptType")[0];
        // validate them both, and when they are both done 
        // validating and valid, submit the form.
        // Calling validate() will update the component's 
        // valid property    
        receiptTitle.validate().then(function (result) {
          oj.Logger.log("receiptTitle field is ", result);

          if (result === 'invalid')
            return true;
          else {
            oj.Logger.info("submit");
            // Call REST

            if(confirm("접수하시겠습니까?")) {
              invoke_process();
            } else {
              return true;
            }
            
          }
        });
      };

      invoke_process = function () {
        var receiptTitle = $("#receiptTitle").val();
        var receiptDate = $("#receiptDate").val();
        var receiptContent = $("#receiptContent").val();
        var receiptor = $("#receiptor").val();
        var inspector = $("#inspector").val();
        var receiptType = $("#receiptType").val();
        var description = $("#description").val();

        var requestJson = {
          "p_businesskey": create_UUID(),    //random..
          "p_receipttitle": receiptTitle,
          "p_receiptcontent": receiptContent,
          "p_receiptdate": receiptDate,
          "p_receiptor": receiptor,
          "p_inspector": inspector, //ENP / 공사업체
          "p_receipttype": receiptType,
          "p_description": description
        };

        oj.Logger.log("Process Invoke Request Json : " + JSON.stringify(requestJson));

        $.ajax({
          type: "PUT",
          url: obpmConfig.ordsserverurl + obpmConfig.ordsresturi + "process/invoke",
          cache: false,
          contentType: "application/json",
          data: JSON.stringify(requestJson)
        })
        .done(function (data, textStatus, jqXHR) {
          // Process data, as received in data parameter
          self.resultMessages.push(self.createMessage("confirmation", "프로세스 호출 성공", "지장이설 접수등록 프로세스가 시작되었습니다.")); 
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
          // Request failed. Show error message to user. 
          // errorThrown has error message.
          self.resultMessages.push(self.createMessage("error", "프로세스 호출 오류", "프로세스 호출시 오류가 발생하였습니다. 시스템 담당자에게 문의하세요.")); 
        })
        .always(function(jqXHR, textStatus, errorThrown) {
          // Hide spinner image
          console.log("invoked a process...");
        });
      };

      // creating busniness key
      create_UUID = function () {
        var dt = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
          var r = (dt + Math.random() * 16) % 16 | 0;
          dt = Math.floor(dt / 16);
          return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return uuid;
      }

      self.resultMessages = ko.observableArray([]);

      self.resultMessagePositionOption = ko.observable("bottom-window"); //top-page, top-window

      self.messagePositions =
        {
          "top-page":       {"my": {"vertical" :"top", "horizontal": "center"},
                             "at": {"vertical": "bottom", "horizontal": "center"},
                             "of": "#pageHeader"
                            },
          "top-window":     {"my": {"vertical" :"top", "horizontal": "center"},
                             "at": {"vertical": "top", "horizontal": "center"},
                             "of": "window"
                            },
          "bottom-window":  {"my":{"vertical" :"bottom", "horizontal": "center"},
                             "at": {"vertical": "bottom", "horizontal": "center"},
                             "of": "window"
                            }
        };
        
        self.resultMessagePosition = ko.computed(function() {
          return self.messagePositions[self.resultMessagePositionOption()];
        });



      self.closeResultMessagesHandler = function(event)
        {
          // Remove from bound observable array
          self.resultMessages.remove(event.detail.message);
          
          // When message is closed due to auto-tmeout, or user chosing to close all, 
          //  selectedMessages will need explicit update
          self.resultMessages.remove(function(severity) {
            return severity === event.detail.message.severity
          });
        };

        self.createMessage = function(severity, summary, msg) {
          var initCapSeverity = severity.charAt(0).toUpperCase() + severity.slice(1);

          return {
            severity: severity,
            summary: summary,
            detail: msg,
            closeAffordance: "defaults",
            autoTimeout: 0, // or -1
            sound: "none",
            timestamp: ""
          };
        };

    };
    /*
     * Returns a constructor for the ViewModel so that the ViewModel is constructed
     * each time the view is displayed.  Return an instance of the ViewModel if
     * only one instance of the ViewModel is needed.
     */
    return new StartTaskViewModel();
  }
);
