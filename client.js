var net = require('net');
var put = require('put');
var ip = require('ip');


var buf1 = new Buffer(2);
var requestString;
var serverInfo = {
    serviceIp : '192.168.101.210',
    servicePort : 2605
};
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
    scenarioNo  : 1,
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
    requestObject.scenarioNo = 1;
    //requestObject.responseDelay = delay;
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
    console.log(string)
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
client.connect(serverInfo.servicePort, serverInfo.serviceIp, function() {
    //console.log('Connected');
    requestString = writeRequest(client, 0);
    buf1.writeInt16BE(requestString.length);
    //console.log(buf1);
    //console.log(requestString);
    //console.log(requestString.length);
    writeToLog(requestString);
    //console.time('firstTimer');
    client.write(buf1);
    client.write(requestString);
});

client.on('data', function(data) {
    counter++;
    writeToLog(data.toString().slice(2).trim()+requestObject.scenarioNo+requestObject.fieldSeparator);
    //console.log("there was data");
    //console.log(data.toString());
    var date = Date.now();
    //console.log(date);
    if (counter < 100) {
        //console.log(counter);
        requestString = writeRequest(client, (Date.now()- date));
        //console.log(requestString);
        buf1.writeInt16BE(requestString.length);
        writeToLog(requestString);
        client.write(buf1);
        client.write(requestString);
        //console.log(Date.now());
        //console.log(Date.now()- date);
    }
    else {
        //console.log('half-shutdown');
        //console.timeEnd('firstTimer');
        endStatus = client.end();
    }
});

client.on('close', function() {
    //console.log('Connection closed, destroying socket');
    closeStatus = client.destroy();
    writeTrailerRecord();
});