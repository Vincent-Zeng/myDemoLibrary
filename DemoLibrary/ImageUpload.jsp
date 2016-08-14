<%@ page contentType="text/html; charset=gb2312"%>
<%@ page import="com.jspsmart.upload.*,javabean.*"%>


<%@ page import="java.util.Calendar,java.io.File"%>

<%
request.setCharacterEncoding("gb2312");

try{
	SmartUpload su = new SmartUpload();          /// 上传文件组件 
	long file_max_size = 4000000;
System.out.println("pageContext=" + pageContext);
    su.initialize(pageContext);// 上传初始化
    su.upload();
   // 将上传文件全部保存到指定目录
   String temp="upload/images";
   //创建文件夹使用绝对路径
String uploadPath =request.getRealPath("/")+temp;

//如果文件夹不存在，则创建此文件夹
if(!new File(uploadPath).isDirectory()){
new File(uploadPath).mkdirs();
}
Files files=su.getFiles();
//得到上传的文件
com.jspsmart.upload.File file = su.getFiles().getFile(0);
if(file.isMissing()){
System.out.println("missing");
}
String postfix="."+file.getFileExt();
//为上传的文件起别名
System.out.println("后缀名是：" + postfix);
if(!postfix.equals(".jpg")){
%>
<script type="text/javascript">
alert("不支持此图片格式");
</script>
<%
}else{
int i = autoIncreaseNumber.getI();//因为每次jsp都是重新请求的，所以i++每次都是在0的基础上加，因此要自增只能把i++放在javabean里。
String fileName = "test" + i; 
//这个就是可以得到图片的路径了
String strtemp=uploadPath+"/"+ fileName + postfix; //不能用uploadPath+"/"+ fileName + postfix（即file:///F:/apache-tomcat-7.0.69/webapps/DemoLibrary/upload/images/test.jpg），因为前台不能访问本地资源，只能通过网络访问。
strtemp = strtemp.replace('\\', '/'); //反斜线表示转义，所以要换成正斜线表示路径。
System.out.println(strtemp);
file.saveAs(strtemp);  ///参数是路径 (完整)

//取得图片的网络相对路径
String front_end_path = temp +"/"+ fileName + postfix;
front_end_path = front_end_path.replace('\\', '/'); //反斜线表示转义，所以要换成正斜线表示路径。
System.out.println(front_end_path);
%>
<script>
alert("图片上传成功！");
var img = document.createElement("img");
var a = document.createElement('a');
a.href = './'; //获得当前目录
img.src = a.href + "<%out.print(front_end_path);%>"; //获得图片的网络绝对路径
window.onload = function(){
	document.getElementsByTagName("div")[0].appendChild(img);
};

</script>
<%
}
}catch (Exception e){
 System.out.println(e.getMessage());
%>
<script type="text/javascript">
alert("图片上传失败！");
</script>
<%
}
%>


</script>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<head>
    <title>首页</title>
<meta http-equiv="pragma" content="no-cache">
<meta http-equiv="cache-control" content="no-cache">
<meta http-equiv="expires" content="0">    
<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
<meta http-equiv="dscription" content="This is my page">
  </head>
  <body>
  <form action="ImageUpload.jsp"  method="post" enctype="multipart/form-data">
  <table>
        <tr>
        <td width="120" align="center">路径：</td>
        <td  width="180"><input   type="file"   name="file" class="from_len21"   contenteditable="false"></td>
        </tr>
        <tr>
        <td>
         <input type="submit" value="确定" id="submit" />
        </td>
        </tr>
  </table>
  </form>
   
   <div>
   </div>
  </body>
</html>