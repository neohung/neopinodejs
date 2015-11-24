var socketServer = function() {
    data = null,
    timerID = null,
    socketServer = null,
    sockets =[],
    ws = require('websocket.io'), 
    fs = require('fs'),
    url = require('url'),
    http = require('http'),
   
    domain = require('domain'),
    httpDomain = domain.create(),
    socketDomain = domain.create(),
    reqDomain = domain.create(),
    httpListen = function(port) {
    console.log('httpListen port='+ port);
    httpDomain.on('error', function(err) {
            console.log('Error caught in http domain:' + err);
        });

        httpDomain.run(function() {
            http.createServer(function(req,res) {
                var pathname = url.parse(req.url).pathname;
                //console.log(pathname);
                if (pathname == '/' || pathname == '/index.html') {
                    readFile(res, 'index.html');
                }
                else {
                    readFile(res, '.' + pathname);
                }
            }).listen(port);
        });

    },

   readFile = function(res, pathname) {
        fs.readFile(pathname, function (err, data) {
            if (err) {
                console.log(err.message);
                res.writeHead(404, {'content-type': 'text/html'});
                res.write('File not found: ' + pathname);
                res.end();
            }
            else {
              res.write(data);
              res.end();
            }
        });       
    },

   socketListen = function(port) {
    console.log('do socketListen');
        socketDomain.on('error', function(err) {
            console.log('Error caught in socket domain:' + err);
        });
    socketDomain.run(function() { 
        console.log('socketServer listen: '+port);
            socketServer = ws.listen(port);
            socketServer.on('listening',function(){
                console.log('SocketServer is running');
            });
            socketServer.on('connection', function (socket) {
                console.log('SocketServer connection');
                sockets.push(socket);
    
                if (data == null) firstInitOnConn();
    
                socket.on('message', function (data) { 
                    var json_msg = JSON.parse(data);
                    processMessage(json_msg);
                });
                socket.on('close', function (data) { 
                    console.log('SocketServer close');
                });
            });
        });
   },

   processMessage = function(msg) {
       if (msg.type == 'btnctl'){
          switch (msg.id){
              case 0:
              {
                    console.log('Message received:, text', msg.text);
                    var tmp = JSON.parse(data);
                    if (tmp.id > 1){
                    tmp.id--;
                    };
                    tmp.date = Date.now();
                    tmp.date = Date.now();
                    tmp.src = "/num/"+tmp.id+".jpg";
                    data = JSON.stringify(tmp);
                    //console.log('Sending data...:'+tmp.id+',src='+tmp.src);
                    for(i=0;i<sockets.length;i++)
                    {
                        try {
                            sockets[i].send(data);
                        }   
                        catch (e)
                        {
                            console.log(e);                
                        }
                    }
              }
              break;
              case 1:
              {
                    console.log('Message received:, text', msg.text);
                    var tmp = JSON.parse(data);
                    if (tmp.id < 5){
                    tmp.id++;
                    };
                    tmp.date = Date.now();
                    tmp.date = Date.now();
                    tmp.src = "/num/"+tmp.id+".jpg";
                    data = JSON.stringify(tmp);
                    //console.log('Sending data...:'+tmp.id+',src='+tmp.src);
                    for(i=0;i<sockets.length;i++)
                    {
                        try {
                            sockets[i].send(data);
                        }   
                        catch (e)
                        {
                            console.log(e);                
                        }
                    }
              }
              break;
                case 2:
              {
                    console.log('Message received:, text', msg.text);
              }
              break;
                case 3:
              {
                    console.log('Message received:, text', msg.text);
              }
              break;
          };
        
       };
       
   };

   firstInitOnConn = function() {       
    console.log('do firstInitOnConnection');
    reqDomain.on('error', function(err) {
            console.log('Error caught in request domain:' + err);
        });
        reqDomain.run(function() { 
        console.log('do reqDomain.run');
        var msg = {
            type: "message",
            text: "1.jpg",
            src: "/num/1.jpg",
            id: 0,
            date: Date.now()
       };
        data = JSON.stringify(msg);
        sendPicture();
        timerID = setInterval(sendPicture, 1000);
        });
   },

   sendPicture = function() {
        if (sockets.length) {
        //var randomPicIndex = Math.floor(Math.random()*data.items.length);
        var tmp = JSON.parse(data);
        tmp.id%=5;
        tmp.id++;
        
        tmp.date = Date.now();
        tmp.text = tmp.id+".jpg";
        tmp.src = "/num/"+tmp.id+".jpg";
        data = JSON.stringify(tmp);
        //console.log('Sending data...:'+tmp.id+',src='+tmp.src);       
            for(i=0;i<sockets.length;i++)
            {
                try {
                    sockets[i].send(data);
                }   
                catch (e)
                {
                    console.log(e);                
                }
            }
        }
   },

    init = function(httpPort, socketPort) {
    console.log('do init');
        httpListen(httpPort);
        socketListen(socketPort);
    };

    return {
        init: init
    };
}();

module.exports = socketServer;
