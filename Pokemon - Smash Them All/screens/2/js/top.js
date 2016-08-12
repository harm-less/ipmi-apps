function pad2(number) {
    return (number < 10 ? '0' : '') + number
}

var clock = 0;
setInterval(function () {
    if (clock <= 0) return;
    clock--;

    if (clock <= 0) {
        // Show screen saver
        $('.end.screen').addClass('hidden');
        $('.game.screen').addClass('hidden');
        $('.screensaver.screen').removeClass('hidden');
        $('video')[0].currentTime = 0;
    }
}, 1000);

$(function () {
    var state = {};
    var hiScore = 0;

    var updateTime = function (time) {
        var seconds = time % 60;
        var minutes = Math.floor(time / 60);
        $('.time').text(minutes + ":" + pad2(seconds));
    };

    var socket = io('http://' + $.cookie('ip') + ':' + $.cookie('comm_port'));
    socket.on('connect', function () {
        socket.emit('application.retrieve', "highscore");
    });

    socket.on('application.get', function (response) {
        console.log('Data received:', response);
        if (response.value > hiScore) {
            hiScore = response.value;
            $('.hi-score').text(hiScore);
        }
    });

    socket.on('application.message', function (msg) {
        console.log(msg);
        updateTime(msg.time);
        $('.score').text(msg.score);

        if (msg.state == 'menu' && msg.state != state.state) {
            $('.prev-score').text(state.score);
        }
        if (msg.score > hiScore) {
            hiScore = msg.score;
            $('.hi-score').text(hiScore);
            socket.emit('application.set', {"highscore": hiScore});
        }

        if (msg.state != state.state) {
            if (msg.state == 'menu') {
                $('.end.screen').removeClass('hidden');
                $('.screensaver.screen').addClass('hidden');
                $('.game.screen').addClass('hidden');
                clock = 180;
            } else if (msg.state == 'running') {
                $('.end.screen').addClass('hidden');
                $('.game.screen').removeClass('hidden');
                $('.screensaver.screen').addClass('hidden');
                clock = 0;
            }
        }

        state = msg;

    });
});
