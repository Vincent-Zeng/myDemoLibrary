<%@ page contentType="text/html; charset=gb2312"%>
<%@ page import="com.jspsmart.upload.*,javabean.*"%>


<%@ page import="java.util.Calendar,java.io.File"%>

<%
request.setCharacterEncoding("gb2312");

try{
	SmartUpload su = new SmartUpload();          /// �ϴ��ļ���� 
	long file_max_size = 4000000;
System.out.println("pageContext=" + pageContext);
    su.initialize(pageContext);// �ϴ���ʼ��
    su.upload();
   // ���ϴ��ļ�ȫ�����浽ָ��Ŀ¼
   String temp="upload/images";
   //�����ļ���ʹ�þ���·��
String uploadPath =request.getRealPath("/")+temp;

//����ļ��в����ڣ��򴴽����ļ���
if(!new File(uploadPath).isDirectory()){
new File(uploadPath).mkdirs();
}
Files files=su.getFiles();
//�õ��ϴ����ļ�
com.jspsmart.upload.File file = su.getFiles().getFile(0);
if(file.isMissing()){
System.out.println("missing");
}
String postfix="."+file.getFileExt();
//Ϊ�ϴ����ļ������
System.out.println("��׺���ǣ�" + postfix);
if(!postfix.equals(".jpg")){
%>
<script type="text/javascript">
alert("��֧�ִ�ͼƬ��ʽ");
</script>
<%
}else{
int i = autoIncreaseNumber.getI();//��Ϊÿ��jsp������������ģ�����i++ÿ�ζ�����0�Ļ����ϼӣ����Ҫ����ֻ�ܰ�i++����javabean�
String fileName = "test" + i; 
//������ǿ��Եõ�ͼƬ��·����
String strtemp=uploadPath+"/"+ fileName + postfix; //������uploadPath+"/"+ fileName + postfix����file:///F:/apache-tomcat-7.0.69/webapps/DemoLibrary/upload/images/test.jpg������Ϊǰ̨���ܷ��ʱ�����Դ��ֻ��ͨ��������ʡ�
strtemp = strtemp.replace('\\', '/'); //��б�߱�ʾת�壬����Ҫ������б�߱�ʾ·����
System.out.println(strtemp);
file.saveAs(strtemp);  ///������·�� (����)

//ȡ��ͼƬ���������·��
String front_end_path = temp +"/"+ fileName + postfix;
front_end_path = front_end_path.replace('\\', '/'); //��б�߱�ʾת�壬����Ҫ������б�߱�ʾ·����
System.out.println(front_end_path);
%>
<script>
alert("ͼƬ�ϴ��ɹ���");
var img = document.createElement("img");
var a = document.createElement('a');
a.href = './'; //��õ�ǰĿ¼
img.src = a.href + "<%out.print(front_end_path);%>"; //���ͼƬ���������·��
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
alert("ͼƬ�ϴ�ʧ�ܣ�");
</script>
<%
}
%>


</script>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<head>
    <title>��ҳ</title>
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
        <td width="120" align="center">·����</td>
        <td  width="180"><input   type="file"   name="file" class="from_len21"   contenteditable="false"></td>
        </tr>
        <tr>
        <td>
         <input type="submit" value="ȷ��" id="submit" />
        </td>
        </tr>
  </table>
  </form>
   
   <div>
   </div>
  </body>
</html>