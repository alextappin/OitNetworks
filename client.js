var net = require('net');
var put = require('put');
var ip = require('ip');
var async = require('async');
var stringToLog ='';
var buf1 = new Buffer(2);
var requestString;
//10.220.9.27 eric
//10.220.10.222 mine
var serverInfo = {
    serviceIp : '10.0.0.21',
    servicePort : 2605
};
var latentObj = {
    delayed: [
    ],
    recovered: [
    ]
};
var extraData;
var count = 0;
var messageCounter = 1000;
var counter = 0;
var endStatus;
var closeStatus;
var requestObject = {
    tcpHeader   : 0,
    messageType : 'REQ',
    fieldSeparator :'|',
    msTimeStamp : 0,
    requestID : '',
    studentName : 'TappinA',
    studentID   : '220-361',
    responseDelay   : 0,
    clientIPAddress : ip.address(),
    clientServicePort   : 0,
    clientSocketNo  : 0,
    foreignHostIPAddress    : '',
    foreignHostServicePort  : 0,
    studentData : 'Data',
    scenarioNo  : 2,
    totalLength : 0,
    valueInTCPHeader    : 0
};
var unique = 1;

var writeRequest = function(cli, delay) {
    requestObject.msTimeStamp = Math.ceil(Date.now() / 1000);
    requestObject.requestID = unique++;
    requestObject.clientServicePort = cli.address().port;
    requestObject.foreignHostIPAddress = serverInfo.serviceIp;
    requestObject.foreignHostServicePort = serverInfo.servicePort;
    requestObject.responseDelay = 0;
    var resp = requestObject.messageType + requestObject.fieldSeparator +
        requestObject.msTimeStamp + requestObject.fieldSeparator + requestObject.requestID +
        requestObject.fieldSeparator + requestObject.studentName + requestObject.fieldSeparator +
        requestObject.studentID + requestObject.fieldSeparator + requestObject.responseDelay +
        requestObject.fieldSeparator + requestObject.clientIPAddress + requestObject.fieldSeparator +
        requestObject.clientServicePort + requestObject.fieldSeparator + requestObject.clientSocketNo +
        requestObject.fieldSeparator + requestObject.foreignHostIPAddress + requestObject.fieldSeparator +
        requestObject.foreignHostServicePort + requestObject.fieldSeparator + requestObject.studentData +
        requestObject.fieldSeparator + requestObject.scenarioNo + requestObject.fieldSeparator;

    return resp;
};

var writeTrailerRecord = function() {
    var today = new Date(),
        dd = today.getDate() < 10 ? '0'+today.getDate() : today.getDate(),
        mm = today.getMonth()+ 1,
        yyyy = today.getFullYear(),
        h = today.getHours() < 10 ? '0' + today.getHours() : today.getHours(),
        m = today.getMinutes() < 10 ? '0' + today.getMinutes() : today.getMinutes(),
        s = today.getSeconds() < 10 ? '0' + today.getSeconds() : today.getSeconds(),
        endStatus = !endStatus ? 0 : endStatus,
        closeStatus = !closeStatus ? 0 : closeStatus,
        trailer;

    trailer =  mm + dd + yyyy + '|' + h + m + s + '|' + endStatus + '|' + endStatus + '|' + closeStatus;
    writeToLog(trailer);
};

var writeToLog = function writeToLog(text) {
    var string = text + "\n\r";
    //console.log(string)
    stringToLog+=string;
    console.log(string);
};

var calculateLength = function() {
    var length = 0;
    return length;
};

var receiveResponse = function() {
    return true;
};

var convertLengthToBinary = function convertLengthToBinary(len) {
    return parseInt(len, 2);
};

var messageCount = 0;
var recieveCount = 0;
var client = new net.Socket();
var clientTransmit = function clientTransmit(cli, text) {
    cli.write(text);
};
var recieveMessage = function clientRecieve(cli, text) {

};

client.connect(serverInfo.servicePort, serverInfo.serviceIp, function() {
    //console.log('Connected');
});

client.on('connect', function(data){
    var date;

    async.whilst(
        function () { return count < messageCounter; },
        function (callback) {
            var matcher;
            var delayed;
            count++;
            date = Date.now();
            requestString = writeRequest(client, count % 2 !== 0? 4000: 0);
            buf1.writeInt16BE(requestString.length);
            writeToLog(requestString);
            matcher = requestString.match(/\d+\|T/g);
            matcher = matcher.toString().slice(0, matcher.length-3);
            if (count % 2 !== 0) {
                var tempObj = {
                    time: date,
                    number: matcher
                };
                latentObj.delayed.push(tempObj);
            }
            /*clientTransmit(client, buf1);*/
            clientTransmit(client, buf1 + requestString);
            setTimeout(callback, 3);
        },
        function (err) {
            //console.log(stringToLog);
        }
    );
});

client.on('data', function(data) {
    //console.log(data.toString());
    var numOfMessages = data.toString().match(/RSP/g) ? data.toString().match(/RSP/g).length : 0;
    //console.log('fffffffff',data.toString() + '\n' + data.length+ '\n');
    var tempData;
    var messLength;
    var flag = true;
    /*console.log(latentObj.delayed[1].time);*/
    /*console.log(Date.now());*/
    data = extraData ? extraData + data : data;
    for (var x = 0; x < numOfMessages; x++) {
        counter++;
        messLength = data[1];
        //console.log(messLength);
        //console.log(data.length);
        if (data.length >= messLength-1) {
            //console.log('BufBefore' + data.length +  '\n' + data);
            tempData = data.slice(2,messLength+1);
            //console.log(messLength);
            //console.log(messLength-2);
            data = data.slice(messLength+2);
            //console.log('\nBuffAfter' + data.length +  '\n' + data);
            //console.log(tempData.toString());
            writeToLog((tempData.toString()) + requestObject.scenarioNo + requestObject.fieldSeparator);
            extraData = false;
        }
        else {
            counter--;
            extraData = data;
        }
    }
    endSocket();
});

client.on('close', function() {
    console.log('I got closed with ', counter, ' messages');
    closeStatus = client.destroy();
    writeTrailerRecord();
    //console.log(stringToLog);
});

var endSocket = function(){
    if (counter >= messageCounter && count >= messageCounter) {
        console.log("MESSAGES", counter);
        endStatus = client.end();
        console.log('I shut Down');
    }
};