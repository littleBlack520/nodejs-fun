这个我刚入门学nodejs时，写的一个网站。网页框架用express加mysql。
由于是上一年写的代码，当时nodejs还是用的是4.4的版本，所以没有用ES6的相关特性。但是作为刚入门nodejs的网站，还是有点参考意义的。所以我对这个网站重新整理了一下，发布到线上，开放源码给大家学学。
###运行
先安装网站所依赖的npm包  

```
npm install
```

由于使用的是mysql，所以你必须先安装mysql数据库才行。安装完mysql数据库后，在mysql的命令行中，载入本网站的数据库脚本。（C:\FunWeb\）换成你的自己的地址。

```
mysql>source C:\FunWeb\fun.sql
```

执行成功之后，你的数据库中应该有一个fun数据库。然后我们需要改一下数据库连接字符串，在models目录下的db.js文件中,其中的数据库的用户名user与密码password改成你自己的：

```
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root', //用户名
    password: '123456', //密码
    database: 'fun',
    multipleStatements: true
});
```

现在我们可以来运行网站，在命令行中输入：

```
npm start
```

启动成功之后，在浏览器中输入http://localhost:3000/就可以访问了。

###获取数据
由于还没有数据，所以我们看到仍是一个空网站。我写了两个脚本去爬取数据。这两个脚本在models目录中。
search.js爬取的是糗事百科（http://www.qiushibaike.com/）的文章，在命令行中输入node search.js来执行。其中主要使用了两个插件，一个是superagent，一个是cheerio。通过superagent去爬取网页，然后用cherrio来筛选数据。

默认爬取的是3个页面的数据，可以自己修改endPage的数量。

```
var getDataArr = [], //爬取的数据
    href ="http://www.qiushibaike.com/8hr/page/", //要爬取的网址
    startPage=1, //开始的页面
    endPage=3; //结束的页面
```

brow.js爬取的是花瓣网的表情包（http://huaban.com/boards/16886057//?md=newbn&funny），在命令行中输入node brow.js来执行。由于是直接调取花瓣网的接口获取数据的，所以不需要cherrio筛选数据。
默认爬取的是1000个图片，可以自己修改sum的数量。

```
var limit = 100, //每页的条数
    sum = 1000, //总条数
    count = sum / limit,
    max = 590908535, //开始的的图片ID
    url = "", //网址
    data = []; //获取的数据
```


