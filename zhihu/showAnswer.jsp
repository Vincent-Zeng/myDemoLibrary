<%@page import="java.io.PrintWriter"%>
<%@ page language="java" import="java.util.*,java.sql.*,org.json.*" pageEncoding="UTF-8"%>
<%
	response.setCharacterEncoding("utf-8");
	response.setContentType("text/html;charset=utf-8");
	PrintWriter pw = response.getWriter();
	
	request.setCharacterEncoding("utf-8");
	String question_id = request.getParameter("question_id");
	
	Connection conn = null;
	Statement stat =null;
	ResultSet rs = null;
	Statement stat2 =null;
	ResultSet rs2 = null;
	Statement stat3 =null;
	ResultSet rs3 = null;
	String count = null;
	try {
			Class.forName("com.mysql.jdbc.Driver");
			conn = DriverManager.getConnection("jdbc:mysql://localhost/zhihu","root","zenghw_008");
			stat = conn.createStatement();
			stat2 = conn.createStatement();
			stat3 = conn.createStatement();
			rs = stat.executeQuery("select * from answer where pid=" + question_id);
			JSONObject jsonObject = null;
			JSONObject jsonObject2 = new JSONObject();
			rs3 = stat3.executeQuery("select count(*) from answer where pid=" + question_id);
			rs3.next();
			jsonObject2.put("answerCount", rs3.getString("count(*)"));
			JSONArray jsonArray = new JSONArray();
			while(rs.next())
			{
				
				String content = rs.getString("content");
				String id = rs.getString("id");
				String user = rs.getString("user");
				
				rs2 = stat2.executeQuery("select count(*) from comment where pid=" + id );
			System.out.println("select count(*) from comment where pid=" + id);
				
				rs2.next();
				count = rs2.getString("count(*)");
			System.out.println(content);
				
				
				jsonObject = new JSONObject();
				jsonObject.put("count",count);
				jsonObject.put("content", content);
				jsonObject.put("id", id);
				jsonObject.put("user", user);
				jsonArray.put(jsonObject);
				
			}
			
			jsonObject2.put("answer", jsonArray);
			jsonObject2.toString();
			pw.println(jsonObject2);
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