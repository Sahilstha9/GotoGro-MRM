import React from "react";
import {Button, Result} from 'antd';
import {
    NavLink
} from "react-router-dom";

export default function Code404() {
    return (
        <div>
            <h3>
                No match for <code>{window.location.pathname}</code>
            </h3>

            <Result
                status="404"
                title="404"
                subTitle="Sorry, the page you visited does not exist."
                extra={<NavLink
                    to="./user"
                >
                    <Button type="primary">Back Home</Button>
                </NavLink>}
            />
        </div>

    );
};