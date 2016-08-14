<%@page import="java.io.PrintWriter"%>
<%@ page language="java" import="java.util.*,java.sql.*,org.json.*" pageEncoding="UTF-8"%>
<%
	//取得response的输入入口 start
System.out.println(1111111111);
	response.setCharacterEncoding("utf-8");
	response.setContentType("text/html;charset=utf-8");
	PrintWriter pw = response.getWriter();
	//取得response的输入入口 end
	
	//取得请求页面发送过来的参数start
	request.setCharacterEncoding("utf-8");
	String username = request.getParameter("username");
	String password = request.getParameter("password");
	//取得请求页面发送过来的参数end
System.out.println(222222);	
	Connection conn = null;
	Statement stat =null;
	ResultSet rs = null;
	int result;
	try {
			Class.forName("com.mysql.jdbc.Driver");
			conn = DriverManager.getConnection("jdbc:mysql://localhost/zhihu","root","zenghw_008");
			stat = conn.createStatement();
		
			result = stat.executeUpdate("insert into user (name,password) values (" + "'" + username + "','"+ password +"')");
		System.out.println("insert into user (name,password) values (" + "'" + username + "','"+ password +"')");
		} catch (Exception e) {
			// TODO: handle exception
		}finally{
		
			try {
				rs.close();
				stat.close();
				conn.close();
			} catch (Exception e) {
		
			}
				
		}
%>