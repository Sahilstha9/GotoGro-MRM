import React from "react";
import {NavLink} from "react-router-dom";
import {DownOutlined, EditOutlined, DeleteOutlined, UserAddOutlined, FormOutlined} from '@ant-design/icons';
import {Dropdown, Menu, Space, Table, Popconfirm, message, Modal, Button} from 'antd';
import ProductForm from "./create";
import StockForm from "./addStock";

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
        fetch(`${origin.replace("3000", "5000")}/api/v1/products/${this.props.record._id}`, {
            method: "PUT",
            body: JSON.stringify(values),
            headers: {
                'Content-Type': 'application/json'
            },
        }).then(() => {
            this.setState({open: !this.state.open});
            message.success("Product has been edited successfully");
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
                title="Edit Product"
                okText="Update"
                cancelText="Cancel"
                onCancel={() => {
                    this.form = this.formRef.current.formRef.current;
                    this.form.resetFields();
                    this.setState({open: !this.state.open});
                }}
                onOk={this.validateEditForm}
            >
                <ProductForm.component ref={this.formRef} {...this.props} modal={true}/>
            </Modal>
        );
    }
}

class StockModal extends React.Component {
    formRef = React.createRef();

    constructor(props) {
        super(props);
        this.state = {
            open: props.open
        }
    }

    onFormSubmit = (values) => {
        console.log(values)
        // This will send a put request to update the data in the database.
        fetch(`${origin.replace("3000", "5000")}/api/v1/products/stocks`, {
            method: "POST",
            body: JSON.stringify(values),
            headers: {
                'Content-Type': 'application/json'
            },
        }).then(() => {
            this.setState({open: !this.state.open});
            message.success("Stock has been added successfully"); // Implemented according to sprint 1 feedback
            this.props.onUpdate();
        })
    };

    validateStockForm = () => {
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
                title="Add Stock"
                okText="Submit"
                cancelText="Cancel"
                onCancel={() => {
                    this.form = this.formRef.current.formRef.current;
                    this.form.resetFields();
                    this.setState({open: !this.state.open});
                }}
                onOk={this.validateStockForm}
            >
                <StockForm.component ref={this.formRef} {...this.props} modal={true}/>
            </Modal>
        );
    }
}

