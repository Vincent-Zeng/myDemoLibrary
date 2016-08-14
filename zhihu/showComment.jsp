<%@page import="java.io.PrintWriter"%>
<%@ page language="java" import="java.util.*,java.sql.*,org.json.*" pageEncoding="UTF-8"%>
<%
	response.setCharacterEncoding("utf-8");
	response.setContentType("text/html;charset=utf-8");
	PrintWriter pw = response.getWriter();
	int answer_id = new Integer(request.getParameter("answer_id")).intValue();
	System.out.println(answer_id);
	Connection conn = null;
	Statement stat =null;
	ResultSet rs = null;
	try {
			Class.forName("com.mysql.jdbc.Driver");
			conn = DriverManager.getConnection("jdbc:mysql://localhost/zhihu","root","zenghw_008");
			stat = conn.createStatement();
			rs = stat.executeQuery("select * from comment where pid=" + answer_id);
			
			JSONObject jsonObject = null;
		
			JSONArray jsonArray = new JSONArray();
			while(rs.next())
			{
				
				String content = rs.getString("content");
				String id = rs.getString("id");
				String user = rs.getString("user");
				jsonObject = new JSONObject();
				jsonObject.put("content", content);
				jsonObject.put("id", id);
				jsonObject.put("user", user);
				jsonArray.put(jsonObject);
				
			}
	
			
			jsonArray.toString();
			pw.println(jsonArray);
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