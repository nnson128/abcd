import { Button, Form, Input, Select, Row, Col, notification } from "antd";
import { useEffect, useState } from "react";
import { callFetchAccount, callUpdateUser } from "config/api";
import "./user-update-info.scss";
import { escapeRegExp } from "lodash";

const { Option } = Select;

interface User {
  id: string;
  email: string;
  name: string;
  role: {
    id: string;
    name: string;
    permissions: {
      id: string;
      name: string;
      apiPath: string;
      method: string;
      module: string;
    }[];
  };
  gender?: string;
  age?: number;
  address?: string;
}

const UserUpdateInfo = () => {
  const [user, setUser] = useState<User | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmit, setIsSubmit] = useState(false);
  const [form] = Form.useForm();

  const callFetchAccountFunc = async () => {
    setIsLoading(true);
    try {
      const res = await callFetchAccount();
      if (res?.data?.user) {
        setUser(res.data.user);
      }
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    callFetchAccountFunc();
  }, []);

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        name: user.name || "",
        email: user.email || "",
        gender: user.gender || undefined,
        age: user.age || "",
        address: user.address || "",
      });
    }
  }, [user, form]);

  const onFinish = async (values: any) => {
    setIsSubmit(true);
    try {
      const { name, email, gender, age, address } = values;
      const res = await callUpdateUser({
        id: user?.id, 
        name,
        email,
        gender,
        age: +age,
        address,
      });
      if (res?.data) {
        setUser(res.data);
        notification.success({
          message: res.message || "Thành công",
          description: "Cập nhật thành công.",
        });
      }
    } catch (error) {
      notification.error({
        message: error?.response?.data?.message || "Lỗi",
        description: "Đã xảy ra lỗi khi cập nhật. Vui lòng thử lại.",
      });
    } finally {
      setIsSubmit(false);
    }
  };

  if (isLoading) {
    return <div>Đang tải...</div>;
  }

  return (
    <div className="user-update-page">
      <Form
        form={form}
        name="user-update"
        onFinish={onFinish}
        autoComplete="off"
        layout="vertical"
        className="user-update-form"
      >
        <Row gutter={8}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Họ tên"
              name="name"
              rules={[{ required: true, message: "Họ tên không được để trống!" }]}
            >
              <Input size="large" placeholder="Nhập họ tên" disabled={isSubmit} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Email không được để trống!" },
                { type: "email", message: "Email không hợp lệ!" },
              ]}
            >
              <Input size="large" placeholder="Nhập email" disabled={isSubmit} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Giới tính"
              name="gender"
              rules={[{ required: true, message: "Giới tính không được để trống!" }]}
            >
              <Select size="large" placeholder="Chọn giới tính" allowClear disabled={isSubmit}>
                <Option value="MALE">Nam</Option>
                <Option value="FEMALE">Nữ</Option>
                <Option value="OTHER">Khác</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label="Tuổi"
              name="age"
              rules={[{ required: true, message: "Tuổi không được để trống!" }]}
            >
              <Input size="large" type="number" placeholder="Nhập tuổi" disabled={isSubmit} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col xs={24}>
            <Form.Item
              label="Địa chỉ"
              name="address"
              rules={[{ required: true, message: "Địa chỉ không được để trống!" }]}
            >
              <Input size="large" placeholder="Nhập địa chỉ" disabled={isSubmit} />
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
            className="update-button"
          >
            Cập Nhật
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default UserUpdateInfo;