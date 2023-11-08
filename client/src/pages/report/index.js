import React from "react";

// We use Route in order to define the different routes of our application
import {Route, Routes} from "react-router-dom";

// We import all the components we need in our app

import Chart from "./chart";
import TotalSalesPerProduct from "./totalSalesPerProduct";

const App = () => {
    return (
        <Routes>
            <Route exact path="/" element={<><Chart/><TotalSalesPerProduct/></>}/>
        </Routes>
    );
};


export default App;
