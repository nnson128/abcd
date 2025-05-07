import { Button, Card, Divider, Form, Input, Select, message, notification, Typography, Row, Col } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { callRegister } from 'config/api';
import { useState } from 'react';
import { IUser } from '@/types/backend';
import './register.scss'; // Custom SCSS for styling

const { Title, Text } = Typography;
const { Option } = Select;

const RegisterPage = () => {
  const navigate = useNavigate();
  const [isSubmit, setIsSubmit] = useState(false);

  const onFinish = async (values: IUser) => {
    const { name, email, password, age, gender, address } = values;
    setIsSubmit(true);
    try {
      const res = await callRegister(name, email, password as string, +age, gender, address);
      setIsSubmit(false);
      if (res?.data?.id) {
        message.success('Đăng ký tài khoản thành công!');
        navigate('/login');
      } else {
        notification.error({
          message: 'Có lỗi xảy ra',
          description:
            res.message && Array.isArray(res.message) ? res.message[0] : res.message,
          duration: 5,
        });
      }
    } catch (error) {
      setIsSubmit(false);
      notification.error({
        message: 'Lỗi hệ thống',
        description: 'Vui lòng thử lại sau!',
        duration: 5,
      });
    }
  };

  return (
    <div className="register-page">
      <Card className="register-card" bordered={false}>
        <div className="register-header">
          <Title level={2} style={{ marginBottom: 0 }}>
            Đăng Ký Tài Khoản
          </Title>
          <Text type="secondary">Tạo tài khoản mới để bắt đầu!</Text>
        </div>
        <Divider />
        <Form<IUser>
          name="register"
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
          className="register-form"
        >
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Họ tên"
                name="name"
                rules={[{ required: true, message: 'Họ tên không được để trống!' }]}
              >
                <Input size="large" placeholder="Nhập họ tên" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: 'Email không được để trống!' },
                  { type: 'email', message: 'Email không hợp lệ!' },
                ]}
              >
                <Input size="large" placeholder="Nhập email" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Mật khẩu"
                name="password"
                rules={[{ required: true, message: 'Mật khẩu không được để trống!' }]}
              >
                <Input.Password size="large" placeholder="Nhập mật khẩu" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Tuổi"
                name="age"
                rules={[{ required: true, message: 'Tuổi không được để trống!' }]}
              >
                <Input size="large" type="number" placeholder="Nhập tuổi" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Giới tính"
                name="gender"
                rules={[{ required: true, message: 'Giới tính không được để trống!' }]}
              >
                <Select size="large" placeholder="Chọn giới tính" allowClear>
                  <Option value="MALE">Nam</Option>
                  <Option value="FEMALE">Nữ</Option>
                  <Option value="OTHER">Khác</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Địa chỉ"
                name="address"
                rules={[{ required: true, message: 'Địa chỉ không được để trống!' }]}
              >
                <Input size="large" placeholder="Nhập địa chỉ" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={isSubmit}
              size="large"
              block
              className="register-button"
            >
              Đăng ký
            </Button>
          </Form.Item>
          <Divider>Hoặc</Divider>
          <Text className="login-text">
            Đã có tài khoản? <Link to="/login">Đăng Nhập</Link>
          </Text>
        </Form>
      </Card>
    </div>
  );
};

export default RegisterPage;