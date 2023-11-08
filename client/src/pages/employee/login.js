import React, {useState} from "react";
import {useNavigate} from "react-router";

export default function Login() {
    const [form, setForm] = useState({
        username: "",
        password: ""
    });
    const navigate = useNavigate();
    const origin = window.location.origin;
    // const port = window.location.port;

    // These methods will update the state properties.
    function updateForm(value) {
        return setForm(
            (prev) => {
                return {...prev, ...value};
            });
    }

    // This function will handle the submission.
    async function onSubmit(e) {
        e.preventDefault();

        // When a post request is sent to the path "create", we'll add a new record to the database.
        const newRecord = {...form};

        await fetch(`${origin.replace("3000", "5000")}/api/v1/users/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newRecord),
        })
            .catch(error => {
                window.alert(error);
                //return;
            });

        setForm({
            username: "",
            password: ""
        });

        navigate("..");
    }

    // This following section will display the form that takes the input from the user.
    return (
        <div>
            <h3>Employee Login</h3>
            <form onSubmit={onSubmit}>
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        className="form-control"
                        id="username"
                        value={form.username}
                        onChange={(e) => updateForm({username: e.target.value})}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        className="form-control"
                        id="password"
                        value={form.password}
                        onChange={(e) => updateForm({password: e.target.value})}
                    />
                </div>
                <div className="form-group">
                    <input
                        type="submit"
                        value="Login"
                        className="btn btn-primary"
                    />
                </div>
            </form>
        </div>
    );
}
