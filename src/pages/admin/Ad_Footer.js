import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import LoadingSpinner from "../../component/Loading";
import { Modal, Form, Input, Button, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import api from "../../utils/api";
import { convertFilesToBase64, handleFileChange } from "../../utils/helpers";

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
                item : [],
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
                            {/* <h4>Home Section</h4> */}
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
                title={isEdit ? "Update Home" : "Add Home"}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="_id"
                        label="_id"
                        hidden={true}
                    >
                    </Form.Item>
                    <Form.Item
                        name="title"
                        label="Title"
                        rules={[{ required: true, message: "Please enter the title" }]}
                    >
                        <Input.TextArea placeholder="Title" />
                    </Form.Item>
                    <Form.Item
                        name="heroImage"
                        label="Hero Image"
                        rules={[{ required: true, message: "Please upload a hero image" }]}
                    >
                        <Upload
                            listType="picture"
                            defaultFileList={form.getFieldValue('heroImage')}
                            beforeUpload={() => false}
                            onChange={(info) => handleFileChange(info, 'heroImage', form)}
                        >
                            <Button icon={<UploadOutlined />}>Upload Hero Image(s)</Button>
                        </Upload>
                    </Form.Item>

                    <Form.Item
                        name="reviewImage"
                        label="Review Image"
                        rules={[{ required: true, message: "Please upload a review image" }]}
                    >
                        <Upload
                            listType="picture"
                            defaultFileList={form.getFieldValue('reviewImage')}
                            beforeUpload={() => false}
                            onChange={(info) => handleFileChange(info, 'reviewImage', form)}
                        >
                            <Button icon={<UploadOutlined />}>Upload Review Image(s)</Button>
                        </Upload>
                    </Form.Item>

                    <Form.Item
                        name="mapImage"
                        label="Map Image"
                        rules={[{ required: true, message: "Please upload a map image" }]}
                    >
                        <Upload
                            listType="picture"
                            defaultFileList={form.getFieldValue('mapImage')}
                            maxCount={1}
                            beforeUpload={() => false}
                            onChange={(info) => handleFileChange(info, 'mapImage', form)}
                        >
                            <Button icon={<UploadOutlined />}>Upload Map Image</Button>
                        </Upload>
                    </Form.Item>

                    <Form.Item
                        name="mapDetail"
                        label="Map Detail"
                        rules={[{ required: true, message: "Please enter the map detail" }]}
                    >
                        <Input.TextArea placeholder="Map Detail" />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}
