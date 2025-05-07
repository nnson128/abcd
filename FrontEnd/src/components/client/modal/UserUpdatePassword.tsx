import { Button, Form, Input, message, notification } from 'antd';
import { useState } from 'react';
import { callUpdatePassword } from '@/config/api'; // Assume this exists

const UserUpdatePassword = () => {
  const [isSubmit, setIsSubmit] = useState(false);
  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
    setIsSubmit(true);
    try {
      const { currentPassword, newPassword, confirmPassword } = values;
      if (newPassword !== confirmPassword) {
        notification.error({ message: 'Lỗi', description: 'Mật khẩu mới và xác nhận không khớp!' });
        return;
      }
      const res = await callUpdatePassword({ currentPassword, newPassword });
      console.log('res', res);
      setIsSubmit(false);
      if (res?.data) {
        message.success('Đổi mật khẩu thành công!');
        form.resetFields();
      } 
      else if(res?.statusCode === 200) {
        message.success(res.message || 'Đổi mật khẩu thành công!');
        form.resetFields();
      }
      else {
        notification.error({ message: 'Có lỗi xảy ra', description: res.message || 'Vui lòng kiểm tra lại mật khẩu hiện tại.' });
      }
    } catch (error) {
      setIsSubmit(false);
      notification.error({ message: 'Lỗi hệ thống', description: 'Vui lòng thử lại sau!' });
    }
  };

  return (
    <div className="user-update-password-page">
      <Form
        form={form}
        name="user-update-password"
        onFinish={onFinish}
        autoComplete="off"
        layout="vertical"
        className="user-update-password-form"
      >
        <Form.Item
          label="Mật khẩu hiện tại"
          name="currentPassword"
          rules={[{ required: true, message: 'Vui lòng nhập mật khẩu hiện tại!' }]}
        >
          <Input.Password size="large" placeholder="Nhập mật khẩu hiện tại" disabled={isSubmit} />
        </Form.Item>
        <Form.Item
          label="Mật khẩu mới"
          name="newPassword"
          rules={[
            { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
            { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' },
          ]}
        >
          <Input.Password size="large" placeholder="Nhập mật khẩu mới" disabled={isSubmit} />
        </Form.Item>
        <Form.Item
          label="Xác nhận mật khẩu"
          name="confirmPassword"
          rules={[
            { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Mật khẩu không khớp!'));
              },
            }),
          ]}
        >
          <Input.Password size="large" placeholder="Xác nhận mật khẩu mới" disabled={isSubmit} />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={isSubmit}
            size="large"
            block
            className="update-button"
          >
            Đổi Mật Khẩu
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default UserUpdatePassword;