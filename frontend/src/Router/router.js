import { Await, Navigate, Outlet, Route, Routes } from "react-router-dom";
import React, { Suspense, lazy, useState, useEffect } from "react";
import isLogin from "../utils/isLogin";
const Login = lazy(() => import('../pages/Login/login'));
const Layout = lazy(() => import('../pages/Layout/layout'));
const NotFound = lazy(() => import('../pages/NotFound/404'));
const SignUp = lazy(() => import('../pages/Admin/SignUp/signup'));
const Box = lazy(() => import('../pages/Box/box'));
const Home = lazy(() => import('../pages/Home/home'));
const Profile = lazy(() => import('../pages/Profile/profile'));
const Admin = lazy(() => import('../pages/Admin/admin'));
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
            <Route path='/' element={<AuthRequiredRoute auth={state.authenticated} element={<Layout />}/>}>
                <Route exact path='/' element={<Home />}/>
                <Route path='profile' element={<Profile />}/>
                <Route path='box/:box_id' element={<Box />}/>
                <Route path='box/:box_id/:page' element={<Box />}/>
            </Route>
            <Route exact path='/signup' element={<AuthRequiredRoute auth={state.authenticated} element={<SignUp />}/>} />
            <Route path="/login" element={< Login auth={state.authenticated} />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/admin" element={< Admin auth={state.authenticated} />} />

        </Routes>
    );
}

export default Router;
