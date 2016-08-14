//截取富文本的函数start
(function(o){
            /**
             * 判断数组中是否包含某个元素
             */
            Array.prototype.inArray = function(v){
                for(i=0; i < this.length; i++) {
                    if(this[i] == v){
                        return true;
                    }
                }
                return false;
            }

            /**
             * 将HTML字符串里面的文本字符检出
             */
            o.toText = function(oHtml){
                if(typeof oHtml === "string"){
                    return oHtml.replace(/(^\s*)|(\s*$)/g, "").replace(/<[^<^>]*>/g, "").replace(/[\r\n]/g, "");
                } else {
                    return "";
                }
            };

            /**
             * 截取带HTML样式的字符串，并保留并自动补齐HTML标签
             * oHtml  将要截取的HTML字符串
             * nlen   截取后的长度，不包含标签的长度
             * isByte 是否按照字节长度截取
             */
            o.subHtml = function(oHtml, nlen, isByte){
            	
            	var returnValue = new Array();
                var rgx1 = /<[^<^>^\/]+>/;      //前标签或者不规则的自标签(<a>的href属性中可能会有“//”符号，需要先移除才能保证rgx1的正确)
                var rgx2 = /<\/[^<^>^\/]+>/;    //后标签
                var rgx3 = /<[^<^>^\/]+\/>/;    //自标签
                var rgx4 = /<[^<^>]+>/;         //所有标签
                var selfTags = "hr,br,img,input,meta".split(",");
                if(typeof oHtml !== "string"){
                    return "";
                }
                oHtml = oHtml.replace(/(^\s*)|(\s*$)/g, "").replace(/[\r\n]/g, ""); //去字符串头尾空格，去换行符与回车符
                var oStr = oHtml.replace(/<[^<^>]*>/g, ""); //移除所有标签，存入oStr
                returnValue[0] = oStr.length;
                var olen = isByte ? oStr.replace(/[^\x00-\xff]/g,"**").length : oStr.length; //oStr.replace(/[^\x00-\xff]/g,"**") 表示用十六进制匹配出所有双字节字符(包括汉字在内),然后替换成"**"（刚好两个字节）
                if(!/^\d+$/.test(nlen) || olen <= nlen){
                	returnValue[1] = oHtml;
                    return returnValue;
                }

                //保存所有标签的位置及标签名 start
                var tStr = oHtml;
                var index = 0;
                var matchs = new Array();
                while(rgx4.test(tStr)){
                    var m = new Object();
                    m.index = index + tStr.search(rgx4);    //查找所有标签，并保存标签第一个字母的位置
                    m.string = tStr.match(rgx4).toString(); //保存标签名
                    var len = tStr.search(rgx4)+tStr.match(rgx4)[0].length; //保存标签名最后一个字母距离被查找的字符串首字母的长度
                    tStr = tStr.substr(len);    //去掉找到的标签及标签之前的子串
                    index += len;   //保存新串首字母在原字符串中的位置
                    matchs.push(m);
                }
                //保存所有标签的位置及标签名 end

                //取得指定长度的纯文本start
                if(isByte){
                    var i=0;
                    for(var z = 0; z < oStr.length; z++){
                        i += (oStr.charCodeAt(z) > 255) ? 2 : 1;
                        if(i >= nlen){
                            tStr=oStr.slice(0,(z + 1)); //因为slice(begin,end)的end位置是不取的，所以z要加1
                            break;
                        }
                    }
                } else {
                    tStr = oStr.substr(0, nlen);
                }
                //取得指定长度的纯文本end
                
                var tStrWithSpan = tStr +  '...<span class="down">显示全部</span>';
                
                var startTags = new Array();
                for(var i = 0; i < matchs.length; i++){
                    if(tStr.length <= matchs[i].index){
                        //tStr += matchs[i].string;
                        matchs = matchs.slice(0, i);    //选取matchs[0]到matcchs[i-1]
                        break;
                    } else {

                        //给取得的纯文本加上原先的标签 start
                    	tStrWithSpan = tStrWithSpan.substring(0, matchs[i].index) + matchs[i].string + tStrWithSpan.substr(matchs[i].index);
                        if(rgx1.test(matchs[i].string.replace(/(\/\/)/g, ""))){     //判断是否前标签或者不规则的自标签(先移除了<a>的href属性中可能的“//”符号)
                            var name = matchs[i].string.replace(/[<>]/g, "").split(" ");    //去掉<>号，取得标签名与属性并分离存入数组
                            if(name.length > 0){
                                name = name[0];     //取得标签名
                                if(!selfTags.inArray(name)){
                                    startTags.push(name);   //储存前标签名字到栈中
                                }
                            }
                        } else if(rgx2.test(matchs[i].string)){
                            var name = matchs[i].string.replace(/[<\/>]/g, "");
                            if(startTags.length > 0 && startTags[startTags.length - 1] === name){
                                startTags.pop();    //每添加上一个后标签，就取掉栈中对应的前标签
                            }
                        }
                        //给取得的纯文本加上原先的标签 end

                    }
                }

                //如果在截取的文本之后还有已添加的前标签对应的后标签没有加上，则全部添加上。 start
                if(startTags.length > 0){
                    for(var i = startTags.length - 1; i >=0; i--){
                    	tStrWithSpan += '</' + startTags[i] + '>';
                    }
                }
                //如果在截取的文本之后还有已添加的前标签对应的后标签没有加上，则全部添加上。 end
                returnValue[1] = tStrWithSpan;
                return returnValue;
            }
        }(window));
