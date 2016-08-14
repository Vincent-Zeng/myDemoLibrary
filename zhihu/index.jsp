<%@page import="java.io.PrintWriter"%>
<%@ page language="java" import="java.util.*,java.sql.*,org.json.*" pageEncoding="UTF-8"%>
<%
	response.setCharacterEncoding("utf-8");
	response.setContentType("text/html;charset=utf-8");
	PrintWriter pw = response.getWriter();
	Connection conn = null;
	Statement stat =null;
	Statement stat2 = null;
	Statement stat3 = null;
	
	ResultSet rs = null;
	ResultSet rs2 = null;
	ResultSet rs3 = null;
	String count = null;

	try {
			Class.forName("com.mysql.jdbc.Driver");
			conn = DriverManager.getConnection("jdbc:mysql://localhost/zhihu","root","zenghw_008");
			stat = conn.createStatement();
			stat2 = conn.createStatement();
			stat3 = conn.createStatement();
			rs = stat.executeQuery("select title,id from question limit 30");
			
			JSONArray jsonArray1 = new JSONArray();
			JSONArray jsonArray2 = new JSONArray();
			JSONObject jsonObject1 = null;
			JSONObject jsonObject2 = new JSONObject();
			while(rs.next())
			{
			
				String title = rs.getString("title");
				String id = rs.getString("id");
			System.out.println(title + "----"+id);
				
				rs2 = stat2.executeQuery("select * from answer where pid = " + id + " limit 2");
				while(rs2.next())
				{
					jsonObject1 = new JSONObject();
					jsonObject1.put("title",title);
					jsonObject1.put("question_id", id);
					
					String AnswerId = rs2.getString("id");
					String user = rs2.getString("user");
					String content = rs2.getString("content");
				System.out.println(content+ "----"+AnswerId);
				
					rs3 = stat3.executeQuery("select count(*) from comment where pid=" + AnswerId );
				System.out.println("select count(*) from comment where pid=" + AnswerId);
				
					rs3.next();
					count = rs3.getString("count(*)");
				System.out.println(count);
					
					jsonObject1.put("count",count);
					jsonObject1.put("answer_id",AnswerId);
					jsonObject1.put("user",user);
					jsonObject1.put("content", content);
					jsonArray1.put(jsonObject1);
				}
				
				System.out.println("444444444444");
			}
		System.out.println("5555");
			jsonArray1.toString();
			pw.println(jsonArray1);
			
		System.out.println(jsonArray1);
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