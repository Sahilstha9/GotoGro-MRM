import React, {useState, useEffect} from "react";
import {useParams, useNavigate} from "react-router";

export default function Edit() {
    const [form, setForm] = useState({
        firstName: "",
        lastName: ""
    });
    const params = useParams();
    const navigate = useNavigate();
    const origin = window.location.origin;
    //const port = window.location.port;

    useEffect(() => {
        async function fetchData() {
            const id = params.id.toString();
            const response = await fetch(`${origin.replace("3000", "5000")}/api/v1/members/${params.id.toString()}`);

            if (!response.ok) {
                const message = `An error has occurred: ${response.statusText}`;
                window.alert(message);
                return;
            }

            const record = await response.json();
            if (!record) {
                window.alert(`Record with id ${id} not found`);
                navigate("..");
                return;
            }

            setForm(record);
        }

        fetchData().then(r => r);

        //return;
    }, [params.id, navigate]);

    // These methods will update the state properties.
    function updateForm(value) {
        return setForm((prev) => {
            return {...prev, ...value};
        });
    }

    async function onSubmit(e) {
        e.preventDefault();
        const editedPerson = {
            firstName: form.firstName,
            lastName: form.lastName

        };

        // This will send a post request to update the data in the database.
        await fetch(`${origin.replace("3000", "5000")}/api/v1/members/${params.id}`, {
            method: "PUT",
            body: JSON.stringify(editedPerson),
            headers: {
                'Content-Type': 'application/json'
            },
        });

        navigate("..");
    }

    // This following section will display the form that takes input from the user to update the data.
    return (
        <div>
            <h3>Update Member Record</h3>
            <form onSubmit={onSubmit}>
                <div className="form-group">
                    <label htmlFor="firstName">First name: </label>
                    <input
                        type="text"
                        className="form-control"
                        id="firstName"
                        value={form.firstName}
                        onChange={(e) => updateForm({firstName: e.target.value})}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="lastName">Last name:</label>
                    <input
                        type="text"
                        className="form-control"
                        id="lastName"
                        value={form.lastName}
                        onChange={(e) => updateForm({lastName: e.target.value})}
                    />
                </div>


                <br/>

                <div className="form-group">
                    <input
                        type="submit"
                        value="Update Member details"
                        className="btn btn-primary"
                    />
                </div>
            </form>
        </div>
    );
}
