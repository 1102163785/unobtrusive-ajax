/// <reference path="http://cdn.bootcss.com/jquery/2.2.4/jquery.min.js" />
// JavaScript source code

/*

*/
(function () {
    var Ajax = {};

    //�汾�ţ�0.1.0 Alpha��
    Ajax.ver = '0.1.0 Alpha';

    //�汾�ţ�����ֶ��������Ժ󷽱��ڴ��������汾�ġ�
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
                processData: false,//���ı䴫�������еĶ���
                success: function (data) {
                    //You can do something here.
                    //����һЩ���飬�������Ҫ�Ĵ��롣data���Ƿ��ص����ݡ�
                }
            });
        });
    });

    /*ע�������ռ�*/
    window.Ajax = Ajax;
})();
