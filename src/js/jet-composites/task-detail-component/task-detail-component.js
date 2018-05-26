define(['knockout', 'services/taskQueryService', 'ojs/ojprogress'],
    function (ko, taskQueryService) {
        function taskDetailViewModel(context) {
            let self = this;

            self.activated = function (context) {
                // Implement if needed
                self.taskDetail();
            };

            self.themeName = oj.ThemeUtils.getThemeName();
            self.themeTargetPlatform = oj.ThemeUtils.getThemeTargetPlatform();

            console.log(self.themeTargetPlatform)
            oj.Logger.log("taskDetailViewModel : " + context.properties.taskId);

            self.progressStatus = ko.observable("loading");

            self.TaskDetailQueryURL = ko.computed(function () {
                //return "resources/sample_task_payload.json/" + context.properties.taskId;
                return "resources/sample_task_payload.json";
            });

            self.taskDetail = function () {
                var taskModel = taskQueryService.taskModel(obpmConfig.serverurl + self.TaskDetailQueryURL());

                taskModel.fetch({
                    success: function (model, response) {
                        oj.Logger.log(response.summaryFields);
                        //self.progressStatus("done");
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        oj.Logger.log("Update failed with: " + textStatus);
                    }
                });

                taskModel.on(oj.Events.EventType.ALL,
                    function (event) {
                        console.log(event);
                    }
                );
            };
        }
        return taskDetailViewModel;
    }
);