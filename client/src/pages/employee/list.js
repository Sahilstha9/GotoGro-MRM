import React from "react";
import {NavLink} from "react-router-dom";
import {DownOutlined, EditOutlined, DeleteOutlined, UserAddOutlined} from '@ant-design/icons';
import {Dropdown, Menu, Space, Table, Popconfirm, message, Modal, Button} from 'antd';
import EditUserForm from "./create";

class EditModal extends React.Component {
    formRef = React.createRef();

    constructor(props) {
        super(props);
        this.state = {
            open: props.open
        }
    }

    onFormSubmit = (values) => {
        // This will send a put request to update the data in the database.
        fetch(`${origin.replace("3000", "5000")}/api/v1/users/${this.props.record._id}`, {
            method: "PUT",
            body: JSON.stringify(values),
            headers: {
                'Content-Type': 'application/json'
            },
        }).then(() => {
            this.setState({open: !this.state.open});
            message.success("Employee has been edited successfully"); // Implemented according to sprint 1 feedback
            this.props.onUpdate();
        })
    };

    validateEditForm = () => {
        this.form = this.formRef.current.formRef.current;
        this.form.validateFields()
            .then((values) => {
                this.onFormSubmit(values);
            })
            .catch((info) => {
                console.log('Validate Failed:', info);
            });
    }

    showModal = () => {
        this.setState({open: true});
    };

    render() {
        const {open} = this.state;

        return (
            <Modal
                open={open}
                title="Edit User"
                okText="Update"
                cancelText="Cancel"
                onCancel={() => {
                    this.setState({open: !this.state.open});
                }}
                onOk={this.validateEditForm}
            >
                <EditUserForm.component ref={this.formRef} {...this.props} modal={true}/>
            </Modal>
        );
    }
}


class OverlayVisible extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            visible: false,
            isModalOpen: false,
        };
        this.myRef = React.createRef();
        // Implemented according to sprint 1 feedback
        this.items = [
            {
                key: '1',
                label: 'Edit',
                icon: <EditOutlined/>
            },
            {
                key: '2',
                label: <Popconfirm
                    title="Are you sure to delete this user?"
                    onConfirm={() => this.deleteRecord()}
                    onCancel={() => this.cancelAction()}
                    okText="Yes"
                    cancelText="No"
                    zIndex={1050}
                >Delete</Popconfirm>,
                icon: <DeleteOutlined/>,
            },
        ];
    }

    openEditForm = () => {
        const node = this.myRef.current;
        node.showModal();
    }

    handleMenuClick = (e) => {
        if (e.key === "1") {
            this.setState({visible: false});
            this.openEditForm();
        }
    };

    handleVisibleChange = (flag) => {
        this.setState({visible: flag});
    };

    deleteRecord() {
        fetch(`${origin.replace("3000", "5000")}/api/v1/users/${this.props.record._id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then((result) => {
            result.json().then(() => {
                this.toggleMenu();
                message.success("Employee has been deleted"); // Implemented according to sprint 1 feedback
                this.props.onUpdate();
            })
        })
    }

    cancelAction = () => {
        this.toggleMenu();
    };

    toggleMenu = () => {
        this.setState({visible: !this.state.visible});
    };

    render() {
        const menu = (
            <Menu items={this.items}
                  onClick={this.handleMenuClick}
            />
        );

        return (
            <Space size="middle">
                <Dropdown
                    overlay={menu}
                    trigger={['click']}
                    onOpenChange={this.handleVisibleChange}
                    open={this.state.visible}
                    onClick={() => {
                        this.setState({visible: true});
                    }}
                >
                    <a>
                        More <DownOutlined/>
                    </a>
                </Dropdown>
                <EditModal ref={this.myRef} {...this.props} />
            </Space>
        );
    }
}


class EmployeeTable extends React.Component {
    tableRef = React.createRef();

    constructor(props) {
        super(props);
        this.state = {employees: []};

        this.columns = [
            {
                title: 'First Name',
                dataIndex: 'firstName',
            },
            {
                title: 'Last Name',
                dataIndex: 'lastName',
            },
            {
                title: 'Username',
                dataIndex: 'username',
            },
            {
                title: 'Role',
                dataIndex: 'role',
            },
            {
                title: 'Action',
                key: 'action',
                render: this.renderActions,
            },
        ];
    }

    componentDidMount() {
        fetch(`${origin.replace("3000", "5000")}/api/v1/users`)
            .then(response => response.json())
            .then(data => {
                this.setState({employees: data});
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    onUpdate = (data) => {
        this.setState({data})
    }

    renderActions = (text, record) => (
        <OverlayVisible {...this.props} record={record} forwardRef={this.tableRef} dataSource={this.state.employees}
                        onUpdate={this.componentDidMount.bind(this)}/>
    )

    render() {
        return (
            <div>
                <NavLink to="./create">
                    <Button type="primary" icon={<UserAddOutlined/>}>
                        Create New Employee
                    </Button>
                </NavLink>
                <Table
                    columns={this.columns}
                    ref={this.tableRef}
                    dataSource={this.state.employees}
                    title={() => 'Employee List'}
                    rowKey={"_id"}
                    size={"middle"}
                />
            </div>
        );
    }
}

export default {
    name: "EmployeeTable",
    component: function (props) {
        return new EmployeeTable(props)
    }
};
