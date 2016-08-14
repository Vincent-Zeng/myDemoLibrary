<%@page import="java.io.*"%>
<%@ page language="java" import="java.util.*,java.sql.*,org.json.*" pageEncoding="UTF-8"%>
<%

	
	response.setCharacterEncoding("utf-8");
	response.setContentType("text/html;charset=utf-8");
	PrintWriter pw = response.getWriter();
	request.setCharacterEncoding("utf-8");
//System.out.println(request.getParameter("question_id"));
	int question_id = new Integer(request.getParameter("question_id")).intValue();
	String answer_content = request.getParameter("answer_content");
System.out.println("answer:" + request.getParameter("answer_content") );
	String username = request.getParameter("username");
	
	Connection conn = null;
	Statement stat =null;
	ResultSet rs = null;
	

		
	try {
		Class.forName("com.mysql.jdbc.Driver");
		conn = DriverManager.getConnection("jdbc:mysql://localhost/zhihu","root","zenghw_008");
		stat = conn.createStatement();
		String sql = "insert into answer (pid,content,date,user) values (" + question_id + ",'" + answer_content + "','" + new java.sql.Date(new java.util.Date().getTime()) + "','" + username +"')";
	System.out.println(sql);
		stat.executeUpdate(sql);
		sql = "select id from answer where user=" + "'" +username + "'" +" order by id desc limit 1";
	System.out.println(sql);
		rs = stat.executeQuery(sql);
		rs.next();
		pw.print(rs.getString("id"));
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