class OverlayProductStockVisible extends React.Component {
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

class OverlayProductVisible extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            visible: false,
            isModalOpen: false,
        };
        this.myProductRef = React.createRef();
        this.myStockRef = React.createRef();
        // Implemented according to sprint 1 feedback
        this.items = [
            {
                key: '1',
                label: 'Add Stock',
                icon: <FormOutlined/>
            },
            {
                key: '2',
                label: 'Edit',
                icon: <EditOutlined/>
            },
            {
                key: '3',
                label: <Popconfirm
                    title="Are you sure to delete this product?"
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
        const node = this.myProductRef.current;
        node.showModal();
    }

    openStockForm = () => {
        const node = this.myStockRef.current;
        node.showModal();
    }


    handleMenuClick = (e) => {
        if (e.key === "1") {
            this.setState({visible: false});
            this.openStockForm();
        } else if (e.key === "2") {
            this.setState({visible: false});
            this.openEditForm();
        }
    };

    handleVisibleChange = (flag) => {
        this.setState({visible: flag});
    };

    deleteRecord() {
        fetch(`${origin.replace("3000", "5000")}/api/v1/products/${this.props.record._id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then((result) => {
            result.json().then(() => {
                this.toggleMenu();
                message.success("Product has been deleted"); // Implemented according to sprint 1 feedback
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
                <StockModal ref={this.myStockRef} {...this.props} />
                <EditModal ref={this.myProductRef} {...this.props} />
            </Space>
        );
    }
}

class ProductStockTable extends React.Component {
    expandedTableRef = React.createRef();

    constructor(props) {
        super(props);
        this.state = {records: this.props.record.stocks};
        console.log(this.props.record.stocks)
        this.columns = [
            {
                title: 'Quantity',
                dataIndex: 'quantity',
            },
            {
                title: 'Expiry Date',
                dataIndex: 'expiryDate',
            }
        ];
    }

    componentDidMount() {
        this.setState({records: this.props.record.stocks});
    }

    onUpdate = (data) => {
        this.setState({data})
    }

    renderActions = (text, record) => (
        <OverlayProductStockVisible {...this.props} record={record} dataSource={this.state.records.stocks}
                                    forwardRef={this.expandedTableRef} onUpdate={this.componentDidMount.bind(this)}/>
    )

    render() {
        return (
            <Table
                columns={this.columns}
                ref={this.expandedTableRef}
                dataSource={this.props.record.stocks}
                rowKey={"_id"}
                size={"small"}
                pagination={false}
            />
        );
    }
}

class ProductTable extends React.Component {
    tableRef = React.createRef();

    constructor(props) {
        super(props);
        this.state = {records: []};

        this.columns = [
            {
                title: 'Product ID',
                dataIndex: '_id',
            },
            {
                title: 'Name',
                dataIndex: 'name',
                sorter: {
                    compare: (a, b) => {
                        const nameA = a.name.toUpperCase(); // ignore upper and lowercase
                        const nameB = b.name.toUpperCase(); // ignore upper and lowercase
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
                title: 'Category',
                dataIndex: 'category',
            },
            {
                title: 'Quantity',
                dataIndex: 'quantity',
            },
            {
                title: 'Price',
                key: 'price',
                render: (e) => `$${e.price.toFixed(2)}`,
            },
            {
                title: 'Shelf Life',
                dataIndex: 'life',
            },
            {
                title: 'Action',
                key: 'action',
                render: this.renderActions,
            },
        ];

    }

    componentDidMount() {
        fetch(`${origin.replace("3000", "5000")}/api/v1/products`)
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
        <OverlayProductVisible {...this.props} record={record} forwardRef={this.tableRef}
                               dataSource={this.state.records}
                               onUpdate={this.componentDidMount.bind(this)}/>
    )

    render() {
        return (
            <div>
                <NavLink to="./create">
                    <Button type="primary" icon={<UserAddOutlined/>}>
                        Create New Product
                    </Button>
                </NavLink>
                <Table
                    columns={this.columns}
                    ref={this.tableRef}
                    dataSource={this.state.records}
                    title={() => 'Product List'}
                    rowKey={"_id"}
                    size={"middle"}
                    expandable={{
                        expandedRowRender: (record) => (
                            <ProductStockTable {...this.props} record={record}/>
                        ),
                        rowExpandable: record => record.stocks.length > 0,
                    }}
                />
            </div>
        );
    }
}

export default {
    name: "ProductTable",
    component: function (props) {
        return new ProductTable(props)
    }
};

/*import React, {useEffect, useState} from "react";
import {Link, NavLink} from "react-router-dom";
import {UserAddOutlined} from "@ant-design/icons";
import {Button} from "antd";

const Record = (props) => (
    <tr>
        <td>{props.record._id}</td>
        <td>{props.record.name}</td>
        <td>{props.record.category}</td>
        <td>{props.record.quantity}</td>
        <td>{props.record.price}</td>
        <td>{props.record.life}</td>
        <td>
            <Link className="btn btn-link" to={`./edit/${props.record._id}`}>Edit</Link>|
            <Link className="btn btn-link" to={`./stock/add/${props.record._id}`}>Add Stock</Link> |
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
            const response = await fetch(`${origin.replace("3000", "5000")}/api/v1/products`);

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
        await fetch(`${origin.replace("3000", "5000")}/api/v1/products/${id}`, {
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

    // This following section will display the table with the records of individuals.
    return (
        <div>
            <h3>Record List</h3>
            <NavLink to="./create">
                <Button type="primary" icon={<UserAddOutlined/>}>
                    Create New Product
                </Button>
            </NavLink>
            <table className="table table-striped" style={{marginTop: 20}}>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Shelf Life</th>
                </tr>
                </thead>
                <tbody>{recordList()}</tbody>
            </table>
        </div>
    );
}
*/
