import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css"; // Import AOS styles
import Loading from "../../component/Loading";
import Error from "../../component/Error";
import { Modal, Input, Button, Form, Upload, message, Image } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import slugify from "slugify";
import api from "../../utils/api";

export default function Ad_Room() {
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [imageBase64, setImageBase64] = useState("");
  const [fileList, setFileList] = useState([]);
  const [previewImage, setPreviewImage] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);

  useEffect(() => {
    AOS.init({ duration: 1000 });
    fetchData();
  }, []);

  const fetchData = async () => {
    api.getRoom().then((res) => {
      setData(res.data.body);
    }).catch((err) => {
      setError(err.message);
    }).finally(() => {
      setLoading(false);
    });
  };

  const handleAddRoom = () => {
    setEditingRoom(null);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setImageBase64("");
    setFileList([]);
    setPreviewImage("");
    form.resetFields();
  };

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handleFileChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    if (newFileList.length > 0) {
      const file = newFileList[0].originFileObj || newFileList[0];
      getBase64(file).then((image) => {
        setImageBase64(image);
      });
    } else {
      setImageBase64("");
    }
  };

  const onFinish = (values) => {
    const data = { ...values, image: imageBase64 !== null && imageBase64 !== '' ? [imageBase64] : null };
    setConfirmLoading(true);
    if (editingRoom) {
      console.log('editingRoom11111', editingRoom);
      handleFormSubmitEdit(data);
    } else {
      handleFormSubmitCreate(data);
    }
  };

  const handleFormSubmitCreate = (values) => {
    const payload = {
      ...values,
      image: [imageBase64],
    };


    api.createRoom(payload)
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          message.success("Room added successfully");
          setData(res.data.body);
        }
      }).catch((err) => {
        setError(err.message);
      }).finally(() => {
        setIsModalOpen(false);
        setImageBase64("");
        setFileList([]);
        setPreviewImage("");
        setConfirmLoading(false);
        form.resetFields();
        setLoading(false);
      });
  };

  const handleFormSubmitEdit = (values) => {

    api.updateRoom(editingRoom._id, values)
      .then((res) => {
        message.success("Room updated successfully");
        fetchData();
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setIsModalOpen(false);
        setImageBase64("");
        setFileList([]);
        setPreviewImage("");
        setConfirmLoading(false);
        form.resetFields();
        setLoading(false);
      });
  };

  const handleRoomNameChange = (e) => {
    const roomName = e.target.value;
    const roomTypeSlug = slugify(roomName, { lower: true });
    form.setFieldsValue({ type: roomTypeSlug });
  };

  const handleDeleteRoom = (roomId) => {
    api.deleteRoom(roomId)
    .then((res) => {
      message.success("Room deleted successfully");
      fetchData();
    })
    .catch((err) => {
      setError(err.message);
    })
    .finally(() => {
      setIsModalOpen(false);
      setImageBase64("");
      setFileList([]);
      setPreviewImage("");
      setConfirmLoading(false);
      form.resetFields();
      setLoading(false);
    });
  };

  const handleEditRoom = (room) => {
    form.setFieldsValue(room);
    setImageBase64(room.image[0]);
    setFileList([
      { 
        uid: "-1",
        name: "image.png",
        status: "done",
        url: room.image[0],
      },
    ]);
    setEditingRoom(room);
    setIsModalOpen(true);
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>
        อัพโหลดรูปภาพ
        </div>
    </div>
  );

  if (loading) return <Loading />;
  if (error) return <Error />;

  return (
    <div className="container mx-auto p-6 ">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {data.map((room) => (
          <div
            key={room._id}
            className="border rounded-lg shadow-md overflow-hidden h-auto"
            data-aos="fade-up"
          >
            <img
              src={room.image[0]}
              alt={room.room_name}
              className="w-full h-44 object-cover"
            />

            <div className="">
              <div className="p-4 h-24">
                <h2 className="text-lg font-semibold mb-2">{room.room_name}</h2>
                <p className="text-sm text-gray-600 truncate">{room.description}</p>
              </div>

              <div className="flex justify-between h-10 w-full border ">
                <button
                  onClick={() => handleEditRoom(room)}
                  className="hover:bg-yellow-400 hover:text-white px-3 py-1 w-full border-r-2"
                >
                  แก้ไขห้อง
                </button>
                <button
                  onClick={() => handleDeleteRoom(room._id)}
                  className="hover:bg-red-400 hover:text-white px-3 py-1 w-full"
                >
                  ลบห้อง
                </button>
              </div>
            </div>
          </div>
        ))}

        <div
          className="flex justify-center items-center border bottom-0 rounded-lg shadow-md p-4 bg-gray-100 cursor-pointer"
          data-aos="fade-up"
          onClick={handleAddRoom}
        >
          <div className="text-center">
            <div className="text-gray-400 text-6xl">+</div>
            <p className="text-gray-600">เพิ่มห้อง</p>
          </div>
        </div>
      </div>

      <Modal
        title={editingRoom ? "แก้ไขห้อง" : "เพิ่มห้องใหม่"}
        visible={isModalOpen}
        onCancel={handleCancel}
        confirmLoading={confirmLoading}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          {previewImage && (
            <Image
              wrapperStyle={{
                display: "none",
              }}
              preview={{
                visible: previewOpen,
                onVisibleChange: (visible) => setPreviewOpen(visible),
                afterOpenChange: (visible) => !visible && setPreviewImage(""),
              }}
              src={previewImage}
            />
          )}

          <Form.Item
            label="ชื่อห้อง"
            name="room_name"
            rules={[{ required: true, message: "กรุณากรอกชื่อห้อง" }]}
          >
            <Input placeholder="ชื่อห้อง" onChange={handleRoomNameChange} />
          </Form.Item>

          <Form.Item
            label="ประเภทของห้องพัก"
            name="type"
            rules={[{ required: true, message: "กรุณากรอกประเภทของห้องพัก" }]}
          >
            <Input placeholder="ประเภทของห้องพัก" />
          </Form.Item>

          <div className="flex space-x-4">
            <Form.Item
              label="ราคาห้องพัก"
              name="price"
              rules={[{ required: true, message: "กรุณากรอกราคาห้องพัก" }]}
            >
              <Input placeholder="ราคาห้องพัก" type="number" />
            </Form.Item>

            <Form.Item
              label="จำนวนแมว"
              name="number_of_cats"
              rules={[{ required: true, message: "กรุณากรอกจำนวนแมว" }]}
            >
              <Input placeholder="จำนวนแมว" type="number" />
            </Form.Item>
          </div>

          <div className="flex space-x-4">
            <Form.Item
              label="จำนวนห้อง"
              name="number_of_rooms"
              rules={[{ required: true, message: "กรุณากรอกจำนวนห้อง" }]}
            >
              <Input placeholder="จำนวนห้อง" type="number" />
            </Form.Item>

            <Form.Item
              label="จำนวนกล้อง"
              name="cameras"
              rules={[{ required: true, message: "กรุณากรอกจำนวนกล้อง" }]}
            >
              <Input placeholder="จำนวนกล้อง" type="number" />
            </Form.Item>
          </div>

          <Form.Item label="คำอธิบาย" name="description">
            <Input.TextArea placeholder="คำอธิบาย" rows={3} />
          </Form.Item>

          <Form.Item
            label="อัพโหลดรูปภาพ"
            name="image"
            rules={[{ required: true, message: "กรุณาอัพโหลดรูปภาพ" }]}
          >
            <Upload
              listType="picture-card"
              fileList={fileList}
              onPreview={handlePreview}
              onChange={handleFileChange}
              beforeUpload={() => false}
              accept="image/*"
              maxCount={1}
            >
              {fileList.length === 0 && uploadButton}
            </Upload>
          </Form.Item>

          <div className="flex justify-end">
            <Button onClick={handleCancel} className="mr-2">
              ยกเลิก
            </Button>
            <Button type="primary" htmlType="submit" loading={confirmLoading}>
              {editingRoom ? "แก้ไขห้อง" : "เพิ่มห้อง"}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
