<%@page import="java.io.*"%>
<%@ page language="java" import="java.util.*,java.sql.*,org.json.*" pageEncoding="UTF-8"%>
<%

	
	response.setCharacterEncoding("utf-8");
	response.setContentType("text/html;charset=utf-8");
	PrintWriter pw = response.getWriter();
	request.setCharacterEncoding("utf-8");
System.out.println("addQuestionComment:" + request.getParameter("question_id"));
	int question_id = new Integer(request.getParameter("question_id")).intValue();
	String reply = request.getParameter("reply");
	String username = request.getParameter("username");
	
	Connection conn = null;
	Statement stat =null;
	ResultSet rs = null;
	

		
	try {
		Class.forName("com.mysql.jdbc.Driver");
		conn = DriverManager.getConnection("jdbc:mysql://localhost/zhihu","root","zenghw_008");
		stat = conn.createStatement();
		String sql = "insert into question_comment (pid,content,date,user) values (" + question_id + ",'" + reply + "','" + new java.sql.Date(new java.util.Date().getTime()) + "','" + username +"')";
	System.out.println(sql);
		stat.executeUpdate(sql);		
		pw.println(reply);
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