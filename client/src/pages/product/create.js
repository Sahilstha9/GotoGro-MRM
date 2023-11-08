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
            `${origin.replace("3000", "5000")}/api/v1/products/`, // The URL to send the request to
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
                    name={"category"}
                    label={'Product Category'}
                    rules={[
                        {
                            required: true,
                            message: 'Missing Product Category',
                        },
                    ]}
                >
                    <Input
                        type="text"
                    />
                </Form.Item>
                <Form.Item
                    name={"price"}
                    label={'Product Price'}
                    rules={[
                        {
                            required: true,
                            message: 'Missing price',
                        },
                    ]}
                >
                    <Input
                        type="number"
                        placeholder={"Quantity"}
                        step="0.01"
                        min="0"
                    />
                </Form.Item>
                <Form.Item
                    name={"life"}
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
    name: "ProductCreateForm",
    component: function (props) {
        return new CreateForm(props)
    }
};


/*
import React, {useState} from "react";
import {useNavigate} from "react-router";

export default function Create() {
    const [form, setForm] = useState({
        name: "",
        category: "",
        price: "",
        life: ""
    });
    const navigate = useNavigate();
    const origin = window.location.origin;

    // These methods will update the state properties.
    function updateForm(value) {
        return setForm((prev) => {
            return {...prev, ...value};
        });
    }

    // This function will handle the submission.
    async function onSubmit(e) {
        e.preventDefault();

        // When a post request is sent to the create url, we'll add a new record to the database.
        const newRecord = {...form};

        await fetch(`${origin.replace("3000", "5000")}/api/v1/products`, {
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
            name: "",
            category: "",
            price: "",
            life: ""
        });

        navigate("..");
    }

    // This following section will display the form that takes the input from the user.
    return (
        <div>
            <h3>Create New Record</h3>
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
                    <label htmlFor="life">Product Shelf Life (Days)</label>
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

                <div className="form-group">
                    <input
                        type="submit"
                        value="Create product"
                        className="btn btn-primary"
                    />
                </div>
                <br/>
            </form>
        </div>
    );
}
*/
