$(function () {
    var socket = io('http://' + $.cookie('ip') + ':' + $.cookie('comm_port'));
    var game = window.game = {};

    var sendState = function () {
        socket.emit('message', {
            score: game.score,
            time: game.time,
            state: game.state
        });
    };

    var max = 3;
    game.digletts = $('.diglet-wrapper');
    game.score = 0;
    game.time = 0;

    game.addScore = function () {
        game.score++;
        sendState();
    };

    game.updateState = function (newState) {
        game.state = newState;
        game.digletts.removeClass('animating');
        game.digletts.find('.diglet-popup').removeClass('dead boo');

        if (game.state == 'running') {
            game.score = 0;
            game.time = 60;
        }

        if (game.state == 'menu') {
            $('.pokemon').parent().addClass('hidden');
            $('.menu').parent().removeClass('hidden');
        } else {
            $('.pokemon').parent().removeClass('hidden');
            $('.menu').parent().addClass('hidden');
        }

        sendState();
    };

    setInterval(function () {
        if (game.state != 'running')
            return;

        var diglett = $(game.digletts[Math.floor(Math.random() * game.digletts.length)]);
        var popup = diglett.find('.diglet-popup');
        if (popup.hasClass('dead')) return;
        if (diglett.hasClass('tsps-collision')) return;
        if ($('.diglet-popup.boo').length < max) {
            popup.toggleClass('boo');
        } else {
            popup.removeClass('boo');
        }
    }, 400);

    game.digletts.on('mouseenter', function (e) {
        if (game.state != 'running')
            return;

        var $diglett = $(e.currentTarget);
        var $popup = $diglett.find('.diglet-popup');
        if ($popup.hasClass('boo') && !$diglett.hasClass('animating')) {
            $diglett.addClass('animating');
            $diglett.addClass('smash');
            $popup.addClass('dead');
            setTimeout(function () {
                $diglett.removeClass('smash');
            }, 250);
            setTimeout(function () {
                $popup.removeClass('boo');
                setTimeout(function () {
                    $popup.removeClass('dead');
                    $diglett.removeClass('animating');
                }, 300);
            }, 500);
            game.addScore();
        }
    });

    setInterval(function () {
        if (game.time <= 0)
            return;
        if (game.state != 'running')
            return;
        game.time--;
        sendState();
        if (game.time <= 0) {
            game.updateState('menu');
        }
    }, 1000);

    game.updateState('menu');

    $('.menu .button').on('mouseenter', function () {
        setTimeout(function () {
            if ($('.menu .button').hasClass('tsps-collision')) {
                game.updateState('running');
            }
        }, 1000);
    });
});
