<%@page import="java.io.*"%>
<%@ page language="java" import="java.util.*,java.sql.*,org.json.*" pageEncoding="UTF-8"%>
<%

	
	response.setCharacterEncoding("utf-8");
	response.setContentType("text/html;charset=utf-8");
	PrintWriter pw = response.getWriter();
	request.setCharacterEncoding("utf-8");
	String  title = request.getParameter("title"); 
	String content = request.getParameter("content");
	String username = request.getParameter("username");
System.out.println("title="+title +",content=" + content +",username" +username);
	Connection conn = null;
	Statement stat =null;
	ResultSet rs = null;
	

		
	try {
		Class.forName("com.mysql.jdbc.Driver");
		conn = DriverManager.getConnection("jdbc:mysql://localhost/zhihu","root","zenghw_008");
		stat = conn.createStatement();
		String sql = "insert into question (title,content,date,user) values (" + "'" + title + "'" +",'" + content + "','" + new java.sql.Date(new java.util.Date().getTime()) + "','" + username +"')";
		System.out.println(sql);
		stat.executeUpdate(sql);
		
		
		pw.println(true);
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