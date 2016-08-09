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

$(function () {
    var tsps = window.gametsps = {};
    var divs = tsps.divs = {};

    var updateDiv = function (person) {
        var W = $(document.body).innerWidth();
        var H = $(document.body).innerHeight();

        var div = divs[person.id];
        div.css('left', (1 - person.centroid.x) * W);
        div.css('top', (1 - person.centroid.y) * H);
        div.css('height', 20);
        div.css('width', 20);
    };

    tsps.connection = new TSPS.Connection('192.168.1.241', '7681');
    tsps.connection.connect();

    tsps.connection.onPersonEntered = function (person) {
        var div = divs[person.id] = $('<div class="tsps-person"></div>');
        $(document.body).append(div);
        updateDiv(person);
    };

    tsps.connection.onPersonLeft = function (person) {
        try {
            divs[person.id].remove();
        } catch (err) {
        }
    };

    tsps.connection.onPersonMoved = function (person) {
        updateDiv(person);
    };
    tsps.connection.onPersonUpdated = function (person) {
        updateDiv(person);
    };

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
});
