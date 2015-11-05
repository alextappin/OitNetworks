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
var requestObject = {
    tcpHeader   : 0,
    messageType : 'REQ',
    fieldSeparator :'|',
    msTimeStamp : 0,
    requestID : '',
    studentName : 'AlexanderTappin',
    studentID   : '220-361',
    responseDelay   : 0,
    clientIPAddress : ip.address(),
    clientServicePort   : 0,
    clientSocketNo  : 0,
    foreignHostIPAddress    : '',
    foreignHostServicePort  : 0,
    studentData : '',
    scenarioNo  : 0,
    totalLength : 0,
    valueInTCPHeader    : 0
};
var unique = 1;

var writeRequest = function(cli) {
    requestObject.msTimeStamp = Math.ceil(Date.now() / 1000);
    requestObject.requestID = unique++;
    requestObject.clientServicePort = cli.address().port;
    requestObject.foreignHostIPAddress = serverInfo.serviceIp;
    requestObject.foreignHostServicePort = serverInfo.servicePort;
    requestObject.scenarioNo = 1;
    var resp = requestObject.messageType + requestObject.fieldSeparator +
        requestObject.msTimeStamp + requestObject.fieldSeparator + requestObject.requestID +
        requestObject.fieldSeparator + requestObject.studentName + requestObject.fieldSeparator +
        requestObject.studentID + requestObject.fieldSeparator + requestObject.responseDelay +
        requestObject.fieldSeparator + requestObject.clientIPAddress + requestObject.fieldSeparator +
        requestObject.clientServicePort + requestObject.fieldSeparator + requestObject.clientSocketNo +
        requestObject.fieldSeparator + requestObject.foreignHostIPAddress + requestObject.fieldSeparator +
        requestObject.foreignHostServicePort + requestObject.fieldSeparator + requestObject.studentData +
        requestObject.fieldSeparator + requestObject.scenarioNo + requestObject.fieldSeparator +
        requestObject.totalLength + requestObject.fieldSeparator + requestObject.valueInTCPHeader;

    return resp;
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
    console.log('Connected');
    requestString = writeRequest(client);
    buf1.writeInt16BE(requestString.length);
    console.log(buf1);
    console.log(requestString);
    console.log(requestString.length);
    client.write(buf1);
    client.write(requestString);
});

client.on('data', function(data) {
    counter++;
    console.log('data');
    console.log(data);
    console.log(data.toString());
    console.log("there was data");
    if (counter < 100) {
        console.log(counter);
        requestString = writeRequest(client);
        buf1.writeInt16BE(requestString.length);
        client.write(buf1);
        client.write(requestString);
    }
    else {
        console.log('ending');
        client.end();
    }
});

client.on('close', function() {
    console.log('Connection closed');
    client.destroy();
});