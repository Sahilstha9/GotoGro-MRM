import React from "react";
import {NavLink} from "react-router-dom";
import {DownOutlined, EditOutlined, DeleteOutlined, UserAddOutlined} from '@ant-design/icons';
import {Dropdown, Menu, Space, Table, Popconfirm, message, Modal, Button} from 'antd';
import SaleForm from "./create";

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
        fetch(`${origin.replace("3000", "5000")}/api/v1/sales/${this.props.record._id}`, {
            method: "PUT",
            body: JSON.stringify(values),
            headers: {
                'Content-Type': 'application/json'
            },
        }).then(() => {
            this.setState({open: !this.state.open});
            message.success("Sale has been edited successfully"); // Implemented according to sprint 1 feedback
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
                title="Edit Sale"
                okText="Update"
                cancelText="Cancel"
                onCancel={() => {
                    this.form = this.formRef.current.formRef.current;
                    this.form.resetFields();
                    this.setState({open: !this.state.open});
                }}
                onOk={this.validateEditForm}
            >
                <SaleForm.component ref={this.formRef} {...this.props} modal={true}/>
            </Modal>
        );
    }
}

class OverlaySaleProductVisible extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            visible: false,
        };
        this.myRef = React.createRef();
    };

    refundItem() {
        /* fetch(`${origin.replace("3000", "5000")}/api/v1/sales/${this.props.record._id}`, {
             method: 'DELETE',
             headers: {
                 'Accept': 'application/json',
                 'Content-Type': 'application/json'
             }
         }).then((result) => {
             result.json().then(() => {
                 this.toggleMenu();
                 message.success("Sale item has been refunded successfully"); // Implemented according to sprint 1 feedback
                 this.props.onUpdate();
             })
         })*/

        this.toggleMenu();
        message.info("Todo: Refund item");
        this.props.onUpdate();
    }

    cancelAction = () => {
        this.toggleMenu();
    };

    toggleMenu = () => {
        this.setState({visible: !this.state.visible});
    };

    render() {
        // Implemented according to sprint 1 feedback
        return (
            <Space size="middle">
                <Popconfirm
                    title="Are you sure to refund this item?"
                    onConfirm={() => this.refundItem()}
                    onCancel={() => this.cancelAction()}
                    okText="Yes"
                    cancelText="No"
                >
                    <a href="#">Refund</a>
                </Popconfirm>
            </Space>
        );
    }
}

