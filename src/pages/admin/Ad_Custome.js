import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import LoadingSpinner from "../../component/Loading";
import { Modal, Form, Input, Button, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import axios from "axios";

export default function Ad_Custom() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [open, setOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [form] = Form.useForm();

    dayjs.extend(customParseFormat);

    // Function to handle form submission
    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            const heroImageBase64 = values.heroImage.length > 0 ? await convertFilesToBase64(values.heroImage) : [];
            const reviewImageBase64 = values.reviewImage.length > 0 ? await convertFilesToBase64(values.reviewImage) : [];
            const mapImageBase64 = values.mapImage.length > 0 ? await convertFilesToBase64(values.mapImage) : [];

            const formData = {
                ...values,
                heroImage: heroImageBase64.length > 0 ? heroImageBase64 : undefined,
                reviewImage: reviewImageBase64.length > 0 ? reviewImageBase64 : undefined,
                mapImage: mapImageBase64.length > 0 ? mapImageBase64[0] : undefined
            };

            if (isEdit) {
                await handleUpdate(formData);
            } else {
                await handleCreate(formData);
            }
        } catch (errorInfo) {
            console.log("Failed to submit form:", errorInfo);
        }
    };

    // Function to handle API call for updating home data
    const handleUpdate = async (formData) => {
        try {
              let response = await axios.patch(
                productionCheck() + `/home/updateHome/${formData._id}`,
                formData,
                {
                    headers: { 
                        'Content-Type': 'application/json',
                    }
                }
            );
            if (response.status === 200) {
                fetchData();
                setOpen(false);
            }
        } catch (err) {
            console.log(err);
        }
    };

    // New function to handle API call for updating footer data
    const handleUpdateFooter = async (footerData) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                }
            };
            let response = await axios.post(
                productionCheck() + "/update-footer",
                footerData,
                config
            );
            if (response.status === 200) {
                message.success("Footer data updated successfully");
            }
        } catch (err) {
            console.log(err);
            message.error("Failed to update footer");
        }
    };

    // Function to convert uploaded files to Base64
    const convertFilesToBase64 = async (files) => {
        if (!files) return [];

        const fileReaders = files.map(file => {
            return new Promise((resolve, reject) => {
                if (file instanceof Blob) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        resolve(reader.result);
                    };
                    reader.onerror = reject;
                    reader.readAsDataURL(file);
                } else {
                    resolve(file.url);
                }
            });
        });
        return await Promise.all(fileReaders);
    };

    // Function to handle API call for form submission
    const handleCreate = async (formData) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                }
            };
            let response = await axios.post(
                productionCheck() + "/home/createHome",
                formData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            );
            console.log(formData);
            console.log(response);
            if (response.status === 200) {
                fetchData();
                setOpen(false);
            }
        } catch (err) {
            console.log(err);
        }
    };

    // Function to cancel the modal
    const handleCancel = () => {
        setOpen(false);
    };

    const fetchData = async () => {
        try {
            const response = await fetch(productionCheck() + "/home");

            if (response.status === 200) {
                const result = await response.json();
                setData(result.body || []);
                console.log(result.body);
            }
            setLoading(false);
        } catch (err) {
            console.log("An error occurred. Please try again.");
            setLoading(false);
        }
    };

    function productionCheck() {
        const isDevelopment =
            window.location.origin.includes("localhost") ||
            window.location.origin.includes("127.0.0.1");

        return isDevelopment
            ? "http://localhost:8700"
            : "https://cococatbackend.vercel.app";
    }

    const handleFileChange = async (info, fieldName) => {
        const files = info.fileList.map(file => {
            if (file.originFileObj) {
                return file.originFileObj;
            } else if (file.url) {
                return file;
            }
            return null;
        }).filter(file => file !== null);

        form.setFieldsValue({ [fieldName]: files });
    };

    // get footer
    const [footer, setFooter] = useState([]);
    const getFooter = async () => {
        try {
            const response = await fetch(productionCheck() + "/footer");
            
            if (response.status === 200) {
                const result = await response.json();
                setFooter(result.body || []);
                return result.body || [];
            }
        } catch (err) {
            console.log("An error occurred. Please try again.");
        }
    }
            

    const openModal = (item = null) => {
        setIsEdit(!!item);
        if (item) {
            form.setFieldsValue({
                ...item,
                heroImage: item.heroImage ? item.heroImage.map((url, index) => ({
                    uid: index,
                    name: `Hero Image ${index + 1}`,
                    status: 'done',
                    url: `${url}`
                })) : [],
                reviewImage: item.reviewImage ? item.reviewImage.map((url, index) => ({
                    uid: index,
                    name: `Review Image ${index + 1}`,
                    status: 'done',
                    url: `${url}`
                })) : [],
                mapImage: item.mapImage ? [{
                    uid: 1,
                    name: 'Map Image',
                    status: 'done',
                    url: `${item.mapImage}`
                }] : [],
            });
        } else {
            form.resetFields();
        }
        setOpen(true);
    };

    useEffect(() => {
        fetchData();
        getFooter();
    }, []);

    return (
        <>
            <div className="overflow-x-auto">
                <div className="p-4">
                    {loading ? (
                        <LoadingSpinner />
                    ) : (
                        <div>
                            <h4>Home Section</h4>
                            {data.length > 0 ? (
                                <>
                                    {data.map((item, index) => (
                                        <div key={index}>
                                            <div className="flex justify-between items-center border p-4 my-4 rounded shadow-sm ">
                                                <img src={`${item.mapImage}`} alt="map" className="w-1/4 h-1/4" />
                                                <p className="p-4">{item.mapDetail}</p>
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
                                <button
                                    onClick={() => openModal()}
                                    className="bg-blue-500 text-white px-4 py-2 rounded"
                                >
                                    Create New
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <Modal
                open={open}
                onOk={handleOk}
                onCancel={handleCancel}
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
                            onChange={(info) => handleFileChange(info, 'heroImage')}
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
                            onChange={(info) => handleFileChange(info, 'reviewImage')}
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
                            onChange={(info) => handleFileChange(info, 'mapImage')}
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
