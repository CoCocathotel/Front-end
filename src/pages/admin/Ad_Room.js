import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css"; // Import AOS styles
import service from "../../api/apiService";
import Loading from "../../component/Loading";
import Error from "../../component/Error";
import { Modal, Input, Button, Form, Upload, message, Image } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import slugify from "slugify";
import axios from "axios";

export default function Ad_Room() {
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false); // For managing modal state
  const [form] = Form.useForm(); // Ant Design form instance
  const [imageBase64, setImageBase64] = useState("");
  const [fileList, setFileList] = useState([]);
  const [previewImage, setPreviewImage] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null); // To track if we're editing a room

  useEffect(() => {
    AOS.init({ duration: 1000 });
    service
      .api("/")
      .then((res) => {
        setData(res.room);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleAddRoom = () => {
    setEditingRoom(null); // Clear editing state
    setIsModalOpen(true); // Open modal when "เพิ่มห้อง" is clicked
  };

  const handleCancel = () => {
    setIsModalOpen(false); // Close modal on cancel
    setImageBase64("");
    setFileList([]);
    setPreviewImage("");
    form.resetFields(); // Reset form fields
  };

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  // Helper function for Base64 conversion
  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result); // This resolves the Base64 string
      reader.onerror = (error) => reject(error); // Handle error if conversion fails
    });

  // Function to handle file changes and preview the Base64 image
  const handleFileChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);

    // Convert the first image to Base64 if it exists
    if (newFileList.length > 0) {
      const file = newFileList[0].originFileObj || newFileList[0];
      getBase64(file).then((image) => {
        setImageBase64(image); // Set Base64 string without a timestamp
      });
    } else {
      setImageBase64(""); // Reset if no image is uploaded
    }
  };

  const onFinish = (values) => {
    const data = { ...values, image: imageBase64 };
    setConfirmLoading(true);
    if (editingRoom) {
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

    axios
      .post(
        "https://cococatbackend.vercel.app/v1/create_room", // Replace with your API endpoint
        payload, // Request body (form values and imageBase64)
        {
          headers: {
            "Content-Type": "application/json", // Specify that the payload is in JSON format
          },
        }
      )
      .then((response) => {
        message.success("Room added successfully"); // Display success message
        // setData([...data, response.data.room]); // Add the new room to the list
      })
      .catch((error) => {
        // Handle error correctly by displaying the message or response status
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          // If API sends an error message
          message.error(`Error: ${error.response.data.message}`);
        } else if (error.message) {
          // If Axios fails
          message.error(`Error: ${error.message}`);
        } else {
          message.error("An unknown error occurred");
        }
      })
      .finally(() => {
        setIsModalOpen(false); // Close modal
        setImageBase64(""); // Reset image
        setFileList([]); // Clear file list
        setPreviewImage(""); // Clear preview image
        setConfirmLoading(false);
        form.resetFields(); // Reset form fields
      });
  };

  const handleFormSubmitEdit = (values) => {
    const payload = {
      ...values,
      room_id: editingRoom._id, // Include the room ID for editing
      image: [imageBase64],
    };

    axios
      .post("https://cococatbackend.vercel.app/v1/edit_room", payload)
      .then((response) => {
        message.success("Room updated successfully");
        setData((prevData) =>
          prevData.map((room) =>
            room._id === response.data._id ? response.data : room
          )
        );
        setIsModalOpen(false);
      })
      .catch((error) => {
        message.error(
          "Failed to update room: " +
            (error.response?.data?.message || error.message)
        );
      })
      .finally(() => {
        setConfirmLoading(false);
        form.resetFields();
      });
  };

  const handleRoomNameChange = (e) => {
    const roomName = e.target.value;
    const roomTypeSlug = slugify(roomName, { lower: true }); // ใช้ slugify โดยตรง
    form.setFieldsValue({ type: roomTypeSlug });
  };

  const handleDeleteRoom = (roomId) => {
    axios
      .delete("https://cococatbackend.vercel.app/v1/delete_room", {
        data: { room_id: roomId },
      })
      .then((response) => {
        message.success("Room deleted successfully");
        setData((prevData) => prevData.filter((room) => room._id !== roomId));
      })
      .catch((error) => {
        message.error(
          "Failed to delete room: " +
            (error.response?.data?.message || error.message)
        );
      });
  };

  const handleEditRoom = (room) => {
    form.setFieldsValue(room); // ตั้งค่าข้อมูลห้องในฟอร์ม
    setImageBase64(room.image[0]); // Load existing image
    setEditingRoom(room); // Set editing state
    setIsModalOpen(true); // เปิด modal
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>อัพโหลดรูปภาพ</div>
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
              src={`https://hiykwrlgoinmxgqczucv.supabase.co/storage/v1/object/public/rooms/${room.type}/${room.image[0]}`}
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

        {/* Add Room button */}
        <div
          className="flex justify-center items-center border bottom-0 rounded-lg shadow-md p-4 bg-gray-100 cursor-pointer"
          data-aos="fade-up"
          onClick={handleAddRoom} // Open modal when clicked
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
        confirmLoading={confirmLoading} // Show loading in modal
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          {/* Image Preview */}
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
