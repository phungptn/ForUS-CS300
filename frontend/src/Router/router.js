import { Await, Navigate, Outlet, Route, Routes } from "react-router-dom";
import React, { Suspense, lazy, useState, useEffect } from "react";
import { useAsync } from "react-async";
import isLogin from "../utils/isLogin";
const Login = lazy(() => import('../pages/Login/login'));
const Home = lazy(() => import('../pages/Home/home'));
const NotFound = lazy(() => import('../pages/NotFound/404'));
const SignUp = lazy(() => import('../pages/Admin/SignUp/signup'));

const AuthRequiredRoute = ({ auth, element }) => {
	return auth ? element : <Navigate to="/login" />
}

function Router() {
    const [state, setState] = useState({isLoading: true, authenticated: false});
    useEffect(() => {
        async function checkAuth() {
            const isAuth = await isLogin();
            setState({isLoading: false, authenticated: isAuth});
        }
        checkAuth();
    }, []);
    if(state.isLoading) {
       return <p>Loading...</p>
    }
    return (
        <Routes>
            <Route exact path='/' element={<AuthRequiredRoute auth={state.authenticated} element={<Home />}/>} />
            <Route exact path='/signup' element={<AuthRequiredRoute auth={state.authenticated} element={<SignUp />}/>} />
            <Route path="/login" element={< Login auth={state.authenticated} />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}

export default Router;