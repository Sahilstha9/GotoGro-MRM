import React from "react";

// We use Route in order to define the different routes of our application
import {Route, Routes} from "react-router-dom";
import {useNavigate} from "react-router";
// We import all the components we need in our app

import List from "./list";
import Create from "./create";
import Edit from "./edit";


const App = () => {
    return (
        <Routes>
            <Route exact path="/" element={<List.component/>}/>
            <Route path="/create" element={<Create.component navigate={useNavigate()}/>}/>
            <Route path="/edit/:id" element={<Edit/>}/>
        </Routes>
    );
};

export default App;
