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
            `${origin.replace("3000", "5000")}/api/v1/members/`, // The URL to send the request to
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
                name={"member"}
                ref={this.formRef}
                onFinish={this.onFinish}
            >
                <Form.Item
                    name={"firstName"}
                    label={'First Name'}
                    rules={[
                        {
                            required: true,
                            message: 'Missing First Name',
                        },
                    ]}
                >
                    <Input
                        type="text"
                    />
                </Form.Item>
                <Form.Item
                    name={"lastName"}
                    label={'Last Name'}
                    rules={[
                        {
                            required: true,
                            message: 'Missing Last Name',
                        },
                    ]}
                >
                    <Input
                        type="text"
                    />
                </Form.Item>
                <FormActions {...this.props} onFinish={this.onFinish} onReset={this.onReset} onFill={this.onFill}/>
            </Form>
        );
    }
}

// Export the component
export default {
    name: "MemberCreateForm",
    component: function (props) {
        return new CreateForm(props)
    }
};

/*
import React, {useState} from "react";
import {useNavigate} from "react-router";

export default function Create() {
    const [form, setForm] = useState({
        firstName: "",
        lastName: ""
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

        await fetch(`${origin.replace("3000", "5000")}/api/v1/members`, {
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

        setForm({firstName: "", lastName: ""});
        navigate("..");
    }

    // This following section will display the form that takes the input from the user.
    return (
        <div>
            <h3>Create New Member</h3>
            <form onSubmit={onSubmit}>
                <div className="form-group">
                    <label htmlFor="firstName">First name</label>
                    <input
                        type="text"
                        className="form-control"
                        id="firstName"
                        value={form.firstName}
                        onChange={(e) => updateForm({firstName: e.target.value})}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="lastName">Last name</label>
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
                        value="Create Member"
                        className="btn btn-primary"
                    />
                </div>
            </form>
        </div>
    );
}
*/