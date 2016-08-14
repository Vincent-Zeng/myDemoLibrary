var AjaxUtil = {            //不能写成AjaxUtil = function(){
    XMLHttpRequest:function() {
        if(typeof XMLHttpRequest != "undefined")
        {
            return new XMLHttpRequest();
        }
        else if(typeof ActiveXObject != "undefined")//用于IE5及IE6
        {
            if(typeof arguments.callee.activeXString != "string")
            {
                var versions = ["MSXML2.XMLHttp.6.0","MSXML2.XMLHttp.3.0","MSXML2.XMLHttp"],i,len;
                for(i=0,len = versions.length;i < len;i++)
                {
                    try
                    {
                        new ActiveXObject(versions[i]);
                        arguments.callee.activeXString = versions[i];
                        break;
                    }catch(ae)
                    {

                    }
                }
            }
            return new ActiveXObject(arguments.callee.activeXString);
        }else
        {
            throw new Error("No XHR object available.");
        }
    },
    addURLParam:function(url,name,value){
        url += (url.indexOf("?") == -1?"?":"&");
        url += encodeURIComponent(name) + "=" + encodeURIComponent(value);
        return url;
    },
    serializeForm:function(form){
        var parts = [],
            field = null,
            i,
            len,
            j,
            optLen,
            option,
            optValue;
        for (i=0, len=form.elements.length; i < len; i++){
            field = form.elements[i];
            switch(field.type){
                case "select-one":
                case "select-multiple":
                    if (field.name.length){
                        for (j=0, optLen = field.options.length; j < optLen; j++){
                            option = field.options[j];
                            if (option.selected){
                                optValue = "";
                                if (option.hasAttribute){
                                    optValue = (option.hasAttribute("value") ?
                                        option.value : option.text);
                                } else {
                                    optValue = (option.attributes["value"].specified ?
                                        option.value : option.text);
                                }
                                parts.push(encodeURIComponent(field.name) + "=" +
                                    encodeURIComponent(optValue));
                            }
                        }
                    }
                    break;
                case undefined: //字段集
                case "file": //文件输入
                case "submit": //提交按钮
                case "reset": //重置按钮
                case "button": //自定义按钮
                    break;
                case "radio": //单选按钮
                case "checkbox": //复选框
                    if (!field.checked){
                        break;
                    }
                /* 执行默认操作*/
                default:
                    //不包含没有名字的表单字段
                    if (field.name.length){
                        parts.push(encodeURIComponent(field.name) + "=" +
                            encodeURIComponent(field.value));
                    }
            }
        }
        return parts.join("&");
    },
};

