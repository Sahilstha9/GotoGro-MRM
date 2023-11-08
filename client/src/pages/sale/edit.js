import React, {useState, useEffect} from "react";
import {useParams, useNavigate} from "react-router";

export default function Edit() {
    const [form, setForm] = useState({
        member_id: "",
        products: [],
        records: []
    });

    const params = useParams();
    const navigate = useNavigate();
    const origin = window.location.origin;
    //const port = window.location.port;


    useEffect(() => {
        async function fetchData() {
            const id = params.id.toString();
            const response = await fetch(`${origin.replace("3000", "5000")}/api/v1/sales/${params.id.toString()}`);

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


    //  For products list
    const handleFormChange = (index, event) => {
        let data = [...form.products];
        data[index][event.target.name] = event.target.value;
        updateForm({ products: data });
    }

    const addFields = (e) => {
        e.preventDefault();
        let newField = { id: '', qty: 0 };
        let data = form.products;
        data[form.products.length] = newField;

        updateForm({ products: data })
    }

    const removeFields = (index, e) => {
        e.preventDefault();
        let data = [...form.products];
        data.splice(index, 1)
        updateForm({products: data})
    }

    async function onSubmit(e) {
        e.preventDefault();
        const editedRecord = {
            member_id: form.member_id,
            products: form.products
        };

        // This will send a post request to update the data in the database.
        await fetch(`${origin.replace("3000", "5000")}/sales/${params.id}`, {
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
                    <label htmlFor="member_id">Customer ID</label>
                    <input
                        name='member_id'
                        type="text"
                        className="form-control"
                        id="member_id"
                        value={form.member_id}
                        onChange={(e) => updateForm({member_id: e.target.value})}
                    />
                </div>
                <br />
                <div className="form-group">
                    <p><label>Product List</label></p>
                    <label htmlFor="id" style={{width:"50%"}}>Product ID: </label>
                    <label htmlFor="qty" style={{width:"50%"}}>Quantity: </label>
                {form.products.map((input, index) => {
                    return (
                <div className="form-group" key={index} style={{display: "flex"}}>

                    <input
                        name='id'
                        type="text"
                        className="form-control"
                        id={"product_id_" + index.toString()}
                        value={input.id}
                        onChange={(event) => handleFormChange(index, event)}
                    />

                    <input
                        name='qty'
                        type="number"
                        className="form-control"
                        id={"qty_" + index.toString()}
                        value={input.qty}
                        onChange={(event) => handleFormChange(index, event)}
                    />
                    <input
                    type="button"
                    value="Remove"
                    className="btn btn-primary"
                    onClick={(e) => removeFields(index, e)}
                />
                </div>
                )
                })}

                <input
                    type="button"
                    value="Add Product"
                    className="btn btn-primary"
                    onClick={addFields}
                />
                </div>
                <br />
                <div className="form-group">
                    <input
                        type="submit"
                        value="Update sale"
                        className="btn btn-primary"
                    />
                </div>
            </form>
        </div>
    );
}
