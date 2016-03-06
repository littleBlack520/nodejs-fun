(function() {
    var $article_ul = $(".article-ul"),
        $loading = $(".loading");
    var total = parseInt($article_ul.attr("data-total")),
        count = 10;
    function getData(index) {
        $article_ul.empty()
        $loading.show();
        var nowtime  = new Date().getTime();
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
                    html = "";

                if (length > 0) {
                    for (var i = 0; i < length; i++) {
                        html += '	<li> <div class="info clearfix"><div class="portrait"></div> <div class="author"> ' + list[i].author + ' </div> </div> <div class="article"> ' + list[i].content + '  </div> <div class="other"> <p class="time">' + list[i].createTime + ' </p> </div> </li>';
                    }
                }
                var nexttime= new Date().getTime();
                var diff = nexttime - nowtime;
                if(diff<1000){
                	setTimeout(function(){
                        $loading.hide();
                        $article_ul.html(html);
                    },1000-diff);
                }else{
                    $loading.hide();
                    $article_ul.html(html);
                }

            },
            error: function() {
                console.log("系统错误");
            }
        });
    }

    $.Page({
        total: Math.ceil(total/count), //总条数
        count: count, //分页控件最多显示几页,
        curnum: 1, //当前要显示的页数
        callback: getData //回调函数
    });
})();
