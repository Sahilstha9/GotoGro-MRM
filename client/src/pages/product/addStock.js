import React from "react";
import {Button, Form, Input} from "antd";

/**
 * @description Form action buttons for the edit form
 * @returns {JSX.Element} - Form action buttons
 * @example
 * <FormActions onReset={onReset} onFill={onFill} />
 */
class FormActions extends React.Component {

    /**
     * @constructor FormActions
     * @param {Object} props - The props object
     * @param {Function} props.onReset - Reset the form
     * @param {Function} props.onFill - Fill the form with sample data
     */
    constructor(props) {
        super(props);
        this.origin = window.location.origin;
    }

    /**
     * @description Render the form action buttons
     * @returns {JSX.Element} - Form action buttons
     */
    render() {
        if (!this.props.modal) {
            return (
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                    <Button htmlType="button" onClick={this.props.onReset}>
                        Reset
                    </Button>
                    <Button type="link" htmlType="button" onClick={this.props.onFill}>
                        Fill form
                    </Button>
                </Form.Item>
            );
        }
    }
}

/**
 * The CreateForm component that will be used to create or edit a member
 * @type {React.Component} - The form component
 *
 * @returns {React.Component} - The component that will be rendered.
 * @example
 * <CreateForm.component {...this.props} record={Object} />
 *
 * @see https://reactjs.org/docs/react-component.html - React.Component
 * @see https://reactjs.org/docs/hooks-state.html - React Hooks
 * @see https://ant.design/components/form/ - Ant Design Form
 * @see https://ant.design/components/modal/ - Ant Design Modal
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch - Fetch API
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Window/location/origin - Window.location.origin
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector - Document.querySelector
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Element/children - Element.children
 */
class CreateForm extends React.Component {
    formRef = React.createRef();

    /**
     * @constructor CreateForm
     * @param {object} props - The props that are passed to the component.
     * @param {object} props.record - The record that is being edited.
     * @param {Router.navigate} props.navigate - The function that will be used to navigate to a different page.
     * @param {boolean} props.modal - Whether or not the form is being used in a modal.
     */
    constructor(props) {
        super(props);
        this.origin = window.location.origin;
    }

    componentDidMount() {
        this.formRef.current.setFieldsValue(this.props.record);
    }

    /**
     * @description Handle the form submission
     * @param {Object} values - The values from the form
     */
    onFinish = (values) => {
        fetch(
            `${origin.replace("3000", "5000")}/api/v1/products/stocks`, // The URL to send the request to
            {
                method: "POST",                         // post request to create a new user
                body: JSON.stringify(values),           // body data type must match "Content-Type" header
                headers: {                              // This is required for the body to be sent as JSON
                    'Content-Type': 'application/json'  // The type of data that you're sending
                },
            })
            .then(() =>       // the response is a promise
                this.props.navigate('') // Navigate to the user page
            )
            .catch(error =>             // Handle the error
                window.alert(error)     // Display the error
            );
    };

    // Reset the form
    onReset = () => {
        this.formRef.current.resetFields();
    };

    // Fill the form with sample data
    onFill = () => {
        this.formRef.current.setFieldsValue({
            ...this.props.form || {firstName: "hello", lastName: "world"}, // Sample data
        });
    };

    /**
     * @description Render the form
     * @returns {JSX.Element} - The form component
     * @example
     * <CreateForm.component {...this.props} record={Object} />
     */
    render() {
        return (
            <Form
                name={"product"}
                ref={this.formRef}
                onFinish={this.onFinish}
            >
                <Form.Item
                    name={"_id"}
                    label={'Product ID'}
                    rules={[
                        {
                            required: true,
                            message: 'Missing Product ID',
                        },
                    ]}
                >
                    <Input
                        type="text"
                    />
                </Form.Item>
                <Form.Item
                    name={"name"}
                    label={'Product Name'}
                    rules={[
                        {
                            required: true,
                            message: 'Missing Product Name',
                        },
                    ]}
                >
                    <Input
                        type="text"
                    />
                </Form.Item>
                <Form.Item
                    name={"quantity"}
                    label={'Product Quantity'}
                    rules={[
                        {
                            required: true,
                            message: 'Missing quantity',
                        },
                    ]}
                >
                    <Input
                        type="number"
                        placeholder={"Quantity"}
                        step="1"
                        min="0"
                    />
                </Form.Item>
                <Form.Item
                    name={"expiryDate"}
                    label={'Product Shelf Life (Days)'}
                    rules={[
                        {
                            required: true,
                            message: 'Missing shelf life',
                        },
                    ]}
                >
                    <Input
                        type="number"
                        placeholder={"Shelf Life (days)"}
                        step="1"
                        min="0"
                    />
                </Form.Item>
                <FormActions {...this.props} onFinish={this.onFinish} onReset={this.onReset} onFill={this.onFill}/>
            </Form>
        );
    }
}

// Export the component
export default {
    name: "StockForm",
    component: function (props) {
        return new CreateForm(props)
    }
};

/*
import React, {useState, useEffect} from "react";
import {useParams, useNavigate} from "react-router";

export default function Add() {
    const [form, setForm] = useState({
        product_id : "",
        quantity : "",
        expiryDate: ""
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
        const date = new Date(); // Now
        date.setDate(date.getDate() + form.life); // Set now + life of product days as the new date
        const addedStock = {
            product_id: form._id,
            quantity : form.quantity,
            expiryDate : date.toDateString(),
        };

        // This will send a post request to update the data in the database.
        await fetch(`${origin.replace("3000", "5000")}/api/v1/products/stocks`, {
            method: "POST",
            body: JSON.stringify(addedStock),
            headers: {
                'Content-Type': 'application/json'
            },
        });

        navigate("..");
    }

    // This following section will display the form that takes input from the user to update the data.
    return (
        <div>
            <h3>Add Stock</h3>
            <form onSubmit={onSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Product Id</label>
                    <input
                        type="text"
                        className="form-control"
                        id="name"
                        value={form._id}
                        onChange={(e) => updateForm({product_id: e.target.value})}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input
                        type="text"
                        className="form-control"
                        id="name"
                        readOnly value={form.name}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="quantity">Quantity To Add</label>
                    <input
                        type="number"
                        className="form-control"
                        id="quantity"
                        onChange={(e) => updateForm({quantity: e.target.value})}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="life">Product Life (Days)</label>
                    <input
                        type="number"
                        className="form-control"
                        id="life"
                        readOnly value={form.life}
                        contentEditable={"false"}
                    />
                </div>

                <br/>

                <div className="form-group">
                    <input
                        type="submit"
                        value="Add Stock"
                        className="btn btn-primary"
                    />
                </div>
            </form>
        </div>
    );
}*/
