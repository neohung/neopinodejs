$(document).ready(function () {
    if (!Modernizr.websockets) {
        alert('WebSockets are not supported.');
        return;
    }

    var settings = {
        host: 'ws://localhost:9000',
        pictureContainerID: 'pictureContainer',
        pictureID: 'picture',
        titleID: 'title'
    };

    $("#consoleMsg").html("Try connect!!!" );
    pixSocket.connect(settings);
	
});

var pixSocket = function() {
    var settings,

    connect = function(_settings) {
        settings = _settings;
        var connection = new WebSocket(settings.host);

        connection.onopen = function () {
			processBTN(connection);
		};

        connection.onmessage = function (message) {
            var msg = JSON.parse(message.data);
	       $("#consoleMsg" ).html("onmessage:"+ msg.src+","+msg.date);
		   //
		   var picContainer = $('#' + settings.pictureContainerID);
		   picContainer.fadeOut(0, function() {
		   $('#' + settings.pictureID).attr('src', msg.src+"?"+msg.date);
		   $('#' + settings.titleID).html(msg.text);
		   picContainer.fadeIn(0);
		   });
		   //
           //showPicture(pix.media.m, pix.title);
        };
	connection.onclose = function (event){
	    $("#consoleMsg" ).html("websocket close!!!");
	};
    },

    showPicture = function(src, title) {
        var picContainer = $('#' + settings.pictureContainerID);
		$("#consoleMsg" ).html("show image");
        //picContainer.fadeOut(500, function() {
        //$('#' + settings.pictureID).attr('src', src);
		//i = i % 5;
		//i++;
	    //d = new Date();
	    //$('#' + settings.pictureID).attr('src', "/num/1.jpg?"+d.getTime());
        //$('#' + settings.titleID).html(title);
         //   picContainer.fadeIn(500);
        //});
    };

    return {
        connect: connect
    };
}();


var processBTN = function(connection) {
	lbutton=document.getElementById('left_button');
	lbutton.onclick=function(){
		 $("#consoleMsg" ).html("You press Left");
		 var msg = {
			id: 0,
            type: "btnctl",
            text: "client click left button",
			src: "",
            date: Date.now()
         };
		 json_data = JSON.stringify(msg);
		 connection.send(json_data);
	};
	rbutton=document.getElementById('right_button');
	rbutton.onclick=function(){
		 $("#consoleMsg" ).html("You press R");
		 var msg = {
			id: 1,
            type: "btnctl",
            text: "client click right button",
			src: "",
            date: Date.now()
         };
		 json_data = JSON.stringify(msg);
		 connection.send(json_data);
	};
	ubutton=document.getElementById('up_button');
	ubutton.onclick=function(){
		 $("#consoleMsg" ).html("You press U");
		 var msg = {
			id: 2,
            type: "btnctl",
            text: "client click up button",
			src: "",
            date: Date.now()
         };
		 json_data = JSON.stringify(msg);
		 connection.send(json_data);
	};
	dbutton=document.getElementById('down_button');
	dbutton.onclick=function(){
		 $("#consoleMsg" ).html("You press D");
		 var msg = {
			id: 3,
            type: "btnctl",
            text: "client click down button",
			src: "",
            date: Date.now()
         };
		 json_data = JSON.stringify(msg);
		 connection.send(json_data);
	};
};