class OverlaySaleVisible extends React.Component {
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
                    title="Are you sure to delete this sale?"
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
        fetch(`${origin.replace("3000", "5000")}/api/v1/sales/${this.props.record._id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then((result) => {
            result.json().then(() => {
                this.toggleMenu();
                message.success("Sale has been deleted"); // Implemented according to sprint 1 feedback
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

class SaleProductTable extends React.Component {
    expandedTableRef = React.createRef();

    constructor(props) {
        super(props);
        this.state = {records: this.props.record.products};
        console.log(this.props.record.products)
        this.columns = [
            {
                title: 'Name',
                dataIndex: 'name',
            },
            {
                title: 'Quantity',
                dataIndex: 'qty',
            },
            {
                title: 'Unit Price',
                dataIndex: 'price',
                render: (e) => `$${e.toFixed(2)}`,
            },
            {
                title: 'Total',
                render: (e) => `$${(e.price * e.qty).toFixed(2)}`,
                key: 'product_price',
            },
            {
                title: 'Action',
                key: 'action',
                render: this.renderActions,
            },
        ];
    }

    componentDidMount() {
        this.setState({records: this.props.record.products});
    }

    onUpdate = (data) => {
        this.setState({data})
    }

    renderActions = (text, record) => (
        <OverlaySaleProductVisible {...this.props} record={record} dataSource={this.state.records.products}
                                   forwardRef={this.expandedTableRef} onUpdate={this.componentDidMount.bind(this)}/>
    )

    render() {
        return (
            <Table
                columns={this.columns}
                ref={this.expandedTableRef}
                dataSource={this.props.record.products}
                rowKey={"_id"}
                size={"small"}
                pagination={false}
            />
        );
    }
}

class SaleTable extends React.Component {
    tableRef = React.createRef();

    constructor(props) {
        super(props);
        this.state = {records: []};

        this.columns = [
            {
                title: 'Sale ID',
                dataIndex: '_id',
            },
            {
                title: 'Timestamp',
                dataIndex: 'timestamp',
                render: text => new Date(text).toLocaleString(),
                sorter: {
                    compare:
                        (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
                    multiple: 1,
                }
            },
            {
                title: 'Customer',
                key: 'name',
                render: (record) => `${record.member.firstName} ${record.member.lastName}`,
                sorter: {
                    compare: (a, b) => {
                        const nameA = a.member.firstName.toUpperCase(); // ignore upper and lowercase
                        const nameB = b.member.firstName.toUpperCase(); // ignore upper and lowercase
                        if (nameA < nameB) {
                            return -1;
                        }
                        if (nameA > nameB) {
                            return 1;
                        }

                        // names must be equal
                        return 0;
                    },
                    multiple: 2,
                }
            },
            {
                title: 'Total',
                key: 'total',
                render: (e) => `$${e.total.toFixed(2)}`,
            },
            {
                title: 'Action',
                key: 'action',
                render: this.renderActions,
            },
        ];

    }

    componentDidMount() {
        fetch(`${origin.replace("3000", "5000")}/api/v1/sales`)
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
        <OverlaySaleVisible {...this.props} record={record} forwardRef={this.tableRef} dataSource={this.state.records}
                            onUpdate={this.componentDidMount.bind(this)}/>
    )

    render() {
        return (
            <div>
                <NavLink to="./create">
                    <Button type="primary" icon={<UserAddOutlined/>}>
                        Create New Sale
                    </Button>
                </NavLink>
                <Table
                    columns={this.columns}
                    ref={this.tableRef}
                    dataSource={this.state.records}
                    title={() => 'Sale List'}
                    rowKey={"_id"}
                    size={"middle"}
                    expandable={{
                        expandedRowRender: (record) => (
                            <SaleProductTable {...this.props} record={record}/>
                        )
                    }}
                />
            </div>
        );
    }
}

export default {
    name: "SaleTable",
    component: function (props) {
        return new SaleTable(props)
    }
};


/*import React, {useEffect, useState} from "react";
import {NavLink} from "react-router-dom";
import {DownOutlined, UserAddOutlined} from '@ant-design/icons';
import {Dropdown, Menu, Space, Table, Popconfirm, Button} from 'antd';
import CollectionCreateForm from "./form";

const menu = (
    <Menu
        items={
            [
                {
                    key: '1',
                    label: 'Edit',
                },
                {
                    key: '2',
                    label: 'Delete',
                },
            ]
        }
    />
);

const columns = [
    {
        title: 'Sale ID',
        dataIndex: '_id',
    },
    {
        title: 'Timestamp',
        dataIndex: 'timestamp',
        render: text => new Date(text).toLocaleString(),
        sorter: {
            compare:
                (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
            multiple: 1,
        }
    },
    {
        title: 'Customer',
        key: 'name',
        render: (record) => `${record.member.firstName} ${record.member.lastName}`,
        sorter: {
            compare: (a, b) => {
                const nameA = a.member.firstName.toUpperCase(); // ignore upper and lowercase
                const nameB = b.member.firstName.toUpperCase(); // ignore upper and lowercase
                if (nameA < nameB) {
                    return -1;
                }
                if (nameA > nameB) {
                    return 1;
                }

                // names must be equal
                return 0;
            },
            multiple: 1,
        }
    },
    {
        title: 'Total',
        key: 'total',
        render: (e) => `$${e.total.toFixed(2)}`,
    },

];


const productColumns = [
    {
        title: 'Name',
        dataIndex: 'name',
    },
    {
        title: 'Quantity',
        dataIndex: 'qty',
    },
    {
        title: 'Unit Price',
        dataIndex: 'price',
        render: (e) => `$${e.toFixed(2)}`,
    },
    {
        title: 'Total',
        render: (e) => `$${(e.price * e.qty).toFixed(2)}`,
        key: 'product_price',
    },
    {
        title: 'Action',
        key: 'action',
        render: (text, record) => (
            <Space size="middle">
                <Popconfirm
                    title="Are you sure to refund this item?"
                    onConfirm={() => RefundItem(record)}
                    onCancel={() => CancelAction(record)}
                    okText="Yes"
                    cancelText="No"
                >
                    <a href="#">Refund</a>
                </Popconfirm>
                <Dropdown overlay={menu}>
                    <a>
                        More <DownOutlined/>
                    </a>
                </Dropdown>
            </Space>
        ),
    },
];

const RefundItem = (props) => console.log("refund", props)


const CancelAction = (props) => {
    console.log("cancel", props);
};

export default function RecordList() {
    const [records, setRecords] = useState([]);

    const origin = window.location.origin;
    //const port = window.location.port;

    const [open, setOpen] = useState(false);

    const onCreate = (values) => {
        console.log('Received values of form: ', values);
        setOpen(false);
    };

    // This method fetches the records from the database.
    useEffect(() => {
        async function getRecords() {
            const response = await fetch(`${origin.replace("3000", "5000")}/api/v1/sales`);

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
        await fetch(`${origin.replace("3000", "5000")}/api/v1/sales/${id}`, {
            method: "DELETE"
        });

        const newRecords = records.filter((el) => el._id !== id);
        setRecords(newRecords);
    }

    const expandedRowRender = (record) =>
        <Table
            columns={productColumns}
            dataSource={record.products}
            pagination={false}
            size={"small"}
            rowKey={"name"}
        />;

    // This following section will display the table with the records of individuals.
    return (
        <div>
            <h3>Sale Record List</h3>
            <NavLink to="./create">
                <Button type="primary" icon={<UserAddOutlined/>}>
                    Create New Sale
                </Button>
            </NavLink>
            <div>
                <Button
                    type="primary"
                    onClick={() => {
                        setOpen(true);
                    }}
                >
                    New Sale (Modal)
                </Button>
                <CollectionCreateForm
                    open={open}
                    onCreate={onCreate}
                    onCancel={() => {
                        setOpen(false);
                    }}
                />
            </div>

            <Table
                columns={columns}
                dataSource={records}
                title={() => 'Sale Record List'}
                rowKey={"_id"}
                size={"middle"}
                expandable={{
                    expandedRowRender,
                    //childrenColumnName: 'products',
                    // rowExpandable: record => record.products.length > 0,
                }}
            />
        </div>
    );
}
*/
