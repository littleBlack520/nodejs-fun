    function getData(index, count) {

        $loading.show();
        $.ajax({
            url: "",
            data: {
                page: index,
                count: count,
                ajax: "true"
            },
            type: "get",
            success: function(result) {
                var list = result.list || [],
                    length = list.length,
                    html = "",
                    $dom = null;

                if (length > 0) {
                    for (var i = 0; i < length; i++) {
                        if (i < colnum) {
                            $dom = $li1;
                        } else if (i >= colnum && i < 2 * colnum) {
                            $dom = $li2;
                        } else if (i >= 2 * colnum && i < 3 * colnum) {
                            $dom = $li3;
                        } else {
                            $dom = $li4;
                        }
                        $dom.append(' <div class="pic-box"><img src="' + list[i].imagePath + '" alt=""></div>');

                    }
                }

                $loading.hide();
                cur++;


            },
            error: function() {
                console.log("系统错误");
            }
        });
    }
    var $watefull_list = $(".watefull-list"),
        $loading = $(".loading"),
        $li1 = $(".li-1"),
        $li2 = $(".li-2"),
        $li3 = $(".li-3"),
        $li4 = $(".li-4"),
        count = 20,
        total = parseInt($watefull_list.attr("data-total")),
        times = total / count,
        colnum = count / 4,
        cur = 2;

    var srollPos , //滚动条距离顶部的高度
        windowHeight , //窗口的高度
        dbHiht ; //整个页面文件的高度
    $(window).scroll(function() {
            srollPos = $(window).scrollTop(),
            windowHeight = $(window).height(),
            dbHiht = $("body").height();
        if ((windowHeight + srollPos) >= (dbHiht) && cur <= times) {
            getData(cur, count);
        }

    });
