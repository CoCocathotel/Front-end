import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import LoadingSpinner from "../../component/Loading";
import { Modal, Form, Input, Button, Upload, message } from "antd";
import api from "../../utils/api";

export default function Ad_Footer() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);          
    const [data, setData] = useState([]);
    const [open, setOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [form] = Form.useForm();

    const handleOk = async () => {
        try {
            const formData = await form.validateFields();
            console.log(formData);
            if (isEdit) {
                await handleUpdate(formData);
            } else {
                await handleCreate(formData);
            }
        } catch (errorInfo) {
            console.log("Failed to submit form:", errorInfo);
        }
    };

    const handleUpdate = async (formData) => {
        api.updateFooter(formData._id, formData)
            .then(res => {
                console.log('formData._id', formData._id);
                fetchData();
            })
            .catch(err => {
                console.log(err);
            })
            .finally(() => {
                setOpen(false);
            });
    };

    const handleCreate = async (formData) => {
        api.createFooter(formData)
            .then(res => {
                console.log(res);
                fetchData();
            })
            .catch(err => {
                console.log(err);
            })
            .finally(() => {
                setOpen(false);
            });
    };

    const fetchData = async () => {
        api.getFooter()
            .then(res => {
                console.log(1231231, res);
                setData(res?.data?.body || []);
            })
            .catch(err => {
                console.log(err);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const openModal = (item = null) => {
        setIsEdit(!!item);
        if (item) {
            form.setFieldsValue({
                _id: item._id,
                headFooter: item.headFooter,
                addressFooter: item.addressFooter,
                phoneFooter: item.phoneFooter,
                lineFooter: item.lineFooter,
                tiktokFooter: item.tiktokFooter,
            });
        } else {
            form.resetFields();
        }
        setOpen(true);
    };
    useEffect(() => {
        fetchData();
    }, []);

    return (
        <>
            <div className="overflow-x-auto">
                <div className="p-4">
                    {loading ? (
                        <LoadingSpinner />
                    ) : (
                        <div>
                            {data.length > 0 ? (
                                <>
                                    {data.map((item, index) => (
                                        <div key={index}>
                                            <div className="flex justify-between items-center border p-4 my-4 rounded shadow-sm ">
                                                <ul className="flex space-x-4">
                                                    <li>1</li>
                                                    <li>Footer</li>
                                                </ul>
                                                <div>
                                                    <button
                                                        onClick={() => openModal(item)}
                                                        className="bg-blue-500 text-white px-4 py-2 rounded"
                                                    >
                                                        Edit
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </>
                            ) : (
                                <div>
                                    <div className="flex justify-between items-center border p-4 my-4 rounded shadow-sm ">
                                         <ul className="flex space-x-4">
                                                    <li>1</li>
                                                    <li className="text-red-400">You can create Footer Section</li>
                                                </ul>
                                        <div>
                                            <button
                                                onClick={() => openModal()}
                                                className="bg-blue-500 text-white px-4 py-2 rounded"
                                            >
                                                Create New
                                            </button>
                                        </div>
                                    </div>
                                </div>

                            )}
                        </div>
                    )}
                </div>
            </div>
            <Modal
                open={open}
                onOk={handleOk}
                onCancel={(_) => setOpen(false)}
                width="50vw"
                centered={true}
                title={isEdit ? "Update Footer" : "Add Footer"}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="_id"
                        label="_id"
                        hidden={true}
                    >
                    </Form.Item>
                    <Form.Item
                        name="headFooter"
                        label="HeadFooter"
                        rules={[{ required: true, message: "Please enter the headFooter" }]}
                    >
                    <Input.TextArea placeholder="headFooter" />
                    </Form.Item>
                    <Form.Item
                        name="addressFooter"
                        label="Address Footer"
                        rules={[{ required: true, message: "Please enter the address footer" }]}
                    >
                        <Input.TextArea placeholder="Address Footer" />
                    </Form.Item>
                    <Form.Item
                        name="phoneFooter"
                        label="Phone Footer"
                        rules={[{ required: true, message: "Please enter the phone footer" }]}
                    >
                        <Input placeholder="Phone Footer" />
                    </Form.Item>
                    <Form.Item
                        name="lineFooter"
                        label="Line Footer"
                        rules={[{ required: true, message: "Please enter the line footer" }]}
                    >
                        <Input placeholder="Line Footer" />
                    </Form.Item>
                    <Form.Item
                        name="tiktokFooter"
                        label="Tiktok Footer"
                        rules={[{ required: true, message: "Please enter the tiktok footer" }]}
                    >
                        <Input placeholder="Tiktok Footer" />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}
