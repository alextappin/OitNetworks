/*
// Load the TCP Library
net = require('net');

// Keep track of the chat clients
var clients = [];

// Start a TCP Server
net.createServer(function (socket) {

    // Identify this client
    socket.name = socket.remoteAddress + ":" + socket.remotePort;

    // Put this new client in the list
    clients.push(socket);

    // Send a nice welcome message and announce
    socket.write("Welcome " + socket.name + "\n");
    broadcast(socket.name + " joined the chat\n", socket);

    // Handle incoming messages from clients.
    socket.on('data', function (data) {
        broadcast(socket.name + "> " + data, socket);
        socket.write("Here is your " + data + "\n");
    });

    // Remove the client from the list when it leaves
    socket.on('end', function () {
        clients.splice(clients.indexOf(socket), 1);
        broadcast(socket.name + " left the chat.\n");
    });

    // Send a message to all clients
    function broadcast(message, sender) {
        clients.forEach(function (client) {
            // Don't want to send it to sender
            if (client === sender) return;
            client.write(message);
        });
        // Log it to the server output too
        process.stdout.write(message)
    }

}).listen(5000);

// Put a friendly message on the terminal of the server.
console.log("Chat server running at port 5000\n");*/


var net = require('net');

var messLength;
var tempData;
var stringToLog;
var usersConnected = [];
var numberOfConnections = 0;
var clients = [];
var extraData;

var writeToLog = function writeToLog(text) {
    var string = text + "\n\r";
    //console.log(string)
    //stringToLog+=string;
    console.log(string);
};

/*
var server = net.createServer(function(socket) {
    socket.name = socket.remoteAddress + ":" + socket.remotePort;
    clients.push(socket);
    socket.write('Connect');
    socket.on('data', function (data) {
        //tempData = data.slice(2,messLength+1);
        console.log(data.toString());
        //console.log(messLength-2);
        //data = data.slice(messLength+2);
        //writeToLog((tempData.toString()) + '2' + '|');
        socket.write(data);
    });
    server.getConnections(function(err, count) {
        if (count != numberOfConnections) {
            console.log("Connections:", count);
            numberOfConnections = count;
        }
    });
});

server.listen(2605, '10.0.0.21', function() {
});

server.close*/
var newData = "";

/*net.createServer(function (socket) {

    // Identify this client
    socket.name = socket.remoteAddress + ":" + socket.remotePort;

    // Put this new client in the list
    clients.push(socket);

    // Send a nice welcome message and announce
    //socket.write("Welcome " + socket.name + "\n");
    //broadcast(socket.name + " joined the chat\n", socket);

    // Handle incoming messages from clients.
    socket.on('data', function (data) {
        //console.log(Math.ceil(Date.now() / 1000) + "\n");
        newData = data.toString();
        newData = newData.slice(0,2) + 'RSP' + newData.slice(5);

        console.log(data.slice(2).toString() + "\n");
        console.log(newData.slice(2).toString() + "\n");
        socket.write(newData);

        //broadcast(socket.name + "> " + data, socket);
    });

    // Remove the client from the list when it leaves
    socket.on('end', function () {
        clients.splice(clients.indexOf(socket), 1);
        //broadcast(socket.name + " left the chat.\n");
    });

/!*    // Send a message to all clients
    function broadcast(message, sender) {
        clients.forEach(function (client) {
            // Don't want to send it to sender
            if (client === sender) return;
            client.write(message);
        });
        // Log it to the server output too
        process.stdout.write(message)
    }*!/

    socket.on('error', function () {

    });

}).listen(2605);*/


net.createServer(function (socket) {

    // Identify this client
    socket.name = socket.remoteAddress + ":" + socket.remotePort;

    // Put this new client in the list
    clients.push(socket);

    // Send a nice welcome message and announce
    //socket.write("Welcome " + socket.name + "\n");
    //broadcast(socket.name + " joined the chat\n", socket);

    // Handle incoming messages from clients.
    socket.on('data', function (data) {
        //console.log(Math.ceil(Date.now() / 1000) + "\n");
/*        newData = data.toString();
        newData = newData.slice(0,2) + 'RSP' + newData.slice(5);

        console.log(data.slice(2).toString() + "\n");
        console.log(newData.slice(2).toString() + "\n");
        socket.write(newData);*/




        var numOfMessages = data.toString().match(/REQ/g) ? data.toString().match(/REQ/g).length : 0;
//console.log('fffffffff',data.toString() + '\n' + data.length+ '\n');
        var tempData;
        var messLength;
        var flag = true;
        /*console.log(latentObj.delayed[1].time);*/
        /*console.log(Date.now());*/
        data = extraData ? extraData + data : data;
        for (var x = 0; x < numOfMessages; x++) {
            messLength = data[1];
            if (data.length >= messLength-1) {
                tempData = data.slice(2,messLength+1);
                newData = data.slice(0,2) + 'RSP' + tempData.toString().slice(3);
                data = data.slice(messLength+2);
                //console.log(newData.toString());
                writeToLog((tempData.toString()));
                writeToLog(newData.slice(2));
                socket.write(newData);
                extraData = false;
            }
            else {
                extraData = data;
            }
        }

    });

    // Remove the client from the list when it leaves
    socket.on('end', function () {
        clients.splice(clients.indexOf(socket), 1);
    });

    socket.on('error', function () {
    });

}).listen(2605);