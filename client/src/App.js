import React from "react";

// We use Route in order to define the different routes of our application
import {Route, Routes} from "react-router-dom";

// We import all the components we need in our app


import Employee from "./pages/employee/index";
import Member from "./pages/member/index";
import Product from "./pages/product/index";
import Sale from "./pages/sale/index";

import Error404 from "./pages/error/code404";

import ReportChart from "./pages/report/index";

const App = () => {
    return (
        <div>
            <div style={{margin: 20}}>
                <Routes>
                    <Route path="/report/*" element={<ReportChart/>}/>
                    <Route path="/user/*" element={<Employee/>}/>
                    <Route path="/member/*" element={<Member/>}/>
                    <Route path="/product/*" element={<Product/>}/>
                    <Route path="/sale/*" element={<Sale/>}/>
                    <Route path="/*" element={<Error404/>}/>
                </Routes>
            </div>
        </div>
    );
};

export default App;
