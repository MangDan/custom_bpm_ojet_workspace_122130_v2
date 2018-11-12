var async = require("async");
var http = require("http");
var nodemailer = require("nodemailer");

var listofemails = []; 

function createtestusers(count) {
    var testuser = "donghu.kim@oracle.com";
    
    if(listofemails.length > 0)
        listofemails.removeAll();
        
    for (var i=0; i<=count; i++) {
        listofemails.push(testuser);
    }
    console.log(listofemails);
};

var success_email = [];

var failure_email = [];

var transporter;

function massMailer() {
    var self = this;
    transporter = nodemailer.createTransport({
        host: "localhost",
        port: 25,
        //auth: {
        //    user: "Your gmail ID",
        //    pass: "Your gmail password"
        //}
    });
    // Fetch all the emails from database and push it in listofemails
        // Will do it later.
    self.invokeOperation();
};

/* Invoking email sending operation at once */

massMailer.prototype.invokeOperation = function() {
    var self = this;
    async.each(listofemails,self.SendEmail,function(){
        console.log(success_email);
        console.log(failure_email);
    });
}

/* 
* This function will be called by multiple instance.
* Each instance will contain one email ID
* After successfull email operation, it will be pushed in failed or success array.
*/

massMailer.prototype.SendEmail = function(Email,callback) {
    console.log("Sending email to " + Email);
    var self = this;
    self.status = false;
    // waterfall will go one after another
    // So first email will be sent
    // Callback will jump us to next function
    // in that we will update DB
    // Once done that instance is done.
    // Once every instance is done final callback will be called.
    async.waterfall([
        function(callback) {                
            var mailOptions = {
                from: 'adoniris@gmail.com',     
                to: Email,
                subject: 'Hi ! This is from Async Script', 
                text: "Hello World !"
            };
            transporter.sendMail(mailOptions, function(error, info) {               
                if(error) {
                    console.log(error)
                    failure_email.push(Email);
                } else {
                    self.status = true;
                    success_email.push(Email);
                }
                callback(null,self.status,Email);
            });
        },
        function(statusCode,Email,callback) {
                console.log("Will update DB here for " + Email + "With " + statusCode);
                callback();
        }
        ],function(){
            //When everything is done return back to caller.
            callback();
    });
}

new massMailer(); //lets begin