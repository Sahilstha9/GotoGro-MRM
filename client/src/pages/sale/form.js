import React, {useState} from "react";
import {MinusCircleOutlined, PlusOutlined} from '@ant-design/icons';
import {Button, Form, Input, Modal, Space, Select} from 'antd';
import SearchBox from "../../components/SearchBox";

const CollectionCreateForm = ({open, onCreate, onCancel}) => {
    const [form] = Form.useForm();

    const origin = window.location.origin;

    // This function will handle the submission.
    async function onCreate(values) {

        // When a post request is sent to the create url, we'll add a new record to the database.
        const newRecord = {...values};

        await fetch(`${origin.replace("3000", "5000")}/api/v1/sales`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newRecord),
        })
            .catch(error => {
                window.alert(error);
            });
    }

    // This following section will display the form that takes the input from the user.
    return (
        <Modal
            open={open}
            title="Create a new sale record"
            okText="Create"
            cancelText="Cancel"
            onCancel={onCancel}
            onOk={() => {
                form
                    .validateFields()
                    .then((values) => {
                        form.resetFields();
                        onCreate(values);
                    })
                    .catch((info) => {
                        console.log('Validate Failed:', info);
                    });
            }}
        >
            <Form
                name={"sales"}
                form={form}
            >
                <Form.Item
                    name={"member_id"}
                    label={'Member'}
                    rules={[
                        {
                            required: true,
                            message: 'Missing Member ID',
                        },
                    ]}
                >

                    <SearchBox
                        endpoint="/api/v1/members"
                        inputoptionvalue="_id"
                        inputoptionlabel="firstName"
                        //onChange={(e) => updateForm({member_id: e.target.value})}
                        style={{
                            width: '60%',
                        }}
                    />
                </Form.Item>
                <br/>
                <p><label>Product List</label></p>
                <Form.List
                    name="products"
                    label={'Product List A'}
                    rules={[
                        {
                            required: true,
                            message: 'Missing Products',
                        },
                    ]}
                >
                    {(fields, {add, remove}) => (
                        <>
                            {fields.map(({key, name, ...restField}) =>

                                (
                                    <Space
                                        key={key}
                                        style={{
                                            display: 'flex',
                                            marginBottom: 2,
                                        }}
                                        align="baseline"
                                    >

                                        <Form.Item
                                            {...restField}
                                            name={[name, 'id']}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Missing product id',
                                                },
                                            ]}
                                        >
                                            <SearchBox
                                                endpoint="/api/v1/products"
                                                inputoptionvalue="_id"
                                                inputoptionlabel="name"
                                                //onChange={(e) => updateForm({products: e.target.value})}
                                                style={{
                                                    width: 200,
                                                }}
                                                placeholder={"Product ID"}

                                            />
                                        </Form.Item>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'qty']}
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
                                            />
                                        </Form.Item>

                                        <MinusCircleOutlined onClick={() => remove(name)}/>

                                    </Space>
                                ))}
                            <Form.Item>
                                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined/>}>
                                    Add field
                                </Button>
                            </Form.Item>
                        </>
                    )}
                </Form.List>
            </Form>
        </Modal>
    );
}

export default CollectionCreateForm;