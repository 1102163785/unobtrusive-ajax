/// <reference path="http://cdn.bootcss.com/jquery/2.2.4/jquery.min.js" />
// JavaScript source code

/*


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

    / *注册命名空间* /
    window.Ajax = Ajax;
})();
*/

(function ($) {
    var data_click = "unobtrusiveAjaxClick",
        data_target = "unobtrusiveAjaxClickTarget",
        data_validation = "unobtrusiveValidation";

    function getFunction(code, argNames) {
        var fn = window, parts = (code || "").split(".");
        while (fn && parts.length) {
            fn = fn[parts.shift()];
        }
        if (typeof (fn) === "function") {
            return fn;
        }
        argNames.push(code);
        return Function.constructor.apply(null, argNames);
    }

    function isMethodProxySafe(method) {
        return method === "GET" || method === "POST";
    }

    function asyncOnBeforeSend(xhr, method) {
        if (!isMethodProxySafe(method)) {
            xhr.setRequestHeader("X-HTTP-Method-Override", method);
        }
    }

    function asyncOnSuccess(element, data, contentType) {
        var mode;

        if (contentType.indexOf("application/x-javascript") !== -1) {  // jQuery already executes JavaScript for us
            return;
        }

        mode = (element.getAttribute("data-ajax-mode") || "").toUpperCase();
        $(element.getAttribute("data-ajax-update")).each(function (i, update) {
            var top;

            switch (mode) {
                case "BEFORE":
                    top = update.firstChild;
                    $("<div />").html(data).contents().each(function () {
                        update.insertBefore(this, top);
                    });
                    break;
                case "AFTER":
                    $("<div />").html(data).contents().each(function () {
                        update.appendChild(this);
                    });
                    break;
                case "REPLACE-WITH":
                    $(update).replaceWith(data);
                    break;
                default:
                    $(update).html(data);
                    break;
            }
        });
    }

    function asyncRequest(element, options) {
        var confirm, loading, method, duration;

        confirm = element.getAttribute("data-ajax-confirm");
        if (confirm && !window.confirm(confirm)) {
            return;
        }

        loading = $(element.getAttribute("data-ajax-loading"));
        duration = parseInt(element.getAttribute("data-ajax-loading-duration"), 10) || 0;

        $.extend(options, {
            type: element.getAttribute("data-ajax-method") || element.method,//将undefined替换为element.method
            url: element.getAttribute("data-ajax-url") || element.action,//将undefined替换为element.action
            cache: !!element.getAttribute("data-ajax-cache"),
            beforeSend: function (xhr) {
                var result;
                asyncOnBeforeSend(xhr, element.method);//method->element.method
                result = getFunction(element.getAttribute("data-ajax-begin"), ["xhr"]).apply(element, arguments);
                if (result !== false) {
                    loading.show(duration);
                }
                return result;
            },
            complete: function () {
                loading.hide(duration);
                getFunction(element.getAttribute("data-ajax-complete"), ["xhr", "status"]).apply(element, arguments);
            },
            success: function (data, status, xhr) {
                asyncOnSuccess(element, data, xhr.getResponseHeader("Content-Type") || "text/html");
                getFunction(element.getAttribute("data-ajax-success"), ["data", "status", "xhr"]).apply(element, arguments);
            },
            error: function () {
                getFunction(element.getAttribute("data-ajax-failure"), ["xhr", "status", "error"]).apply(element, arguments);
            }
        });

        /*把这里注释了*/
        //options.data.push({ name: "X-Requested-With", value: "XMLHttpRequest" });

        //if (!isMethodProxySafe(method)) {
        //    options.type = "POST";
        //    //options.data.push({ name: "X-HTTP-Method-Override", value: method });
        //}

        //alert(JSON.stringify(options));
        
        $.ajax(options);
    }

    function validate(form) {
        var validationInfo = $(form).data(data_validation);
        return !validationInfo || !validationInfo.validate || validationInfo.validate();
    }

    $(document).on("click", "a[data-ajax=true]", function (evt) {
        evt.preventDefault();
        asyncRequest(this, {
            url: this.href,
            type: "GET",
            data: {}//[]->{}
        });
    });

    $(document).on("click", "form[data-ajax=true] input[type=image]", function (evt) {
        var name = evt.target.name,
            target = $(evt.target),
            form = $(target.parents("form")[0]),
            offset = target.offset();

        form.data(data_click, [
            { name: name + ".x", value: Math.round(evt.pageX - offset.left) },
            { name: name + ".y", value: Math.round(evt.pageY - offset.top) }
        ]);

        setTimeout(function () {
            form.removeData(data_click);
        }, 0);
    });

    $(document).on("click", "form[data-ajax=true] :submit", function (evt) {
        var name = evt.currentTarget.name,
            target = $(evt.target),
            form = $(target.parents("form")[0]);

        form.data(data_click, name ? [{ name: name, value: evt.currentTarget.value }] : []);
        form.data(data_target, target);

        setTimeout(function () {
            form.removeData(data_click);
            form.removeData(data_target);
        }, 0);
    });

    $(document).on("submit", "form[data-ajax=true]", function (evt) {
        var clickInfo = $(this).data(data_click) || [],
            clickTarget = $(this).data(data_target),
            isCancel = clickTarget && clickTarget.hasClass("cancel");
        evt.preventDefault();
        if (!isCancel && !validate(this)) {
            return;
        }
        asyncRequest(this, {
            url: this.action,
            type: evt.currentTarget.method || "GET",
            data: new FormData(evt.currentTarget),//clickInfo.concat($(this).serializeArray())
            contentType: 'multipart/form-data',
            processData: false//不改变传输数据中的对象
        });
    });
}(jQuery));


