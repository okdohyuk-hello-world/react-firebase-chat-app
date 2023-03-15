import React, { useEffect } from 'react';
import { Outlet, useNavigate } from "react-router-dom";
import { auth } from "./assets/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from './redux/actions/userAction';

function App() {
	let dispatch = useDispatch();
	let navigate = useNavigate();
	const isLoading = useSelector(state => state.user.isLoading);
	
	
	useEffect(() => {
		onAuthStateChanged(auth, user => {
			if(user) {
				navigate('/chat');
				dispatch(setUser(user));
			} else {
				navigate('/login');
			};
		});
	}, []);
	
	if(isLoading) return <div>now loading...</div>;
	return <Outlet />;
};

export default App;