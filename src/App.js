import React, { useEffect } from 'react';
import { Outlet, useNavigate } from "react-router-dom";
import { auth } from "./assets/firebase";
import { onAuthStateChanged } from "firebase/auth";

function App() {
	let navigate = useNavigate();
	
	useEffect(() => {
		onAuthStateChanged(auth, user => {
			if(user) {
				navigate('/chat');
			} else {
				navigate('/login');
			};
		});
	}, []);
	
	return <Outlet />;
};

export default App;