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
        fetch(`${origin.replace("3000", "5000")}/api/v1/members/${this.props.record._id}`, {
            method: "PUT",
            body: JSON.stringify(values),
            headers: {
                'Content-Type': 'application/json'
            },
        }).then(() => {
            this.setState({open: !this.state.open});
            message.success("Member has been edited successfully");
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
                title="Edit Member"
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
                    title="Are you sure to delete this member?"
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
        fetch(`${origin.replace("3000", "5000")}/api/v1/members/${this.props.record._id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then((result) => {
            result.json().then(() => {
                this.toggleMenu();
                message.success("Member has been deleted");
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


class MemberTable extends React.Component {
    tableRef = React.createRef();

    constructor(props) {
        super(props);
        this.state = {records: []};

        this.columns = [
            {
                title: 'Member ID',
                dataIndex: '_id',
            },
            {
                title: 'First Name',
                dataIndex: 'firstName',
            },
            {
                title: 'Last Name',
                dataIndex: 'lastName',
            },
            {
                title: 'Action',
                key: 'action',
                render: this.renderActions,
            },
        ];
    }

    componentDidMount() {
        fetch(`${origin.replace("3000", "5000")}/api/v1/members`)
            .then(response => response.json())
            .then(data => {
                this.setState({records: data});
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    onUpdate = (data) => {
        this.setState({data})
    }

    renderActions = (text, record) => (
        <OverlayVisible {...this.props} record={record} forwardRef={this.tableRef} dataSource={this.state.records}
                        onUpdate={this.componentDidMount.bind(this)}/>
    )

    render() {
        return (
            <div>
                <NavLink to="./create">
                    <Button type="primary" icon={<UserAddOutlined/>}>
                        Create New Member
                    </Button>
                </NavLink>
                <Table
                    columns={this.columns}
                    ref={this.tableRef}
                    dataSource={this.state.records}
                    title={() => 'Member List'}
                    rowKey={"_id"}
                    size={"middle"}
                />
            </div>
        );
    }
}

export default {
    name: "MemberTable",
    component: function (props) {
        return new MemberTable(props)
    }
};


/*
import React, {useEffect, useState} from "react";
import {Link, NavLink} from "react-router-dom";
import {Button} from "antd";
import {UserAddOutlined} from "@ant-design/icons";

const Record = (props) => (
    <tr>
        <td>{props.record._id}</td>
        <td>{props.record.firstName}</td>
        <td>{props.record.lastName}</td>
        <td>
            <Link className="btn btn-link" to={`./edit/${props.record._id}`}>Edit</Link> |
            <button className="btn btn-link"
                    onClick={() => {
                        props.deleteRecord(props.record._id);
                    }}
            >
                Delete
            </button>
        </td>
    </tr>
);


export default function RecordList() {
    const [records, setRecords] = useState([]);
    const origin = window.location.origin;
    //const port = window.location.port;

    // This method fetches the records from the database.
    useEffect(() => {
        async function getRecords() {
            const response = await fetch(`${origin.replace("3000", "5000")}/api/v1/members`);

            if (!response.ok) {
                const message = `An error occurred: ${response.statusText}`;
                window.alert(message);
                return;
            }

            const records = await response.json();
            setRecords(records);
        }

        getRecords();
    }, [records.length]);

    // This method will delete a record
    async function deleteRecord(id) {
        await fetch(`${origin.replace("3000", "5000")}/api/v1/members/${id}`, {
            method: "DELETE"
        });

        const newRecords = records.filter((el) => el._id !== id);
        setRecords(newRecords);
    }

    // This method will map out the records on the table
    function recordList() {
        return records.map((record) => {
            return (
                <Record
                    record={record}
                    deleteRecord={() => deleteRecord(record._id)}
                    key={record._id}
                />
            );
        });
    }

    return (
        <div>
            <h3>Member Record List</h3>
            <NavLink to="./create">
                <Button type="primary" icon={<UserAddOutlined/>}>
                    Create Member
                </Button>
            </NavLink>
            <table className="table table-striped" style={{marginTop: 20}}>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Action</th>
                </tr>
                </thead>
                <tbody>{recordList()}</tbody>
            </table>
        </div>
    );
}
*/
