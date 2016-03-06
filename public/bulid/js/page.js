(function() {
    $.extend({
        Page: function(options) {
            var total = options.total || 10,
                count = options.count || 5,
                curnum = options.curnum || 1,
                callback = options.callback || function() {};

            function setPageData() {
                var $page = $("#page"),
                    $li = $();
                var html = "<li class='first-dot dots hide'>...</li>";
                for (var i = 1; i < total + 1; i++) {
                    html += (i <= count ? "<li>" + i + "</li>" : "<li class='hide'>" + i + "</li>");
                }
                if (total > count) {
                    html += "<li class='last-dot dots'>...</li>";
                }
                $page.html(html);
                $li = $page.find("li");

                setBtn(curnum, total, $li,true);
                setClick($li, total);
                return this;
            }

            function setBtn(index, length, $li,flag) {
                var $prev = $(".prev"),
                    $next = $(".next"),
                    $first_dot = $(".first-dot"),
                    $last_dot = $(".last-dot");

                $li.eq(index).addClass("on").siblings('li').removeClass("on");
                if (index == 1) {
                    $prev.addClass("off")
                } else if (index == length) {
                    $next.addClass("off")
                } else {
                    $(".off").removeClass("off");
                }
                if (index < count) {
                    $li.hide().slice(1, count + 1).show();
                    $last_dot.show();
                } else if (index > length - count + 1) {
                    $li.hide().slice(length - count + 1, length + 1).show();
                    $first_dot.show();
                } else {
                    $li.hide().slice(index - Math.floor(count / 2), index + 1 + Math.floor(count / 2)).show();
                    $last_dot.show();
                    $first_dot.show();
                }
                if(!flag){
                    callback(index);
                }
               
            }

            function setClick($li, total) {
                var $action = $(".action"),
                    $page_btn = $(".page-btn"),
                    $page_err = $(".page-err"),
                    $page_input = $(".page-input"),
                    $dots = $(".dots");
                $li.on("click", function() {
                    $dots.hide();
                    var $this = $(this),
                        index = $this.index();
                    setBtn(index, total, $li);

                });
                $page_btn.on("click", function() {
                    var $this = $(this),
                        value = $.trim($page_input.val());
                    if (/\D/.test(value)) {
                        $page_err.show();
                    } else
                        $page_err.hide(); {
                        value = value < 1 ? 1 : value;
                        value = value > total ? total : value;
                        $page_input.val(value);
                        setBtn(parseInt(value), total, $li);
                    }
                });
                $action.on("click", function() {
                    var $this = $(this),
                        index = $(".page li.on").index();
                    if (!$this.hasClass('off')) {
                        if ($this.hasClass('prev')) {
                            index--;
                        } else {
                            index++;
                        }
                        setBtn(index, total, $li);
                    }
                });

            }
            setPageData();

        }
    })
})();
