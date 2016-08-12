# FAQ

## Bookmarks
- [How to connect to the TSPS?](#connectTSPS)
- [How to create a basic '_application_' for the IPMI-S?](#createApplication)
- [Extra functionality](#extraFunctionality)
    - [Websocket communication](#extraFunctionalityWS)
    - [Database](#extraFunctionalityDatabase)
- [Example application](#exampleApplication)

## <a name="connectTSPS"></a> How to connect to the TSPS?
To connect to our TSPS installation you will have to download the TSPS *example* package from [Sourceforge](https://sourceforge.net/projects/tsps/files/).

Once downloaded extract the examples and find the file `TSPS-1.2.js` under `web/library`. This file needs to be included in the page that is going to connect to the TSPS. 

Now it's a piece of cake to setup the connection and receive information:
```
var tsps = new TSPS.Connection('192.168.1.241', '7681');
tsps.connect();
var divs = {};

var updateDiv = function (person) {
    var W = $(document.body).innerWidth();
    var H = $(document.body).innerHeight();

    var div = divs[person.id];
    div.css('left', (1 - person.centroid.x) * W);
    div.css('top', (1 - person.centroid.y) * H);
    div.css('height', 20);
    div.css('width', 20);
};


tsps.onPersonEntered = function (person) {
    var div = divs[person.id] = $('<div class="tsps-person"></div>');
    $(document.body).append(div);
    updateDiv(person);
};

tsps.onPersonLeft = function (person) {
    try { divs[person.id].remove(); } catch (err) {}
};

tsps.onPersonMoved = function (person) {
    updateDiv(person);
};
tsps.onPersonUpdated = function (person) {
    updateDiv(person);
};
```

The _updateDiv_ function moves a DIV on the screen based on where a person is going in the real world. You can use this DIV to detect collisions with the elements that are shown on your page and perform an action. You can also make the DIV visible for debugging purposes (by setting a background color).

Here is a simple example of how to detect collisions and simulate mouse events:
```
setInterval(function () {
    $('[data-collide]').each(function () {
        var $div = $(this);
        var col = false;
        $('.tsps-person').each(function () {
            var innerCol = collision($(this), $div);
            if (innerCol)
                col = innerCol;
        });

        var oldcol = $div.data('tsps-status');
        if (col) {
            $div.trigger('mousemove');
        }
        if (col != oldcol) {
            if (col) {
                $div.trigger('mouseenter');
                $div.addClass('tsps-collision');
            } else {
                $div.trigger('mouseleave');
                $div.removeClass('tsps-collision');
            }
        }
        $div.data('tsps-status', col);
    });
}, 50);

function collision($div1, $div2) {
    var x1 = $div1.offset().left;
    var y1 = $div1.offset().top;
    var h1 = $div1.outerHeight(true);
    var w1 = $div1.outerWidth(true);
    var b1 = y1 + h1;
    var r1 = x1 + w1;
    var x2 = $div2.offset().left;
    var y2 = $div2.offset().top;
    var h2 = $div2.outerHeight(true);
    var w2 = $div2.outerWidth(true);
    var b2 = y2 + h2;
    var r2 = x2 + w2;

    return !(b1 < y2 || y1 > b2 || r1 < x2 || x1 > r2);
}
```

---

## <a name="createApplication"></a> How to create a basic '_application_' for the IPMI-S?

***Parts of this section can also be found on [IPMI.wirelab.nl](https://ipmi.wirelab.nl/applications/creation)***

An application that you upload to the IPMI-S is nothing more than a one (or more) web application(s) inside a `.zip` with some additional information. 

To create an application you'll need to have one (or more) web application with an `index.html`-file (this is important, without the index.html the created application won't work). 

You do not need to worry about resource URL's within the IPMI system. If the resources of your web application works locally, they will work on the IPMI.

---

To get started create a `screens`-folder and a file named `manifest.json`. Within the `screens`-folder you will need to create the necessary folders for the amount of web applications you want to add. If you only have one, create a folder named `1`. If you have two, you would create two folders named `1` and `2`, etc.

The folder structure after doing this should look a bit like this:
```
Wirelab
    manifest.json
    screens
        1
            index.html
            tsps.js
            planet.png
        2 
            index.html
            video.mp4
```

---

Once you've created your folder structure, you'll have to edit the manifest.json file to contain something like the following:
```
{ 
    "version": "3.1a", 
    "screens": { 
        "1": "Floor", 
        "2": "Screen"
    }
}
```

- version: version is the current version of the application and must be different than the current version, if an application already exists
- screens: screens is an array that contains the amount of web applications in the `screens`-folder and their name (which will be shown on the IPMI-C information screen).

Now you'll need to compress/package everything into a `.zip` file. Once your `.zip` has been created it can be used to create a new application through the "_Applications_"-tab or to update an existing application.

## <a name="extraFunctionality"></a> Extra functionality 

### Websocket based
Within your webapp you have the ability to use two extra functions by connecting to a communication Websocket which is hosted by the IPMI client. The data required to connect to it is passed to your application through a cookie, which could be retrieved like this:
```
var socket = io('http://' + $.cookie('ip') + ':' + $.cookie('comm_port'));
```
_This snippet uses [jQuery Cookie](https://github.com/carhartl/jquery-cookie) to deal with cookies and [Socket.IO](http://socket.io/) to deal with the Websockets. Whilst debugging you can set the IP to `192.168.1.124` and the port to `4000`._

#### <a name="extraFunctionalityWS"></a> Websocket communication
If you have two web applications that need to communicate with each other (`screen 1` and `screen 2` for example) you can do this by sending a message through the communication socket.

To communicate to other screens you just emit an event named `application.message` which will be broadcast to all **active** screens by the IPMI client (excluding you).

##### Example sending party
```
socket.emit('application.message', 'Hello!');
```
##### Example receiving party
```
socket.on('application.message', function (msg) {
    console.log(msg);
});
```
#### <a name="extraFunctionalityDatabase"></a> Database
The IPMI client allows you to store values in a key-value based database. You can use this function by sending specific commands to the communication socket.
 
- `application.set` By sending this event with a JSON object you can store something in the database. 
    > socket.emit('application.set', {"highscore": hiScore});
- `application.retrieve` By sending this event with a key, you can tell the database to retrieve a value. The socket will reply with a `application.get` event containing a JSON object, `{key: "highscore, value: 3}`.
    > socket.emit('application.retrieve', "highscore");
    
##### Example code:
```
var socket = io('http://' + $.cookie('ip') + ':' + $.cookie('comm_port'));
socket.on('connect', function () {
    socket.emit('application.retrieve', "highscore");
});

socket.on('application.get', function (response) {
    console.log('Data received:', response);
    if (value > hiScore) {
        hiScore = response.value;
        $('.hi-score').text(hiScore);
    }
});

socket.on('application.message', function (msg) {
    $('.score').text(msg.score);

    if (msg.state == 'menu' && msg.state != state.state) {
        $('.prev-score').text(state.score);
    }
    if (msg.score > hiScore) {
        hiScore = msg.score;
        $('.hi-score').text(hiScore);
        socket.emit('application.set', {"highscore": hiScore});
    }
});
```
_This snippet uses [jQuery Cookie](https://github.com/carhartl/jquery-cookie) to deal with cookies and [Socket.IO](http://socket.io/) to deal with the Websockets._

## <a name="exampleApplication"></a> Example application
A very good application to look at is the `Pokemon - Smash Them all`, as it contains all the documented functions above. Another good example is `Painting`, which is a very basic one showcasing what TSPS can do (in this casign drawing a line where someone walks).