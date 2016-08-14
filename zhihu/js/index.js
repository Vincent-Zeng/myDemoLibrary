//设置（创建或修改）cookie的函数start
function setCookie(cname,cvalue,exdays){
    var d = new Date();
    d.setTime(d.getTime()+(exdays*24*60*60*1000));
    var expires = "expires="+d.toGMTString();
    document.cookie = cname+"="+cvalue+"; "+expires;
}
//设置（创建或修改）cookie的函数end

//获取cookie值的函数start
function getCookie(cname){
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i].trim();
        if (c.indexOf(name)==0) return c.substring(name.length,c.length);
    }
    return "";
}
//获取cookie值的函数end

//引入其他js文件的函数start
function include(url, callback)
{
    // Adding the script tag to the head as suggested before
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;

    // Then bind the event to the callback function.
    // There are several events for cross browser compatibility.

    script.onload = callback;

    // Fire the loading
    head.appendChild(script);
};

//引入其他js文件的函数end


include("js/EventUtil.js",callback1);   //url要以answer_page.html的路径为起点，因为include把script写进了该html。
//执行完这一句（把语句写入html中）立即就执行下面的语句，导致引入的js文件没有加载完成。所以导致报错为EventUtil未定义。所以一般在html引入。

function callback1() {
    include("js/AjaxUtil.js", callback2);
    function callback2() {
        var mainHandler = function () {
        	
        	//实例化富文本编辑器start
        	var um_question = UM.getEditor('question_content_textarea',{
        		autoHeightEnabled:false,
        		topOffset:47,
        		
        		}
        	);
        	var um_answer = UM.getEditor('answer_textarea',{
        		autoHeightEnabled:false,
        		focus:true,
        			
        		});
        	//实例化富文本编辑器end
        	
            //登录start
            EventUtil.addHandler(document.getElementById("login_button"), "click", function () {
                var xhr = AjaxUtil.XMLHttpRequest();
                xhr.onreadystatechange = function () {
                    if (xhr.readyState == 4) {
                        if (xhr.status >= 200 && xhr.status < 300 || xhr.status == 304) {
                            if (xhr.responseText.indexOf("true") != -1) {
                                setCookie("username", document.getElementsByName("username")[0].value, 7);
                                
                                document.getElementById("login_form").style.display = "none"
                                document.getElementById("login_entry_username").innerHTML = document.getElementsByName("username")[0].value;
                                document.getElementById("login_entry_registry").style.display = "none";
                                document.getElementById("login_entry_login").style.display = "none";
                                document.getElementById("login_entry_username").style.display = "inline";
                                document.getElementById("login_entry_logout").style.display = "inline";
                            }
                            else
                                alert("帐号或密码错误");
                        }
                        else {
                            document.write("请求失败：" + xhr.status + xhr.responseText);
                        }
                    }
                }
                xhr.open("post", "login.jsp"); //js里的路径是以包含js路径的html为起点的。
                xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

                xhr.send("username=" + document.getElementsByName("username")[0].value + "&password=" + document.getElementsByName("password")[0].value);
            });

            //登录end
            
          //注册start
            EventUtil.addHandler(document.getElementById("register_button"), "click", function () {
                var xhr = AjaxUtil.XMLHttpRequest();
                xhr.onreadystatechange = function () {
                    if (xhr.readyState == 4) {
                        if (xhr.status >= 200 && xhr.status < 300 || xhr.status == 304) {
                      
                            	 setCookie("username", document.getElementsByName("username")[1].value, 7);
                        	 //alert(getCookie("username"));
                                 document.getElementById("register_form").style.display = "none"
                                 document.getElementById("login_entry_username").innerHTML = document.getElementsByName("username")[1].value;
                                 document.getElementById("login_entry_registry").style.display = "none";
                                 document.getElementById("login_entry_login").style.display = "none";
                                 document.getElementById("login_entry_username").style.display = "inline";
                                 document.getElementById("login_entry_logout").style.display = "inline";
                       
                        }
                        else {
                            document.write("请求失败：" + xhr.status + xhr.responseText);
                        }
                    }
                }
                xhr.open("post", "register.jsp"); //js里的路径是以包含js路径的html为起点的。
                xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            //alert("username:" + document.getElementsByName("username")[1].value);
                xhr.send("username=" + document.getElementsByName("username")[1].value + "&password=" + document.getElementsByName("password")[1].value);
            });

            //注册end

            //提问start
            EventUtil.addHandler(document.getElementById("question_form_ok_button"), "click", function () {
                var cookie = getCookie("username");
                if (cookie.length == 0)
                    cookie = "匿名用户";

                var xhr = AjaxUtil.XMLHttpRequest();
                xhr.onreadystatechange = function () {
                    if (xhr.readyState == 4) {
                        if (xhr.status >= 200 && xhr.status < 300 || xhr.status == 304) {
                            if (xhr.responseText.indexOf("true") != -1) {

                                document.getElementById("question_form").style.display = "none";
                            }
                            else
                                alert("提问失败");
                        }
                        else {
                            document.write("请求失败：" + xhr.status + xhr.responseText);
                        }
                    }
                }
                xhr.open("post", "addQuestion.jsp"); //js里的路径是以包含js路径的html为起点的。
                xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                xhr.send("username=" + cookie + "&title=" + document.getElementsByName("question_form_tile")[0].value + "&content=" + document.getElementsByName("question_form_content")[0].value);
            });
            //提问end

            //登录取消start
            EventUtil.addHandler(document.getElementById("cancel_button"), "click", function () {

                document.getElementById("login_form").style.display = "none";

            });
            //登录取消end

            //提问取消start
            EventUtil.addHandler(document.getElementById("question_cancel_button"), "click", function () {

                document.getElementById("question_form").style.display = "none";

            });
            //提问取消end
            
            //注册取消start
            EventUtil.addHandler(document.getElementById("question_cancel_button"), "click", function () {

                document.getElementById("register_form").style.display = "none";

            });
            //注册取消end

            //登录入口start
            EventUtil.addHandler(document.getElementById("login_entry_login"), "click", function () {
                document.getElementById("login_form").style.display = "block";
            });

            EventUtil.addHandler(document.getElementById("login_entry_logout"), "click", function () {
                setCookie("username", "", -1);
                document.getElementById("login_entry_registry").style.display = "inline";
                document.getElementById("login_entry_login").style.display = "inline";
                document.getElementById("login_entry_username").style.display = "none";
                document.getElementById("login_entry_logout").style.display = "none";
            });

            if (getCookie("username").length != 0) {
                document.getElementById("login_entry_username").innerHTML = getCookie("username");
                document.getElementById("login_entry_registry").style.display = "none";
                document.getElementById("login_entry_login").style.display = "none";
                document.getElementById("login_entry_username").style.display = "inline";
                document.getElementById("login_entry_logout").style.display = "inline";
            }
            else {
                document.getElementById("login_entry_registry").style.display = "inline";
                document.getElementById("login_entry_login").style.display = "inline";
                document.getElementById("login_entry_username").style.display = "none";
                document.getElementById("login_entry_logout").style.display = "none";
            }


            //登录入口end

            //提问入口start
            EventUtil.addHandler(document.getElementById("question_entry"), "click", function () {
                document.getElementById("question_form").style.display = "block";
            });
            //提问入口end
            
            //注册入口start
            EventUtil.addHandler(document.getElementById("login_entry_registry"), "click", function () {
                document.getElementById("register_form").style.display = "block";
            });
            //注册入口end
            

            //展示问题标题与其中一条回答 start
            var xhr = AjaxUtil.XMLHttpRequest();
            xhr.onreadystatechange = function () {
                if(xhr.readyState == 4)
                {
                    if(xhr.status >= 200 && xhr.status < 300 || xhr.status == 304)
                    {
                        var json = JSON.parse(xhr.responseText);
                        var p;
                        var div_inner;
                        var div_outer;
                        var a;
                        var title;
                        var p2;
                        var p3;
                        var answerBlock = document.getElementById("answer");

                        //展示问题标题与回答 start
                        for(var i = 0; i < json.length;i++)
                        {
                            title = document.createElement("p");
                            title_a = document.createElement("a");
                            title_a.appendChild(document.createTextNode(json[i].title));
                            title_a.setAttribute("href","http://localhost:8090/zhihu/answer_page_static.jsp?question_id=" + json[i].question_id)
                            title.appendChild(title_a);
                            div_outer = document.createElement("div");
                            div_outer.appendChild(title);

                            p = document.createElement("p");
                            p.appendChild( document.createTextNode(json[i].user ) );
                            p2 = document.createElement("p");
                            p2.appendChild(document.createTextNode(json[i].content));
                            p3 = document.createElement("p");
                            a = document.createElement("a");
                            a.appendChild(document.createTextNode(json[i].count + "条评论"));
                            a.setAttribute("href","javascript:void(0);");
                            p3.appendChild(a);
                            div_inner = document.createElement("div");

                            p3.setAttribute("answer_id",json[i].answer_id);
                            p3.setAttribute("name","answer_comment");
                            div_outer.appendChild(p);
                            div_outer.appendChild( document.createElement("br") );
                            div_outer.appendChild(p2);
                            div_outer.appendChild(p3);
                            div_outer.appendChild(div_inner);
                            div_inner.setAttribute("class","comment_list");
                            div_inner.style.display = "none";
                            answerBlock.appendChild(div_outer);
                            answerBlock.appendChild(document.createElement("hr"));

                        }
                        //展示问题标题与回答end


                        //展示评论start
                        var answer_comment = document.getElementsByName("answer_comment");
                        var answer_id;

                        for(var i = 0;i < answer_comment.length;i++)
                        {

                            EventUtil.addHandler(answer_comment[i].children[0],"click",clickHandler);
                            function clickHandler() {
                                answer_id = this.parentNode.getAttribute("answer_id"); //this表示的是点击时的对象，即answer_comment[i].children[0]。
                                var that = this;
                                var comment_list = this.parentNode.nextElementSibling;


                                //控制评论区的隐藏出现start
                                if(comment_list.style.display.search("block") == -1 )
                                {
                                    comment_list.style.display = "block";
                                }
                                else{
                                    comment_list.style.display = "none";
                                }
                                //控制评论区的隐藏出现end

                                //如果已经加载过评论区，则不再进行请求。start
                                if(comment_list.children.length == 0)
                                {
                                    var xhr2 = AjaxUtil.XMLHttpRequest();
                                    xhr2.onreadystatechange = function () {
                                        if(xhr2.readyState == 4)
                                        {
                                            if(xhr2.status >= 200 && xhr2.status < 300 || xhr2.status == 304)
                                            {

                                                var json = JSON.parse(xhr2.responseText);



                                                var div_inner;
                                                var div_outer;
                                                var p;
                                                var p2;
                                                var p3;
                                                var a;
                                                var commentBlock = that.parentNode.nextElementSibling;

                                                for(var i = 0; i < json.length;i++)
                                                {

                                                    p = document.createElement("p");
                                                    p.appendChild( document.createTextNode(json[i].user) );
                                                    p2 = document.createElement("p2");
                                                    p2.appendChild(document.createTextNode(json[i].content));
                                                    p3 = document.createElement("p");
                                                    a = document.createElement("a");
                                                    a.appendChild(document.createTextNode("回复"));
                                                    p3.appendChild(a);
                                                    div_inner = document.createElement("div");
                                                    p3.setAttribute("comment_id",json[i].id);
                                                    p3.setAttribute("name","comment_comment");
                                                    div_outer = document.createElement("div");
                                                    div_outer.appendChild(p);
                                                    div_outer.appendChild(p2);
                                                    div_outer.appendChild(p3);
                                                    div_outer.appendChild(div_inner);
                                                    div_outer.appendChild(document.createElement("hr"));
                                                    commentBlock.appendChild(div_outer);

                                                }
                                                var reply = document.createElement("textarea");
                                                reply.setAttribute("name","reply");
                                                var ok = document.createElement("button");
                                                ok.setAttribute("name","reply_ok");
                                                ok.appendChild(document.createTextNode("评论"));
                                                commentBlock.appendChild(reply);
                                                commentBlock.appendChild(ok);
                                                //如果已经加载过评论区，则不再进行请求。end

                                                //评论回复start
                                                var reply_oks = document.getElementsByName("reply_ok");


                                                for(var i = 0; i < reply_oks.length ; i++)
                                                {
                                                    EventUtil.addHandler(reply_oks[i],"click",clickHandler);
                                                    function clickHandler() {

                                                        var reply = this.previousSibling;

                                                        var xhr3 = AjaxUtil.XMLHttpRequest();
                                                        var p;

                                                        var cookie = getCookie("username");
                                                        if(cookie.length == 0)
                                                            cookie = "匿名用户";
                                                        
                                                    
                                                        var that = this;
                                                        xhr3.onreadystatechange = function () {
                                                            if(xhr3.readyState == 4)
                                                            {
                                                                if(xhr3.status >= 200 && xhr3.status < 300 || xhr3.status == 304)
                                                                {

                                                                    //利用js操作把刚才新增的评论添加进评论区start
                                                                    p = document.createElement("p");
                                                                    p.appendChild( document.createTextNode(cookie) );
                                                                    p2 = document.createElement("p2");
                                                                    p2.appendChild(document.createTextNode(reply.value));
                                                                    p3 = document.createElement("p");
                                                                    a = document.createElement("a");
                                                                    a.appendChild(document.createTextNode("回复"));
                                                                    p3.appendChild(a);
                                                                    div_inner = document.createElement("div");
                                                                    p3.setAttribute("comment_id",0);
                                                                    p3.setAttribute("name","comment_comment");
                                                                    div_outer = document.createElement("div");
                                                                    div_outer.appendChild(p);
                                                                    div_outer.appendChild(p2);
                                                                    div_outer.appendChild(p3);
                                                                    div_outer.appendChild(div_inner);
                                                                    div_outer.appendChild(document.createElement("hr"));
                                                                    commentBlock.insertBefore(div_outer,reply);
                                                                    
                                                                    that.parentNode.previousSibling.children[0].innerText = new Number(that.parentNode.previousSibling.children[0].innerText.charAt(0)) + 1 + "条评论";
                                                                    //利用js操作把刚才新增的评论添加进评论区end
                                                                }
                                                                else
                                                                {
                                                                    document.write("请求失败：" + xhr.status + xhr.responseText);
                                                                }
                                                            }
                                                        };

                                                        xhr3.open("post","addComment.jsp"); //js里的路径是以包含js路径的html为起点的。
                                                        xhr3.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
                                                        xhr3.send("reply=" + reply.value + "&answer_id=" + answer_id +"&username=" + cookie);




                                                    };
                                                };
                                                //评论回复end

                                            }
                                            else
                                            {
                                                document.write("请求失败：" + xhr.status + xhr.responseText);
                                            }
                                        }
                                    };
                                    xhr2.open("post","showComment.jsp"); //js里的路径是以包含js路径的html为起点的。
                                    xhr2.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
                                    xhr2.send("answer_id=" + answer_id);
                                }





                            };


                        }
                        //展示评论end
                    }
                    else
                    {
                        document.write("请求失败：" + xhr.status + xhr.responseText);
                    }
                }
            };
            xhr.open("post","index.jsp"); //js里的路径是以包含js路径的html为起点的。
            xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
            xhr.send();
        }
        EventUtil.addHandler(window,"load",mainHandler);//.window.load,not document.load
    }
}
//展示问题标题与其中一条回答 start