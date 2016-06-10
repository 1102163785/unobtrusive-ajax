/// <reference path="http://cdn.bootcss.com/jquery/2.2.4/jquery.min.js" />
// JavaScript source code

/*

*/
(function () {
    var Ajax = {};

    //版本号：0.1.0 Alpha。
    Ajax.ver = '0.1.0 Alpha';

    //版本号，这个字段是留给以后方便在代码里鉴别版本的。
    Ajax.version = 1;


    $(function () {
        $(document).on("submit", "form[data-ajax-withfile=true]", null, function (evt) {
            //alert(evt.currentTarget);
            var fd = new FormData(evt.currentTarget);
            evt.preventDefault();
            $.ajax({
                url: evt.currentTarget.action,
                method: 'post',
                data: fd,
                contentType: 'multipart/form-data',
                processData: false,//不改变传输数据中的对象
                success: function (data) {
                    //You can do something here.
                    //处理一些事情，添加你想要的代码。data就是返回的数据。
                }
            });
        });
    });

    /*注册命名空间*/
    window.Ajax = Ajax;
})();
