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
	String count = null;
	try {
			Class.forName("com.mysql.jdbc.Driver");
			conn = DriverManager.getConnection("jdbc:mysql://localhost/zhihu","root","zenghw_008");
			stat = conn.createStatement();
			stat2 = conn.createStatement();
		
			rs = stat.executeQuery("select * from question where id=" + question_id);
		
			JSONObject jsonObject1 = null;
			JSONObject jsonObject2 = new JSONObject();
			JSONArray jsonArray = new JSONArray();
			while(rs.next())
			{
				String title = rs.getString("title");
				String content = rs.getString("content");
				String id = rs.getString("id");
				
				jsonObject1 = new JSONObject();
				jsonObject1.put("title",title);
				jsonObject1.put("content", content);
				jsonObject1.put("id", id);
				
				
				rs2 = stat2.executeQuery("select count(*) from question_comment where pid=" + question_id);
				
				rs2.next();
				count = rs2.getString("count(*)");
				jsonObject1.put("count",count);
				
				jsonObject2.put("question",jsonObject1);
				
			
			
			}
			jsonObject1.get("id");
			rs = stat.executeQuery("select * from question_comment where pid=" + question_id);
			while(rs.next())
			{
				String user = rs.getString("user");
				String content = rs.getString("content");
				jsonObject1 = new JSONObject();
				jsonObject1.put("user",user);
				jsonObject1.put("content", content);
				jsonArray.put(jsonObject1);
				
				jsonObject2.put("comment",jsonArray);
				
			}
			
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
