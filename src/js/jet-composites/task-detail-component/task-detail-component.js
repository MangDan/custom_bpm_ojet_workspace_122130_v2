define(['knockout', 'services/taskQueryService', 'ckeditor5-classic/ckeditor', 'ojs/ojprogress', 'ojs/ojinputtext', 'ojs/ojinputnumber', 'ojs/ojcheckboxset', 'ojs/ojmenu', 'ojs/ojoption', 'ojs/ojlistview', 'ojs/ojformlayout', 'ojs/ojavatar', 'ojs/ojpagingcontrol', 'ojs/ojcollectiontabledatasource', 'ojs/ojpagingtabledatasource', 'ojs/ojarraydataprovider'],
    function (ko, taskQueryService, ckeditor) {
        function taskDetailViewModel(context) {
            let self = this;

            var commentEditor;
            var createCKEditor = function () {
                ckeditor.create(
                    document.querySelector('#commentEditor')
                ).then(editor => {
                    commentEditor = editor;
                    //oj.Logger.log(commentEditor.element);
                    oj.Logger.log(commentEditor.config);
                    oj.Logger.log(commentEditor.ui);
                }).catch(error => {
                    console.error(error);
                });
            };
            // require(['ckeditor5-classic/ckeditor'], ClassicEditor => {
            //     console.log(document.querySelector('#commentEditor'));
            //     ClassicEditor.create(
            //         document.querySelector('#commentEditor')
            //     ).then(editor => {
            //         commentEditor = editor;
            //         //oj.Logger.log(commentEditor.element);
            //         oj.Logger.log(commentEditor.config);
            //         oj.Logger.log(commentEditor.ui);
            //     }).catch(error => {
            //         console.error(error);
            //     });
            // });
            //console.log(commentEditor.isReadOnly);
            //self.themeName = oj.ThemeUtils.getThemeName();
            //self.themeTargetPlatform = oj.ThemeUtils.getThemeTargetPlatform();

            oj.Logger.log("taskDetailViewModel : " + context.properties.taskId);

            self.isSmall = oj.ResponsiveKnockoutUtils.createMediaQueryObservable(
                oj.ResponsiveUtils.getFrameworkQuery(oj.ResponsiveUtils.FRAMEWORK_QUERY_KEY.SM_ONLY));
            self.isLargeOrUp = oj.ResponsiveKnockoutUtils.createMediaQueryObservable(
                oj.ResponsiveUtils.getFrameworkQuery(oj.ResponsiveUtils.FRAMEWORK_QUERY_KEY.LG_UP));

            // For small screens: 1 column and labels on top
            // For medium screens: 2 columns and labels on top
            // For large screens or bigger: 2 columns and labels inline
            self.taskFormColumns = ko.pureComputed(function () {
                return self.isSmall() ? 1 : 2;
            }, this);
            self.taskFormLabelEdge = ko.pureComputed(function () {
                return self.isLargeOrUp() ? "start" : "top";
            }, this);

            self.progressStatus = ko.observable("loading");
            self.message = ko.observable();
            self.task = ko.observableArray([]);
            self.taskActions = ko.observableArray([]);
            self.summaryFields = ko.observableArray([]);

            //self.selectedMessages = ko.observableArray(["error", "warning"]);
            self.taskComments = ko.observableArray([]);
            self.taskCommentDataSource = ko.observable();
            self.taskCommentCol = ko.observable();

            self.taskAttachments = ko.observableArray([]);
            self.taskAttachmentDataSource = ko.observable();
            self.taskAttachmentCol = ko.observable();

            self.taskDetailQueryURL = ko.computed(function () {
                //return "resources/sample_task_detail.json/" + context.properties.taskId;
                return taskQueryService.taskDetailQueryURL(context.properties.taskId);
            });

            self.taskPayloadQueryURL = ko.computed(function () {
                return taskQueryService.taskPayloadQueryURL(context.properties.taskId);
            });

            self.taskCommentsURL = ko.computed(function () {
                return taskQueryService.taskCommentsURL(context.properties.taskId);
            });

            self.taskAttachmentsURL = ko.computed(function () {
                return taskQueryService.taskAttachmentsURL(context.properties.taskId);
            });

            // Promise에 대해서 정리...
            var getTaskDetail = function () {
                return new Promise(function (resolve, reject) {
                    var taskModel = taskQueryService.taskModel(obpmConfig.serverurl + self.taskDetailQueryURL() + "?expanded=all");

                    taskModel.fetch({
                        success: function (model, task) {
                            oj.Logger.log(task);
                            //self.task(data);
                            if (task) {
                                resolve(task);
                            }
                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                            reject(new Error("Get task detail failed with:" + textStatus));
                        }
                    });

                    // Model Event Lifecycle
                    //taskModel.on(oj.Events.EventType.ALL,
                    //    function (event) {
                    //        console.log(event);
                    //    }
                    //);

                    //self.progressStatus("error");
                    //        self.message(textStatus);
                });
            }

            var getTaskSummaryPayload = function () {
                return new Promise(function (resolve, reject) {
                    if (obpmConfig.appTarget === "onpremise") {
                        var taskSummaryPaylodModel = taskQueryService.taskSummaryPayloadModel(obpmConfig.serverurl + self.taskPayloadQueryURL());

                        taskSummaryPaylodModel.fetch({
                            success: function (model, payload) {
                                oj.Logger.log(payload);
                                if (payload) {
                                    resolve(payload);
                                }
                            },
                            error: function (jqXHR, textStatus, errorThrown) {
                                reject(new Error("Get task detail payload failed with:" + textStatus));
                            }
                        });

                        oj.Logger.log("App Target : OnPremise BPM 12c");
                    } else {
                        // need implement...
                        oj.Logger.log("App Target : Cloud (OIC Process)");
                    }

                });
            };

            var getTaskComments = function () {
                return new Promise(function (resolve, reject) {
                    if (obpmConfig.appTarget === "onpremise") {
                        self.taskCommentCol(taskQueryService.taskCommentCol(obpmConfig.serverurl + self.taskCommentsURL()));

                        self.taskCommentCol().fetch({
                            success: function (collection, comment) {
                                oj.Logger.log(comment);
                                if (comment) {
                                    resolve(comment);
                                }
                            },
                            error: function (jqXHR, textStatus, errorThrown) {
                                reject(new Error("Get task Comments failed with:" + textStatus));
                            }
                        });
                        oj.Logger.log("App Target : OnPremise BPM 12c");
                    } else {
                        // need implement...
                        oj.Logger.log("App Target : Cloud (OIC Process)");
                    }
                });
            };

            var getTaskAttachments = function () {
                return new Promise(function (resolve, reject) {
                    if (obpmConfig.appTarget === "onpremise") {
                        self.taskAttachmentCol(taskQueryService.taskAttachmentCol(obpmConfig.serverurl + self.taskAttachmentsURL(), 5));

                        self.taskAttachmentCol().fetch({
                            success: function (collection, attachment) {
                                oj.Logger.log(attachment);
                                if (attachment) {
                                    resolve(attachment);
                                }
                            },
                            error: function (jqXHR, textStatus, errorThrown) {
                                reject(new Error("Get task Attachments failed with:" + textStatus));
                            }
                        });
                        oj.Logger.log("App Target : OnPremise BPM 12c");
                    } else {
                        // need implement...
                        oj.Logger.log("App Target : Cloud (OIC Process)");
                    }

                });
            };

            //
            Promise.all([getTaskDetail(), getTaskSummaryPayload()]).then(function (taskData) {
                var actionId, actionLabel, actionType;

                self.progressStatus("done");
                oj.Logger.log(taskData[0]);
                oj.Logger.log(taskData[1]);
                // if data not exist ??????
                self.task(taskData[0]);

                self.taskActions().length = 0;
                //taskActions
                if (taskData[0].actionList.length > 0) {
                    for (var i = 0; i < taskData[0].actionList.length; i++) {
                        if (taskData[0].actionList[i].actionType === "Custom") {
                            actionId = taskData[0].actionList[i].actionType;
                            actionValue = taskData[0].actionList[i].href.substring(taskData[0].actionList[i].href.indexOf("=") + 1);
                            actionLabel = taskData[0].actionList[i].title;

                            self.taskActions.push({ type: actionType, id: actionId, label: actionLabel, disabled: false });
                        } else {
                            oj.Logger.log("System Action :" + taskData[0].actionList[i].title);
                        }

                    }
                }

                // if data not exist : 500 error.
                self.summaryFields(taskData[1].summaryFields);

                var defaultMessageSeverity = ["confirmation", "error", "info", "warning"];
                // sevirity : confirmation, error, info, warning, none
                if (taskData[0].comments.comments.comments !== null) {
                    self.taskCommentDataSource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(taskData[0].comments.comments.comments)));
                }

                if (taskData[0].attachments.attachments.attachment !== null) {
                    self.taskAttachmentDataSource(new oj.ArrayTableDataSource(taskData[0].attachments.attachments.attachment));
                }

                // commentEditor null 발생.
                // Promise 내에서 모든 AJAX 로드가 완료되어야 오류가 발생하지 않아서 모든 AJAX 콜 완료된 후 CKEditor 호출하도록 변경함.
                createCKEditor();

            }).catch(function (err) {
                oj.Logger.info(err);
                self.progressStatus("error");
                self.message(err);
            });

            self.selectedAction = ko.observable("");

            self.taskAction = function (event) {
                self.selectedAction(event.target.value);
                oj.Logger.info("task Action : " + event.target.value);
            };

            self.commentBtnDisabled = ko.observable(false);

            self.submitComment = function (event) {
                var commentStr = commentEditor.getData();

                // Never tested.
                //taskQueryService.addComment(obpmConfig.serverurl + self.taskCommentsURL(), commentStr);

                var comment = { commentStr: commentStr };

                self.taskCommentCol(taskQueryService.taskCommentCol(obpmConfig.serverurl + self.taskCommentsURL()));

                self.taskCommentCol().create(comment, {
                    // taskCommentCol에서 customURL을 통해 Authrization을 하도록 되어 있어서 Authrization 문제 없을것으로 판단되었으나, 오류가 발생. 아래와 같이 Headers 추가로 문제 픽스함. (best practice?)
                    headers: { "Authorization": "Basic " + sessionStorage.getItem("userToken") },
                    wait: true,
                    contentType: 'application/json',
                    success: function (model, response) {
                        self.taskCommentDataSource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(response.comments)));

                        oj.Logger.log("add comment success..");
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        oj.Logger.log('Error in Create: ' + textStatus);
                    }
                });
            };

            self.getFileType = function (mimeType) {
                var fileType;
                //console.log(mimedb[mimeType].extensions);
                //oj.Logger.log(mimedb[mimeType].extensions);

                if (mimeType.includes("image")) {
                    fileType = "image_48_full";
                } else {
                    fileType = mimedb[mimeType].extensions[0];
                }

                return fileType;
            };

            self.koAttachmentArray = ko.observableArray([]);

            //create file upload data provider
            self.attachmentDataProvider = new oj.ArrayDataProvider(self.koAttachmentArray, { idAttribute: 'item' });

            self.attachmentDataProvider.addEventListener('mutate', function (event) {
                if (event.detail.add != null) {
                    self.noAttachments(false);
                }
                else if (event.detail.remove != null) {
                    self.attachmentDataProvider.getTotalSize().then(function (size) {
                        if (size == 0) {
                            self.noAttachments(true);
                        }
                    });
                }
            });

            self.noAttachments = ko.observable(true);

            //clear file items from the progress list
            self.clearUploadAttachments = function (event) {
                self.filterRemove(['loaded', 'errored']);
            };

            self.attachmentFileNames = ko.observableArray([]);
            //add a filesAdd listener for upload files
            self.attachmentSelectListener = function (event) {
                var files = event.detail.files;
                if (files.length > 0) {

                    if (files) {
                        for (var i = 0; i < files.length; i++) {
                            console.log(files[i]);
                        }

                        //can't upload yet, must return fileItems so app can add progress listeners
                        // onSend(results);
                    }

                    var fileItems = transport.queue(files);

                    //add the new files at the beginning of the list
                    for (var i = 0; i < fileItems.length; i++)
                        self.koAttachmentArray.unshift(fileItems[i]);

                    //simulate error status
                    transport.setErrorStatus(getStatus());

                    //upload files
                    transport.flush();
                }
            };

            self.downloadAttachment = function (event) {
                console.log("downloadAttachment");
            };
        };
        return taskDetailViewModel;
    }
);