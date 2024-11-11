import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import api from "../../utils/api";

export default function ResetPass() {
  const [currentUserId, setCurrentUserId] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  // Function to check password strength
  const isPasswordStrong = (password) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);
  };

  const handlePasswordReset = async () => {
    const savedUser = localStorage.getItem("user-provider");
    const value = savedUser ? JSON.parse(savedUser) : null;
    setCurrentUserId(value?._id);
    const CurrentUserId = value?._id;

    if (!CurrentUserId) {
      message.error("User ID not found. Please log in.");
      return;
    }

    try {
      const values = await form.validateFields();
      
      // Validate if new password and confirm password match
      if (values.new_password !== values.confirm_new_password) {
        message.error("New password and confirm password do not match.");
        return;
      }

      // Validate password strength
      if (!isPasswordStrong(values.new_password)) {
        message.error("Password must be at least 8 characters long, contain uppercase, lowercase, number, and special character.");
        return;
      }

      setLoading(true);

      // Call the API to update the password
      const response = await api.updatePassword({
        userId: CurrentUserId,
        old_password: values.old_password,
        new_password: values.new_password,
      });

      // Handle the response from the backend
      if (response.data.success) {
        message.success("Password updated successfully.");
        form.resetFields();
      } else {
        message.error(response.data.message || "Failed to update password. Please try again.");
      }
    } catch (error) {
      console.error("Error updating password:", error);
      message.error("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

    return (
      <div className="flex flex-col items-center h-screen bg-gray-200 pt-20">
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-2xl font-semibold text-center mb-4 text-[#3B82F6]">เปลี่ยนรหัสผ่าน</h2>
          <Form form={form} layout="vertical">
            <Form.Item
              name="old_password"
              label="รหัสผ่านเดิม"
              rules={[{ required: true, message: "Please enter your old password" }]}
            >
              <Input.Password placeholder="รหัสผ่านเดิม" />
            </Form.Item>
            <Form.Item
              name="new_password"
              label="รหัสผ่านใหม่"
              rules={[
                { required: true, message: "Please enter your new password" },
                {
                  validator: (_, value) =>
                    value && isPasswordStrong(value)
                      ? Promise.resolve()
                      : Promise.reject(
                          "Password must be at least 8 characters long, contain uppercase, lowercase, number, and special character."
                        ),
                },
              ]}
            >
              <Input.Password placeholder="รหัสผ่านใหม่" />
            </Form.Item>
            <Form.Item
              name="confirm_new_password"
              label="ยืนยันรหัสผ่านใหม่"
              rules={[{ required: true, message: "Please confirm your new password" }]}
            >
              <Input.Password placeholder="ยืนยันรหัสผ่านใหม่" />
            </Form.Item>
            <div className="flex justify-center">
              <Button
                type="primary"
                onClick={handlePasswordReset}
                className="bg-[#3B82F6] text-white rounded-md hover:bg-[#424D57]"
                loading={loading}
              >
                ยืนยันรหัสผ่าน
              </Button>
            </div>
          </Form>
        </div>
      </div>
    );
    
  
}
