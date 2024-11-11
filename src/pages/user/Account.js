import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { Form, Input, Button, message } from "antd";
import api from "../../utils/api";
// import { UserContext } from "../../context/UserContext"; // Adjust the import path

export default function Account() {
  const navigate = useNavigate();
  // const { user } = useContext(UserContext); // Access the user from context
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [currentUserId, setCurrentUserId] = useState(false);
  const fetchUserDetails = async () => {
    const savedUser = localStorage.getItem("user-provider");
    const value = savedUser ? JSON.parse(savedUser) : null;
    setCurrentUserId(value?._id)
    const userId = value?._id;
   // console.log(currentUserId)
    if (!userId) {
          message.error("User ID not found. Please log in.");
          return;
        }
    try {
      const response = await api.getUser(userId);
      const user = response.data;

      if (user) {
        form.setFieldsValue({
          first_name: user.first_name,
          last_name: user.last_name,
        });
      } else {
        message.error("User data not found");
      }
    } catch (error) {
      message.error("Failed to load user details");
    }
  };
  useEffect(() => {
    fetchUserDetails();
  }, [])
  const handleOk = async () => {
    console.log("handleOk",currentUserId)
    if (!currentUserId) {
      message.error("Invalid user ID. Cannot update details.");
      return;
    }

    try {
      setLoading(true);
      const values = form.getFieldsValue();
      await api.updateUser(currentUserId, values);
      message.success("User details updated successfully");
    } catch (error) {
      message.error("Failed to update user details");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-200 flex flex-col items-center h-screen p-10">
      <div className="bg-white w-full md:w-1/2 h-auto mt-5 p-6 rounded-lg shadow-lg space-y-4">
        <h1 className="font-semibold text-[#3B82F6] text-2xl">ข้อมูลส่วนตัว</h1>
        <hr />
        <Form form={form} layout="vertical">
          <Form.Item
            name="first_name"
            label="ชื่อ"
            rules={[{ required: true, message: "Please enter your first name" }]}
          >
            <Input placeholder="ชื่อ" />
          </Form.Item>
          <Form.Item
            name="last_name"
            label="นามสกุล"
            rules={[{ required: true, message: "Please enter your last name" }]}
          >
            <Input placeholder="นามสกุล" />
          </Form.Item>
          <div className="flex justify-center">
            <Button
              type="primary"
              onClick={handleOk}
              className="bg-[#3B82F6] text-white rounded-md hover:bg-[#424D57]"
              loading={loading}
            >
              บันทึก
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
