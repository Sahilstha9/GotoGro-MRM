import React from "react";
import {createRoot} from "react-dom/client";

import {BrowserRouter} from "react-router-dom";
import Container from "./Container";

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
    <React.StrictMode>
        <BrowserRouter>
            <Container/>
        </BrowserRouter>
    </React.StrictMode>
);
