import React, {useState, useEffect} from "react";
import {useParams, useNavigate} from "react-router";
import {Form, Input, Radio} from "antd";
import SearchBox from "../../components/SearchBox";


class EditForm extends React.Component {
    formRef = React.createRef();

    constructor(props) {
        super(props);

        this.state = {
            form: props.record,
        }

        this.origin = window.location.origin;
    }

    componentDidMount() {
        console.log(this.formRef);
        this.formRef.current.getFieldValue('name')
        this.formRef.current.setFieldsValue(this.props.record);
    }

    render() {
        return (
            <Form
                name={"user"}
                ref={this.formRef}
                form={this.form}
            >
                <Form.Item
                    name={"name"}
                    label={'First Name'}
                    rules={[
                        {
                            required: true,
                            message: 'Missing Member Name',
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
                            message: 'Missing Member Name',
                        },
                    ]}
                >

                    <Input
                        type="text"
                        //onChange={(e) => updateForm({username: e.target.value})}
                    />
                </Form.Item>
                <Form.Item
                    name={"password"}
                    label={'Password'}
                    rules={[
                        {
                            required: true,
                            message: 'Missing Member Name',
                        },
                    ]}
                >

                    <Input
                        type="password"
                        //onChange={(e) => updateForm({password: e.target.value})}
                    />
                </Form.Item>
                <Form.Item
                    name={"role"}
                    label={'Role'}
                    rules={[
                        {
                            required: true,
                            message: 'Missing Member Name',
                        },
                    ]}
                >

                    <Radio.Group onChange={this.onChange} value={this.state.value}>
                        <Radio value={"Staff"}>Staff</Radio>
                        <Radio value={"Manager"}>Manager</Radio>
                    </Radio.Group>
                </Form.Item>

            </Form>
        );
    }

}

/*
 <div className="form-group">
                        <div className="form-check form-check-inline">
                            <label htmlFor="positionStaff" className="form-check-label">Staff</label>
                            <input
                                className="form-check-input"
                                type="radio"
                                name="positionOptions"
                                id="positionStaff"
                                value="Staff"
                                checked={form.role === "Staff"}
                                onChange={(e) => updateForm({role: e.target.value})}
                            />
                        </div>
                        <div className="form-check form-check-inline">
                            <label htmlFor="positionManager" className="form-check-label">Manager</label>
                            <input
                                className="form-check-input"
                                type="radio"
                                name="positionOptions"
                                id="positionManager"
                                value="Manager"
                                checked={form.role === "Manager"}
                                onChange={(e) => updateForm({role: e.target.value})}
                            />
                        </div>
                    </div>
 */

export default {
    name: "EmployeeEditForm",
    component: (props) => new EditForm(props)
};

/*
export default function Edit() {
const [form, setForm] = useState({
    name: "",
    role: "",
    username: "",
    password: "",
    records: [],
});
const params = useParams();
const navigate = useNavigate();
const origin = window.location.origin;
//const port = window.location.port;

useEffect(() => {
    async function fetchData() {
        const id = params.id.toString();
        const response = await fetch(`${origin.replace("3000", "5000")}/api/v1/users/${params.id.toString()}`);

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
        name: form.name,
        username: form.username,
        password: form.password,
        role: form.role,
    };

    // This will send a post request to update the data in the database.
    await fetch(`${origin.replace("3000", "5000")}/api/v1/users/${params.id}`, {
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
        <h3>Update Record</h3>
        <form onSubmit={onSubmit}>
            <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                    type="text"
                    className="form-control"
                    id="name"
                    value={form.name}
                    onChange={(e) => updateForm({name: e.target.value})}
                />
            </div>
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
                <div className="form-check form-check-inline">
                    <label htmlFor="positionStaff" className="form-check-label">Staff</label>
                    <input
                        className="form-check-input"
                        type="radio"
                        name="positionOptions"
                        id="positionStaff"
                        value="Staff"
                        checked={form.role === "Staff"}
                        onChange={(e) => updateForm({role: e.target.value})}
                    />
                </div>
                <div className="form-check form-check-inline">
                    <label htmlFor="positionManager" className="form-check-label">Manager</label>
                    <input
                        className="form-check-input"
                        type="radio"
                        name="positionOptions"
                        id="positionManager"
                        value="Manager"
                        checked={form.role === "Manager"}
                        onChange={(e) => updateForm({role: e.target.value})}
                    />
                </div>
            </div>
            <div className="form-group">
                <input
                    type="submit"
                    value="Submit"
                    className="btn btn-primary"
                />
            </div>
        </form>
    </div>
);
}
*/