import React from 'react';
import { Link } from 'react-router-dom';

function LoginPage() {
	return (
		<div className="auth-wrapper" >
			<div style={{textAlign: 'center'}} >
				<h3>Login</h3>
			</div>
			<form>
				<label>Email</label>
      			<input name="email" type="email" />
				<label>Password</label>
				<input name="password" type="password" />
      			<input type="submit" />
				<Link style={{ color: 'gray', textDecoration: 'none'}} to="/register" >회원가입</Link>
    		</form>
		</div>
	);
};

export default LoginPage;