//截取富文本的函数 end

//处理uEditor富文本引号的函数：先把uEditor得到的   &quot; （因为在send中&是连接参数的符号）换成  \"  ，  &#39;  换成   \'  （为什么不用escape对引号进行直接转义？因为send不能接受转义到的%符号，导致servlet端接收到的是null） start
function valueReplace(v){ 	
    var s=v.toString().replace((new RegExp('&quot;', 'g'),"\\\""));	//用正则是为了利用参数g来匹配所有的&quot，因为如果直接用字符串"&quot;"则replace只替换查找到的第一个&quote就停止了
    var s = s.replace(new RegExp('&#39;', 'g'),"\\\'");
    return s;
} 
//先把uEditor得到的&quot;（因为在send中&是连接参数的符号）换成\"，&#39;换成\'（为什么不用escape对引号进行直接转义？因为send不能接受转义到的%符号，导致servlet端接收到的是null） end

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
    include("js/AjaxUtil.js",callback2);
    function  callback2() {
        var mainHandler = function () {
        	//实例化富文本编辑器start
        	var um_question = UM.getEditor('question_content_textarea',{
        		autoHeightEnabled:false,
        		topOffset:47,
        		
        		}
        	);
        	var um_answer = UM.getEditor('answer_textarea',{
        		autoHeightEnabled:false,
        		topOffset:47,
        		
        			
        		});
        	//实例化富文本编辑器end
            //登录start
            EventUtil.addHandler(document.getElementById("login_button"),"click",function () {
                var xhr = AjaxUtil.XMLHttpRequest();
                xhr.onreadystatechange = function () {
                    if(xhr.readyState == 4)
                    {
                        if(xhr.status >= 200 && xhr.status < 300 || xhr.status == 304)
                        {
                            if(xhr.responseText.indexOf("true") != -1) {
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
                        else
                        {
                            document.write("请求失败：" + xhr.status + xhr.responseText);
                        }
                    }
                }
                xhr.open("post","login.jsp"); //js里的路径是以包含js路径的html为起点的。
                xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");

                xhr.send("username=" + document.getElementsByName("username")[0].value + "&password=" + document.getElementsByName("password")[0].value);
            });
            //登录end

            //提问start
            EventUtil.addHandler(document.getElementById("question_form_ok_button"),"click",function () {
                var cookie = getCookie("username");
                if(cookie.length == 0)
                    cookie = "匿名用户";

                var xhr = AjaxUtil.XMLHttpRequest();
                xhr.onreadystatechange = function () {
                    if(xhr.readyState == 4)
                    {
                        if(xhr.status >= 200 && xhr.status < 300 || xhr.status == 304)
                        {
                            if(xhr.responseText.indexOf("true") != -1) {

                                document.getElementById("question_form").style.display = "none";
                            }
                            else
                                alert("提问失败");
                        }
                        else
                        {
                            document.write("请求失败：" + xhr.status + xhr.responseText);
                        }
                    }
                }
                xhr.open("post","addQuestion.jsp"); //js里的路径是以包含js路径的html为起点的。
                xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
                xhr.send("username=" + cookie + "&title=" + document.getElementsByName("question_form_tile")[0].value + "&content="  + valueReplace(UM.getEditor('question_content_textarea').getContent()) );
            });
            //提问end
            
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

            //登录取消start
            EventUtil.addHandler(document.getElementById("cancel_button"),"click",function () {

                document.getElementById("login_form").style.display = "none";

            });
            //登录取消end

            //提问取消start
            EventUtil.addHandler(document.getElementById("question_cancel_button"),"click",function () {

                document.getElementById("question_form").style.display = "none";

            });
            //提问取消end
            
            //注册取消start
            EventUtil.addHandler(document.getElementById("register_cancel_button"), "click", function () {

                document.getElementById("register_form").style.display = "none";
               

            });
            //注册取消end

            //登录入口start
            EventUtil.addHandler(document.getElementById("login_entry_login"),"click",function () {
                document.getElementById("login_form").style.display = "block";
            });

            EventUtil.addHandler(document.getElementById("login_entry_logout"),"click",function () {
                setCookie("username","",-1);
                document.getElementById("login_entry_registry").style.display = "inline";
                document.getElementById("login_entry_login").style.display = "inline";
                document.getElementById("login_entry_username").style.display = "none";
                document.getElementById("login_entry_logout").style.display = "none";
            });

            if(getCookie("username").length != 0)
            {
                document.getElementById("login_entry_username").innerHTML = getCookie("username");
                document.getElementById("login_entry_registry").style.display = "none";
                document.getElementById("login_entry_login").style.display = "none";
                document.getElementById("login_entry_username").style.display = "inline";
                document.getElementById("login_entry_logout").style.display = "inline";
            }
            else
            {
                document.getElementById("login_entry_registry").style.display = "inline";
                document.getElementById("login_entry_login").style.display = "inline";
                document.getElementById("login_entry_username").style.display = "none";
                document.getElementById("login_entry_logout").style.display = "none";
            }


            //登录入口end

            //提问入口start
            EventUtil.addHandler(document.getElementById("question_entry"),"click",function () {
                document.getElementById("question_form").style.display = "block";
            });
            //提问入口end
            
          //注册入口start
            EventUtil.addHandler(document.getElementById("login_entry_registry"), "click", function () {
                document.getElementById("register_form").style.display = "block";
            });
            //注册入口end
            
            //控制问题评论start
            var question_comment = document.getElementById("question_comment").previousElementSibling.children[0];
            var question_comment_list = document.getElementById("question_comment");
            EventUtil.addHandler(question_comment, "click", function(){
                if(question_comment_list.style.display.search("block") == -1 )
                {
                    question_comment_list.style.display = "block";
                }
                else{
                    question_comment_list.style.display = "none";
                }
            } );
            //控制问题评论end

            //展示问题start
            var xhr = AjaxUtil.XMLHttpRequest();
            var p;
            xhr.onreadystatechange = function () {
                if(xhr.readyState == 4)
                {
                    if(xhr.status >= 200 && xhr.status < 300 || xhr.status == 304)
                    {

                        var json = JSON.parse(xhr.responseText);
                        document.getElementById("question_title").innerHTML = json.question.title;
                        document.getElementById("question_text").innerHTML = unescape( json.question.content );
                        var text;
                        var hr;

                        document.getElementById("question_comment_button").innerText = json.question.count + "条评论";

                        for(var i = 0; i < json.comment.length;i++)
                        {
                            p = document.createElement("p");
                            p.appendChild( document.createTextNode(json.comment[i].user) );
                            p2 = document.createElement("p");
                            p2.appendChild(document.createTextNode( json.comment[i].content) );
                            hr = document.createElement("hr");



                            document.getElementById("question_comment").appendChild(p);
                            document.getElementById("question_comment").appendChild(p2);
                            document.getElementById("question_comment").appendChild(hr);
                        }
                   

                    }
                    else
                    {
                        document.write("请求失败：" + xhr.status + xhr.responseText);
                    }
                }
            };
            xhr.open("post","answer_page.jsp"); //js里的路径是以包含js路径的html为起点的。
            xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
            xhr.send("question_id=" +  document.getElementById("question_id").value);

            //展示问题end

            var xhr2 = AjaxUtil.XMLHttpRequest();
            xhr2.onreadystatechange = function () {
                if(xhr2.readyState == 4)
                {
                    if(xhr2.status >= 200 && xhr2.status < 300 || xhr2.status == 304)
                    {

                        var json = JSON.parse(xhr2.responseText);
                        var p;
                        var div_inner;
                        var div_outer;
                        var a;
                        var p2;
                        var p3;
                        var answerBlock = document.getElementById("answer");
                        var summary;
                        var showAll;
                        var up;
                        var summaryArr = new Array;
                        //展示问题数 start
                        document.getElementById("answerCount").innerHTML = json.answerCount + "个回答";
                        //展示问题数 end
                        
                        //展示回答start
                        for(var i = 0; i < json.answer.length;i++)
                        {
                        	
                            p = document.createElement("p");
                            p.appendChild( document.createTextNode(json.answer[i].user ) );
                            p.setAttribute("class","usernameInAnswer");
                            p2 = document.createElement("p");
                            p2.setAttribute("name","answer");
                            
                            
                            returnValue = subHtml(json.answer[i].content,100,false);
                            //alert(new Number( ("down"+i).match(/\d+/)[0] ));
                            if(returnValue[0] >= 100)
                            {
                            	summary = returnValue[1];
                            	p2.innerHTML = summary;	//此处不能用createTextNode，否则会把富文本内容当成纯文本处理。
                            	showAll = p2.getElementsByTagName("span"); 
                            	showAll = showAll[showAll.length-1];
                            	showAll.setAttribute("id","down"+i);
                            	
                            	EventUtil.addHandler(showAll, "click", function(){
                            		var that = this.parentNode;
                            		while(that.getAttribute("name") != "answer")
                            			that = that.parentNode;
                        		//alert(this.parentNode.parentNode.getAttribute("name") =="answer" );
                    				that.nextElementSibling.children[1].setAttribute("style","display:inline");
                		
                				 	summaryArr[new Number( this.getAttribute("id").match(/\d+/)[0] )] = that.innerHTML;
                				//alert(this.parentNode.tagName); 由于temp.appendChild(this)，this的parentNode已经改变。
                        			that.innerHTML = json.answer[new Number( this.getAttribute("id").match(/\d+/)[0] )].content;	//不能再用p2.innerHTML，因为在点击事件发生时循环已经全部执行完成，p2已经是表示最后一个答案的节点了。	一般来说，凡是click事件，所有DOM操作通常都是需要利用this完成的。
                        			
                            	});
                            }
                            else
                            {
                            	summary = json.answer[i].content;
                            	p2.innerHTML = summary;	
                            }
                            
                            
                            p3 = document.createElement("p");
                            a = document.createElement("a");
                            a.appendChild(document.createTextNode( json.answer[i].count + "条评论"));
                            a.setAttribute("href","javascript:void(0);");
                            p3.appendChild(a);
                            
                            up = document.createElement("span");
                            up.setAttribute("class", "up");
                            up.appendChild(document.createTextNode("收起"));
                            up.setAttribute("id","up" +  i);
                            p3.appendChild(up);
                            up.setAttribute("style","display:none")
                            EventUtil.addHandler(up,"click" , function(){
                            	this.setAttribute("style","display:none");
                            	//var down = this.parentNode.previousElementSibling.lastChild;
                        	//alert(down.innerHTML);
                            	var content = this.parentNode.previousElementSibling.innerHTML;
                        		this.parentNode.previousElementSibling.innerHTML = summaryArr[new Number( this.getAttribute("id").match(/\d+/)[0] )];
                        		//this.parentNode.previousElementSibling.appendChild(down);
                        		//down.setAttribute("style","display:inline");
                        		EventUtil.addHandler(document.getElementById("down"+new Number( this.getAttribute("id").match(/\d+/)[0] )), "click", function(){
                            		
                        			var that = this.parentNode;
                            		while(that.getAttribute("name") != "answer")
                            			that = that.parentNode;
                        		//alert(this.parentNode.parentNode.getAttribute("name") =="answer" );
                    				that.nextElementSibling.children[1].setAttribute("style","display:inline");
                		
                				 	summaryArr[new Number( this.getAttribute("id").match(/\d+/)[0] )] = that.innerHTML;
                				//alert(this.parentNode.tagName); 由于temp.appendChild(this)，this的parentNode已经改变。
                        			that.innerHTML = json.answer[new Number( this.getAttribute("id").match(/\d+/)[0] )].content;	//不能再用p2.innerHTML，因为在点击事件发生时循环已经全部执行完成，p2已经是表示最后一个答案的节点了。	一般来说，凡是click事件，所有DOM操作通常都是需要利用this完成的。
                            	});
                            });
                            
                            div_inner = document.createElement("div");
                            p3.setAttribute("answer_id",json.answer[i].id);
                            p3.setAttribute("name","answer_comment");
                            div_outer = document.createElement("div");
                            
                            div_outer.appendChild(p);
                            div_outer.appendChild(p2);
                            div_outer.appendChild(p3);
                            
                            div_outer.appendChild(div_inner);
                            div_inner.setAttribute("class","comment_list");
                            div_inner.style.display = "none";
                            answerBlock.appendChild(div_outer);
                            answerBlock.appendChild(document.createElement("hr"));


                        }
                        
                        //展示回答end
                        
                        //回答的部分显示start
                      
                        //回答的部分显示end

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
                                var commentBar = this.parentNode;

                                //控制评论区的隐藏出现start
                                if(comment_list.style.display.search("block") == -1 )
                                {
                                    comment_list.style.display = "block";
                                    var rect;
                                    document.onscroll = function(){
                                    	rect = comment_list.getBoundingClientRect();
                                    	
                                    	if(rect.top-82 <= 0)
                                        {
                                            commentBar.style.position = "fixed";
                                            commentBar.style.top = "47px";
                                            comment_list.style.marginTop = "44px";

                                            if(rect.bottom - 113 <= 0)
                                            {
                                                commentBar.style.position = "";
                                                commentBar.style.top = "";
                                                comment_list.style.marginTop = "";
                                            }
                                        }
                                        if(rect.top- 82 > 0)
                                        {
                                        	commentBar.style.position = "";
                                            commentBar.style.top = "";
                                            comment_list.style.marginTop = "";
                                        }
                                    }
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
                    
                    //alert(111);
                    var question_comment_reply = document.createElement("textarea");
                    question_comment_reply.setAttribute("name","question_comment_reply");
                //alert(222);
                    var question_comment_reply_ok = document.createElement("button");
                    question_comment_reply_ok.setAttribute("name","question_comment_reply_ok");
                    question_comment_reply_ok.appendChild(document.createTextNode("评论"));
                //alert(333);
                    document.getElementById("question_comment").appendChild(question_comment_reply);
                    document.getElementById("question_comment").appendChild(question_comment_reply_ok);
                    
                    //添加问题回复 start
                    EventUtil.addHandler(question_comment_reply_ok,"click",clickHandler3);
                    function clickHandler3() {
                    //alert(1);
                        var reply = question_comment_reply_ok.previousSibling;
                        var xhr3 = AjaxUtil.XMLHttpRequest();
                        
                        var p,p2,p3,a;
                        var div_inner;
                        var div_outer;
                    //alert(2);
                        var cookie = getCookie("username");
                        if(cookie.length == 0)
                            cookie = "匿名用户";
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
                                    document.getElementById("question_comment").insertBefore(div_outer,document.getElementById("question_comment").getElementsByTagName("textarea")[0]);
                                    //利用js操作把刚才新增的评论添加进评论区end
                                }
                                else
                                {
                                    document.write("请求失败：" + xhr.status + xhr.responseText);
                                }
                            }
                        };
                    //alert(3);
                        xhr3.open("post","addQuestionComment.jsp"); //js里的路径是以包含js路径的html为起点的。
                        xhr3.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
                        xhr3.send("reply=" + reply.value + "&question_id=" + new Number(document.getElementById("question_id").value) +"&username=" + cookie);

                    };
                    //添加问题回复end
                    
                }
            };
            xhr2.open("post","showAnswer.jsp"); //js里的路径是以包含js路径的html为起点的。
            xhr2.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
            xhr2.send("question_id=" +  document.getElementById("question_id").value);

            //发布回答start
            EventUtil.addHandler(document.getElementsByName("answer_ok")[0],"click",clickHandler);
            function clickHandler() {
                //var question_id = this.nextSibling.nextSibling.value;	//Firefox 以及大多数其他的浏览器，会把节点间生成的空的空格或者换行当作文本节点
                var xhr = AjaxUtil.XMLHttpRequest();
                var p;

                var cookie = getCookie("username");
                if(cookie.length == 0)
                    cookie = "匿名用户";
                xhr.onreadystatechange = function () {
                    if(xhr.readyState == 4)
                    {
                        if(xhr.status >= 200 && xhr.status < 300 || xhr.status == 304)
                        {
                            /* window.location.reload();//一般不重新加载，而是采用dom操作加入，因为重新加载更费时间。*/

                            //添加答案start
                            var answerBlock = document.getElementById("answer");
                            p = document.createElement("p");
                            p.appendChild( document.createTextNode(cookie) );
                            p2 = document.createElement("p");
                            p2.innerHTML = UM.getEditor('answer_textarea').getContent();
                            p3 = document.createElement("p");
                            a = document.createElement("a");
                            a.appendChild(document.createTextNode("0条评论"));
                            a.setAttribute("href","javascript:void(0);");
                            p3.appendChild(a);
                            div_inner = document.createElement("div");
                            p3.setAttribute("answer_id",xhr.responseText);
                            p3.setAttribute("name","answer_comment");
                            div_outer = document.createElement("div");
                            div_outer.appendChild(p);
                            div_outer.appendChild( document.createElement("br") );
                            div_outer.appendChild(p2);
                            div_outer.appendChild(p3);
                            div_outer.appendChild(div_inner);
                            div_inner.setAttribute("class","comment_list");
                            div_inner.style.display = "none";
                            answerBlock.appendChild(div_outer);
                            answerBlock.appendChild(document.createElement("hr"));
                            //添加答案end

                            //添加评论框start
                            var commentBlock = div_inner;
                            var reply = document.createElement("textarea");
                            reply.setAttribute("name","reply");
                            var ok = document.createElement("button");
                            ok.setAttribute("name","reply_ok");
                            ok.appendChild(document.createTextNode("评论"));
                            commentBlock.appendChild(reply);
                            commentBlock.appendChild(ok);
                            //添加评论框end

                            //评论区的隐藏与出现按钮start
                            EventUtil.addHandler(a,"click",clickHandler);
                            function clickHandler() {
                                answer_id = this.parentNode.getAttribute("answer_id"); //this表示的是点击时的对象，即answer_comment[i].children[0]。
                                var that = this;
                                var comment_list = this.parentNode.nextElementSibling;


                                //控制评论区的隐藏出现start
                                if (comment_list.style.display.search("block") == -1) {
                                    comment_list.style.display = "block";
                                }
                                else {
                                    comment_list.style.display = "none";
                                }
                                //控制评论区的隐藏出现end
                            }
                            //评论区的隐藏与出现按钮end

                            //添加回复start
                            EventUtil.addHandler(ok,"click",clickHandler3);
                            function clickHandler3() {

                                var reply = ok.previousSibling;
                                var xhr3 = AjaxUtil.XMLHttpRequest();
                                var p;

                                var cookie = getCookie("username");
                                if(cookie.length == 0)
                                    cookie = "匿名用户";
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
                                            commentBlock.insertBefore(div_outer,commentBlock.getElementsByTagName("textarea")[0]);
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
                                xhr3.send("reply=" + reply.value + "&answer_id=" + new Number(xhr.responseText) +"&username=" + cookie);

                            };
                            //添加回复end

                        }
                        else
                        {
                            document.write("请求失败：" + xhr.status + xhr.responseText);
                        }
                    }
                };

                xhr.open("post","addAnswer.jsp"); //js里的路径是以包含js路径的html为起点的。
                xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
                
               
                
        //alert( valueReplace(UM.getEditor('answer_textarea').getContent()));
                xhr.send("answer_content=" + valueReplace(UM.getEditor('answer_textarea').getContent()) + "&question_id=" + document.getElementById("question_id").value +"&username=" + cookie);
                



            };

            //发布回答end

        };
        EventUtil.addHandler(window,"load",mainHandler);//.window.load,not document.load
    }
}


