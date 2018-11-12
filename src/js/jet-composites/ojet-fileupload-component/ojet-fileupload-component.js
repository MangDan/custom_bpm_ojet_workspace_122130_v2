define(['knockout', 'services/taskQueryService', 'ojs/ojfilepicker', 'ojs/ojbutton', 'ojs/ojtoolbar', 'ojs/ojlistview', 'ojs/ojprogress', 'svg-icon/svg-icon-element'],
    function (ko, taskQueryService) {
        function ojetFileuploadViewModel(context) {
            let self = this;

            //var active = 0, fileQueue = [], sendQueue = [];

            self.fileQueue = ko.observableArray([]);

            // HTML Binding 후 File Upload Dom generate...
            self.bindingsApplied = function (context) {
                // This optional method may be implemented on the ViewModel and will be invoked after the bindings are applied on this View.

                if (context.properties.options)
                    self.options = context.properties.options;
                else
                    throw new Error('FileUpload requires options attribute.');

                self.selectionMode(self.options.multiple ? "multiple" : "single");
                self.accept(self.options.accept ? self.options.accept.split(",") : []);
                oj.Logger.log(self.options);

            };

            self.options = {
                selectionMode: "multiple",
                accept: "image/*",
                uploadUrl: "/tasks/{id}/attachments"
            };

            self.selectionMode = ko.observable(self.options.selectionMode);
            self.accept = ko.observable(self.options.accept ? self.options.accept.split(",") : []);

            self['queue'] = function (fileList) {
                var results = [];

                if (fileList) {
                    for (var i = 0; i < fileList.length; i++) {
                        results.push(new TransportItem(fileList[i]));
                    }
                    fileQueue = fileQueue.concat(results);

                    //can't upload yet, must return fileItems so app can add progress listeners
                    // onSend(results);
                }
                return results;
            };

            self.progressStatus = ko.observable(0);

            self.fileSelectListener = function (event) {
                var files = event.detail.files;
                if (files) {
                    for (var i = 0, file; file = files[i]; i++) {
                        // Only process image files.
                        // if (!f.type.match('image.*')) {
                        //     continue;
                        // }
                        var fileReader = new FileReader();

                        fileReader.onload = (function (theFile) {
                            return function (e) {

                                //drawImage 메서드에 넣기 위해 이미지 객체화
                                var thumbImage = new Image();
                                var imageExtensions = /(\jpg|\jpeg|\png|\gif)$/i;

                                // if image file..
                                if (imageExtensions.exec(theFile.name)) {
                                    oj.Logger.log("image :" + theFile.name);

                                    thumbImage.src = e.target.result; //data-uri를 이미지 객체에 주입
                                    thumbImage.onload = function () {
                                        var canvas = document.createElement('canvas');
                                        var canvasContext = canvas.getContext("2d");

                                        //캔버스 크기 설정
                                        canvas.width = 40; //가로 100px
                                        canvas.height = 40; //세로 100px

                                        //이미지를 캔버스에 그리기
                                        canvasContext.drawImage(this, 0, 0, 40, 40);

                                        //캔버스에 그린 이미지를 다시 data-uri 형태로 변환
                                        var thumbDataURI = canvas.toDataURL("image/jpeg");

                                        //lastModifiedDate,name,size,type
                                        //add the new files at the beginning of the list
                                        self.fileQueue.unshift({"fileModel":new FileModel(theFile, e.target.result, thumbDataURI, null),"fileProgressStatus":ko.observable(self.progressStatus())});
                                    }
                                } else {
                                    oj.Logger.log("non-image :" + theFile.name);

                                    // 파일 타입에 따라 변경되도록 수정...
                                    var svgIcon = { "svgUrl": "/js/libs/svg-icon/sprite/symbol/windows.svg", "iconType": "si-windows-cabinet-files" }
                                    self.fileQueue.unshift({"fileModel":new FileModel(theFile, e.target.result, null, svgIcon),"fileProgressStatus":ko.observable(self.progressStatus())});
                                }
                            };
                        })(file);

                        fileReader.readAsDataURL(file);
                    }
                }
            };
            //create file upload data provider
            self.selectedFileDataProvider = new oj.ArrayDataProvider(self.fileQueue, { idAttribute: 'name' });

            var FileModel = function (fileobj, content, thumbDataURI, svgIcon) {
                var self = this;
                
                self.name = fileobj.name;
                self.content = content;
                self.lastModifiedDate = fileobj.lastModifiedDate;
                self.size = returnFileSize(fileobj.size);
                self.byteSize = fileobj.size;
                self.type = (fileobj.type === '' ? 'application/octet-stream' : fileobj.type);
                self.thumbDataURI = (!thumbDataURI ? "" : thumbDataURI);
                self.svgUrl = (!svgIcon ? "" : svgIcon.svgUrl);
                self.iconType = (!svgIcon ? "" : svgIcon.iconType);
            };

            function returnFileSize(number) {
                if (number < 1024) {
                    return number + 'bytes';
                } else if (number > 1024 && number < 1048576) {
                    return (number / 1024).toFixed(1) + 'KB';
                } else if (number > 1048576) {
                    return (number / 1048576).toFixed(1) + 'MB';
                }
            };

            // 수정 필요...
            self.iconClass = function (filename, contentType) {
                if (filename) {
                    if (contentType === 'application/pdf') {
                        return 'pcs-attachments-filepdf-icon';
                    }
                    if (contentType === 'application/zip') {
                        return 'pcs-attachments-filezip-icon';
                    }
                    if (contentType && contentType.startsWith('image')) {
                        return 'pcs-attachments-fileimage-icon';
                    }
                    if (contentType === 'text/plain') {
                        return 'pcs-attachments-filetxt-icon';
                    }
                    if (filename.endsWith('xls') || filename.endsWith('xlsx')) {
                        return 'pcs-attachments-filexls-icon';
                    }
                    if (filename.endsWith('doc') || filename.endsWith('docx')) {
                        return 'pcs-attachments-filedoc-icon';
                    }
                    if (filename.endsWith('ppt') || filename.endsWith('pptx')) {
                        return 'pcs-attachments-fileppt-icon';
                    } else {
                        return 'pcs-attachments-fileother-icon';
                    }
                }
            };

            self.noAttachments = ko.observable(false);
            
            self.uploadSelectedFiles = function (event) {
                if (self.fileQueue().length > 0) {
                    var boundary = 'Boundary_' + '123456789_123456789';
                    var header = '--' + boundary + '\r\n';
                    var footer = '\r\n--' + boundary + '--\r\n';
                    var contentType = 'multipart/mixed; boundary=' + boundary;

                    for (var i = 0, fileItem; fileItem = self.fileQueue()[i]; i++) {
                        //oj.Logger.info(file);

                        var content = header;
                        content += 'Content-Disposition: inline' + '\r\n';
                        content += 'Content-Type: application/json' + '\r\n\r\n';

                        var payload = {
                            'attachmentName': fileItem.fileModel.name,
                            'mimeType': fileItem.fileModel.type,
                            'attachmentSize': fileItem.fileModel.byteSize,
                            'attachmentScope': 'TASK'
                        };

                        content += JSON.stringify(payload) + '\r\n';
                        content += header;
                        content += 'Content-Transfer-Encoding: binary\r\n\r\n';
                        content += fileItem.fileModel.content;
                        content += footer;

                        var uploadUrl = taskQueryService.taskAttachmentsURL(context.properties.number);

                        taskQueryService.uploadAttachment(uploadUrl, i, content, contentType, progressCallback).done(function (data) {
                            oj.Logger.info("success");
                        }).fail(function (jqXHR, textStatus, errorThrown) {
                            oj.Logger.error(jqXHR);
                            oj.Logger.error(textStatus);
                            oj.Logger.error(errorThrown);
                        });
                    }
                } else {
                    oj.Logger.info("no selected file...");
                }
            };

            self.clearSelectedFiles = function (event) {
                self.fileQueue.removeAll();
            };

            
            
            progressCallback = function(id, evt) {
                if (evt.lengthComputable) {

                    // listview에서 각 개별 observablearray의 item 값이 변경될 때 업데이트하는 방법???
                    self.progressStatus(30);

                    var percentComplete = Math.round((evt.loaded * 100) / evt.total);
                    //Do something with upload progress
                    //console.log(self.fileQueue());
                    //console.log("ProgressCallback.id("+id+") : " +  percentComplete);
                    //self.fileQueue()[id]["fileProgressStatus"] = 30;
                    //console.log(self.fileQueue());
                    //console.log("ProgressCallback.id("+id+") : " +  percentComplete);
                }
            };
            // File Icon을 SVG로 활용...
            // Progress 상태 뷰를 아래 소스 참고해서 변경.
            //             self.svgUrl = ko.observable("/js/libs/svg-icon/sprite/symbol/logos.svg");

            //             var progressStatusView =
            //   "  <div data-bind='visible: ($properties.status == \"queued\")'" +
            //   "       class='oj-progressstatus-cell'>" +
            //   "    <div class='oj-component-icon oj-progressstatus-cancel-icon'" +
            //   "         role='img' title='cancel'></div>" +
            //   '  </div>' +
            //   "  <div data-bind='visible: ($properties.status == \"loadstarted\")'" +
            //   "       class='oj-progressstatus-cell'>" +
            //   "    <oj-progress type='circle' value='{{$properties.progress}}'>" +
            //   '    </oj-progress>' +
            //   '  </div>' +
            //   "  <div data-bind='visible: ($properties.status == \"loaded\")'" +
            //   "       class='oj-progressstatus-cell'>" +
            //   "    <div class='oj-component-icon oj-progressstatus-done-icon' role='img' title='done'></div>" +
            //   '  </div>' +
            //   "  <div data-bind='visible: ($properties.status == \"errored\" || $properties.status == \"timedout\" || $properties.status == \"aborted\")'" +
            //   "       class='oj-progressstatus-cell'>" +
            //   "    <div class='oj-component-icon oj-progressstatus-error-icon' role='img' title='error'></div>" +
            //   '  </div>';

        }
        return ojetFileuploadViewModel;
    }
);