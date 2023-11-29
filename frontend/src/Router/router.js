import { Route, Routes } from "react-router-dom";
import React, { Suspense, lazy, useState } from "react";
const Login = lazy(() => import('../pages/Login/login'));
const Home = lazy(() => import('../pages/Home/home'));


 function Router() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Routes>
                <Route  path="/" element={<Home />} />
                <Route  path="/login" element={<Login />} />

            </Routes>
        </Suspense>
    );
    }
export default Router;