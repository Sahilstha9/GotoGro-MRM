import React, {useState, useEffect} from "react";
import {useParams, useNavigate} from "react-router";
import {Form, Input, Radio} from "antd";
import SearchBox from "../../components/SearchBox";

export default function Edit() {
    const [form, setForm] = useState({
        name: "",
        category: "",
        price: "",
        life: "",
        records: []
    });
    const params = useParams();
    const navigate = useNavigate();
    const origin = window.location.origin;
    //const port = window.location.port;

    useEffect(() => {
        async function fetchData() {
            const id = params.id.toString();
            const response = await fetch(`${origin.replace("3000", "5000")}/api/v1/products/${params.id.toString()}`);

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
        const editedRecord = {
            name: form.name,
            category: form.category,
            price: form.price,
            life: form.life
        };

        // This will send a post request to update the data in the database.
        await fetch(`${origin.replace("3000", "5000")}/api/v1/products/${params.id}`, {
            method: "PUT",
            body: JSON.stringify(editedRecord),
            headers: {
                'Content-Type': 'application/json'
            },
        });

        navigate("..");
    }

    // This following section will display the form that takes input from the user to update the data.
    return (
        <div>
            <h3>Update Record</h3>
            <form onSubmit={onSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Product Name</label>
                    <input
                        type="text"
                        className="form-control"
                        id="name"
                        value={form.name}
                        onChange={(e) => updateForm({name: e.target.value})}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="category">Product Category</label>
                    <input
                        type="text"
                        className="form-control"
                        id="category"
                        value={form.category}
                        onChange={(e) => updateForm({category: e.target.value})}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="price">Product Price</label>
                    <input
                        type="number"
                        className="form-control"
                        id="price"
                        value={form.price}
                        step="0.01"
                        min="0"
                        onChange={(e) => updateForm({price: e.target.value})}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="life">Product Life (Days)</label>
                    <input
                        type="number"
                        className="form-control"
                        id="life"
                        value = {form.life}
                        step="1"
                        min="0"
                        onChange={(e) => updateForm({life: e.target.value})}
                    />
                </div>

                <br/>

                <div className="form-group">
                    <input
                        type="submit"
                        value="Update Record"
                        className="btn btn-primary"
                    />
                </div>
            </form>
        </div>
    );
}
