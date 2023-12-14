import { Route, Routes } from "react-router-dom";
import React, { Suspense, lazy, useState } from "react";
import isLogin from "../utils/isLogin";
const Login = lazy(() => import('../pages/Login/login'));
const Home = lazy(() => import('../pages/Home/home'));
const NotFound = lazy(() => import('../pages/NotFound/404'));
const SignUp = lazy(() => import('../pages/Admin/SignUp/signup'));

 function Router() {
    return (
        <Suspense fallback={<div>Loading...</div>}>

            <Routes>
            {
                !isLogin() ?
                <Route  path="/login" element={<Login />} />
                :
                <Route  path="/">

                    <Route  exact path="/" element={<Home />} />
                    <Route path="/signup" element={<SignUp />} />
                    
                </Route>

            }

            <Route  path="*" element={<NotFound />} />
            </Routes>
        </Suspense>
    );
    }
export default Router;