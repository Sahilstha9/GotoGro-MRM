import React from "react";
import {Button, Form, Input, Radio} from "antd";

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
 * The CreateForm component that will be used to create or edit an employee
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
            `${origin.replace("3000", "5000")}/api/v1/users/`, // The URL to send the request to
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
            ...this.props.form || {
                firstName: "hello",
                lastName: "world",
                username: "HelloWorld",
                password: "password",
                role: "Staff"
            }, // Sample data
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
                name={"user"}
                ref={this.formRef}
                onFinish={this.onFinish}
            >
                <Form.Item
                    name={"firstName"}
                    label={'First Name'}
                    rules={[
                        {
                            required: true,
                            message: 'Missing first name',
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
                            message: 'Missing last name',
                        },
                    ]}
                >
                    <Input
                        type="text"
                    />
                </Form.Item>
                <Form.Item
                    name={"username"}
                    label={'Username'}
                    rules={[
                        {
                            required: true,
                            message: 'Missing username',
                        },
                    ]}
                >
                    <Input
                        type="text"
                    />
                </Form.Item>
                <Form.Item
                    name={"password"}
                    label={'Password'}
                    rules={[
                        {
                            required: true,
                            message: 'Missing password',
                        },
                    ]}
                >
                    <Input
                        type="password"
                    />
                </Form.Item>
                <Form.Item
                    name={"role"}
                    label={'Role'}
                    rules={[
                        {
                            required: true,
                            message: 'Select a role',
                        },
                    ]}
                >
                    <Radio.Group onChange={this.onChange} value={this.props.value}>
                        <Radio value={"Staff"}>Staff</Radio>
                        <Radio value={"Manager"}>Manager</Radio>
                    </Radio.Group>
                </Form.Item>
                <FormActions {...this.props} onFinish={this.onFinish} onReset={this.onReset} onFill={this.onFill}/>
            </Form>
        );
    }
}

// Export the component
export default {
    name: "EmployeeCreateForm",
    component: function (props) {
        return new CreateForm(props)
    }
};