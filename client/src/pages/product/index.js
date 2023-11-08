import React from "react";
// We use Route in order to define the different routes of our application
import {Route, Routes} from "react-router-dom";
// We import all the components we need in our app
import List from "./list";
import Create from "./create";
import Edit from "./edit";
import AddStock from "./addStock";
import {useNavigate} from "react-router";

const App = () => {
    return (
        <Routes>
            <Route exact path="/" element={<List.component/>}/>
            <Route path="/create" element={<Create.component navigate={useNavigate()}/>}/>
            <Route path="/edit/:id" element={<Edit/>}/>
            <Route path="/stock/add/:id" element={<AddStock.component/>}/>
        </Routes>
    );
};
export default App;