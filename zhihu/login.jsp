<%@page import="java.io.PrintWriter"%>
<%@ page language="java" import="java.util.*,java.sql.*,org.json.*" pageEncoding="UTF-8"%>
<%
	//取得response的输入入口 start
	response.setCharacterEncoding("utf-8");
	response.setContentType("text/html;charset=utf-8");
	PrintWriter pw = response.getWriter();
	//取得response的输入入口 end
	
	//取得请求页面发送过来的参数start
	request.setCharacterEncoding("utf-8");
	String username = request.getParameter("username");
	String password = request.getParameter("password");
	//取得请求页面发送过来的参数end
	
	Connection conn = null;
	Statement stat =null;
	ResultSet rs = null;
	try {
			Class.forName("com.mysql.jdbc.Driver");
			conn = DriverManager.getConnection("jdbc:mysql://localhost/zhihu","root","zenghw_008");
			stat = conn.createStatement();
			rs = stat.executeQuery("select password from user where name='" + username +"'");
		System.out.println("select password from user where name='" + username +"'");
			JSONObject jsonObject = null;
			JSONArray jsonArray = new JSONArray();
			
			boolean flag = false;
			while(rs.next())
			{
				
				String pass = rs.getString("password");
				if(pass.equals(password)) //不能用==
				{
					flag = true;
				}	
			}
			pw.print(flag);
			
		
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