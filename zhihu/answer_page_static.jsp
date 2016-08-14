<%@page import="java.io.PrintWriter"%>
<%@ page language="java" import="java.util.*,java.sql.*,org.json.*" pageEncoding="UTF-8"%>
<%
	
	response.setCharacterEncoding("utf-8");
	response.setContentType("text/html;charset=utf-8");
	PrintWriter pw = response.getWriter();
	
	request.setCharacterEncoding("utf-8");
	String question_id = request.getParameter("question_id");
%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>知乎</title>
    
    <link href="uEditorMini/themes/default/css/umeditor.css" type="text/css" rel="stylesheet">
    <script type="text/javascript" src="uEditorMini/third-party/jquery.min.js"></script>
    <script type="text/javascript" charset="utf-8" src="uEditorMini/umeditor.config.js"></script>
    <script type="text/javascript" charset="utf-8" src="uEditorMini/umeditor.min.js"></script>
    <script type="text/javascript" src="/lang/zh-cn/zh-cn.js"></script>
    
    <link href="css/answer_page.css" rel="stylesheet" type="text/css">
    <script src="js/answer_page.js" type="text/javascript"></script>
</head>
<body>
<input type="text" id="question_id" value="<%=question_id%>" style="display:none;"></p>
<!--head_start-->

<div id="head">
    <div >
        <span>知乎</span>
        <input type="text" />
        <input type="button" value="搜索"/>
        <input type="button" value="提问" name="question_entry" id="question_entry"/>
    </div>
    <p id="login_entry">
        <a href="javascript:void(0);" id="login_entry_registry">注册</a>
        <a href="javascript:void(0);" id="login_entry_username">用户名</a>
        |
        <a href="javascript:void(0);" id="login_entry_login">登录</a>
        <a href="javascript:void(0);" id="login_entry_logout">退出</a>
    </p>
</div>
<!--head_end-->
<!--body_start-->
<div id="body">
    <!---main_start-->
    <div id="main">
        <!--question_start-->
        <div id="question">

            <div>
                <!--question_content_start-->
                <h1 id="question_title"></h1>
                <br />
                <p id="question_text"></p>
                <span><a href="javascript:void(0);" id="question_comment_button">0条评论</a></span>
                <!--question_content_end-->
                <!--comment_start-->
                <div id="question_comment" style="display:none;">

                </div>
                <!--comment_end-->
            </div>

        </div>
        <!--question_end-->
        <hr/>
        <p id="answerCount">n个回答</p>
        <hr/>
        <!--answer_start-->
        <div id="answer">

        </div>
        <!--answer_end-->

        <!--回答框start-->
        <div id="answer_form">
            <form>
                <script type="text/plain" name="answer_text" id="answer_textarea" style="width:580px;height:200px;">   
    				<p>这里我可以写一些输入提示</p>
				</script>
                <input type="button" value="发布回答" name="answer_ok"/>
            </form>
        </div>
        <!--回答框end-->
    </div>
    <!--main_end-->

    <!--side_bar_start-->
    <div id="side_bar">

    </div>
    <!--side_bar_end-->

	<!-- 注册表单start -->
    <div id="register_form" class="dialog" style="display: none;">
        <form>
            <p>
                <label for="username">帐号</label>
                <input type="text" name="username" />
            </p>

            <p>
                <label for="password">密码</label>
                <input type="password" name="password" />
            </p>

            <p class="form_button">
                <input type="button" value="注册" class="dialog_button" id="register_button">
                <input type="button" class="dialog_button" id="register_cancel_button" value="取消"/>

            </p>

        </form>
    </div>
    <!-- 注册表单end -->

    <!-- 登录表单start -->
    <div id="login_form" class="dialog" style="display:none;">
        <form>
            <p>
                <label for="username">帐号</label>
                <input type="text" name="username" />
            </p>

            <p>
                <label for="password">密码</label>
                <input type="password" name="password" />
            </p>

            <p class="form_button">
                <input type="button" value="登录" class="dialog_button" id="login_button">
                <input type="button" class="dialog_button" id="cancel_button" value="取消"/>

            </p>

        </form>
    </div>
    <!-- 登录表单end -->

    <!-- 提问表单start -->
    <div id="question_form" class="dialog" style="display:none;">
        <form>
            <label for="question_form_tile">问题：</label>
            <input type="text" name="question_form_tile" id="question_form_tile" />
            
            <div>
            	<label for="question_form_content">问题描述：</label>
            </div>
            
            <p>
                <br />
                <script type="text/plain" name="question_form_content" id="question_content_textarea" style="width:420px;height:200px;">  
    				<p>这里我可以写一些输入提示</p>
				</script>
            </p>


            <p class="form_button">
                <input type="button" value="提问" name="question_ok" class="dialog_button" id="question_form_ok_button"/>
                <input type="button" class="dialog_button" id="question_cancel_button" value="取消"/>
            </p>
        </form>
    </div>
    <!-- 提问表单end -->
</div>
<!--body_end-->

<!--foot_start-->
<div id="foot">


</div>
<!--foot_end-->

</body>
</html>