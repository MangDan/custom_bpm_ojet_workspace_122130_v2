define(['knockout', 'services/taskQueryService', 'ojs/ojprogress'],
    function (ko, taskQueryService) {
        function taskDetailViewModel(context) {
            let self = this;

            self.activated = function (context) {
                // Implement if needed
                //loadTaskDetailPage();
            };

            //self.themeName = oj.ThemeUtils.getThemeName();
            //self.themeTargetPlatform = oj.ThemeUtils.getThemeTargetPlatform();

            oj.Logger.log("taskDetailViewModel : " + context.properties.taskId);

            self.progressStatus = ko.observable("loading");
            self.message = ko.observable();
            self.task = ko.observable();
            self.payload = ko.observable();
            self.TaskDetailQueryURL = ko.computed(function () {
                //return "resources/sample_task_detail.json/" + context.properties.taskId;
                return "resources/sample_task_detail.json";
            });

            self.TaskPayloadQueryURL = ko.computed(function () {
                //return "resources/sample_task_detail.json/" + context.properties.taskId;
                return "resources/sample_task_payload.json";
            });

            // Promise에 대해서 정리...
            var getTaskDetail = function () {
                return new Promise(function (resolve, reject) {
                    var taskModel = taskQueryService.taskModel(obpmConfig.serverurl + self.TaskDetailQueryURL());

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

            var getTaskdSummaryPayload = function () {
                return new Promise(function (resolve, reject) {
                    if (obpmConfig.appTarget === "onpremise") {
                        var taskSummaryPaylodModel = taskQueryService.taskSummaryPayloadModel(obpmConfig.serverurl + self.TaskPayloadQueryURL());

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

            //
            Promise.all([getTaskDetail(), getTaskdSummaryPayload()]).then(function (taskData) {
                self.progressStatus("done");
                oj.Logger.info(taskData[0]);
                oj.Logger.info(taskData[1]);

                self.task(taskData[0]);
                self.payload(taskData[1]);

            }).catch(function (err) {
                oj.Logger.info(err);
                self.progressStatus("error");
                self.message(err);
            });
        };
        return taskDetailViewModel;
    }
);