define(['knockout', 'ojs/ojfilepicker', 'ojs/ojbutton', 'ojs/ojtoolbar', 'ojs/ojlistview', 'ojs/ojprogress', 'svg-icon/svg-icon-element'],
    function (ko) {
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
                uploadUrl: ""
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
                                if(imageExtensions.exec(theFile.name)){
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
                                        var dataURI = canvas.toDataURL("image/jpeg");
    
                                        //lastModifiedDate,name,size,type
                                        self.fileQueue.push(new FileModel(theFile, dataURI, null));
                                    }
                                } else {
                                    oj.Logger.log("non-image :" + theFile.name);

                                    // 파일 타입에 따라 변경되도록 수정...
                                    var svgIcon = {"svgUrl" : "/js/libs/svg-icon/sprite/symbol/windows.svg", "iconType" : "si-windows-cabinet-files"}
                                    self.fileQueue.push(new FileModel(theFile, null, svgIcon));
                                }
                            };
                        })(file);

                        fileReader.readAsDataURL(file);

                    }
                    //fileQueue = fileQueue.concat(results);

                    //can't upload yet, must return fileItems so app can add progress listeners
                    // onSend(results);
                }

            };

            // Closure to capture the file information.


            //create file upload data provider
            self.selectedFileDataProvider = new oj.ArrayDataProvider(self.fileQueue, { idAttribute: 'item' });

            function returnFileSize(number) {
                if (number < 1024) {
                    return number + 'bytes';
                } else if (number > 1024 && number < 1048576) {
                    return (number / 1024).toFixed(1) + 'KB';
                } else if (number > 1048576) {
                    return (number / 1048576).toFixed(1) + 'MB';
                }
            };

            var FileModel = function (fileobj, dataURI, svgIcon) {
                var self = this;

                self.name = fileobj.name;
                self.lastModifiedDate = fileobj.lastModifiedDate;
                self.size = returnFileSize(fileobj.size);
                self.type = fileobj.type;
                self.dataURI = (!dataURI ? "" : dataURI);
                self.svgUrl = (!svgIcon ? "" : svgIcon.svgUrl);
                self.iconType = (!svgIcon ? "" : svgIcon.iconType);
            };

            getFileSize = function (byte) {
                var fSize;
                if (byte / 1024 > 1) {
                    if (((byte / 1024) / 1024) > 1) {
                        fSize = (Math.round(((byte / 1024) / 1024) * 100) / 100);
                    } else {
                        fSize = (Math.round((byte / 1024) * 100) / 100) + "Kb";
                    }
                } else {
                    fSize = (Math.round(byte * 100) / 100);
                }

                return fSize;
            }

            // self.acceptOptions = {
            //     dataSource: [
            //         {name: "All types", value: "*"}, 
            //         {name: "Images", value: "image/*"}, 
            //         {name: "Videos", value: "video/*"}
            //     ],
            //     valueExpr: "value",
            //     displayExpr: "name",
            //     value: that.accept
            // };

            // self.uploadOptions = {
            //     items: ["instantly", "useButtons"],
            //     value: that.uploadMode
            // };

            self.noAttachments = ko.observable(false);

            self.clearSelectedFiles = function (event) {
                self.fileQueue.removeAll();
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