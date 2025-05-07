import {
  Button,
  Card,
  Form,
  Input,
  message,
  notification,
  Typography,
  Space,
} from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./forgot-password.scss";
import { callForgotPassword } from "@/config/api";

const { Title, Text } = Typography;

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [isSubmit, setIsSubmit] = useState(false);
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [timer, setTimer] = useState(60);
  const [code, setCode] = useState("");

  useEffect(() => {
    let interval;
    if (showCodeInput && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setShowCodeInput(false);
      setTimer(60);
      message.error("Mã xác nhận đã hết hạn! Vui lòng thử lại.");
    }
    return () => clearInterval(interval);
  }, [showCodeInput, timer]);

  const onFinishEmail = async (values) => {
    const { email } = values;
    setIsSubmit(true);
    try {
      const res = await callForgotPassword(email);
      console.log("res: ", res);
      setIsSubmit(false);
      if(res.statusCode === 400){
        notification.error({
          message: "Có lỗi xảy ra",
          description: res.message || "Email không tồn tại hoặc không hợp lệ!",
          duration: 5,
        });
        return;
      }
      if (res) {
        message.success(res);
        setShowCodeInput(true);
      } else {
        notification.error({
          message: "Có lỗi xảy ra",
          description: res.message || "Email không tồn tại hoặc không hợp lệ!",
          duration: 5,
        });
      }
    } catch (error) {
      setIsSubmit(false);
      notification.error({
        message: "Lỗi hệ thống",
        description: "Vui lòng thử lại sau!",
        duration: 5,
      });
    }
  };

  const onFinishCode = async () => {
    try {
      // Replace with actual API call to verify code
      // For demo purposes, simulating successful verification
      setIsSubmit(true);
      setTimeout(() => {
        setIsSubmit(false);
        if (code.length === 6) {
          message.success("Xác nhận mã thành công!");
          navigate("/reset-password"); // Redirect to reset password page
        } else {
          notification.error({
            message: "Mã không hợp lệ",
            description: "Vui lòng nhập mã 6 chữ số!",
            duration: 5,
          });
        }
      }, 1000);
    } catch (error) {
      setIsSubmit(false);
      notification.error({
        message: "Lỗi hệ thống",
        description: "Vui lòng thử lại sau!",
        duration: 5,
      });
    }
  };

  return (
    <div className="forgot-password-page">
      <Card className="forgot-password-card" bordered={false}>
        <div className="forgot-password-header">
          <Title level={2} style={{ marginBottom: 0 }}>
            Quên Mật Khẩu
          </Title>
          <Text type="secondary">
            {showCodeInput
              ? `Nhập mã 6 chữ số được gửi đến email của bạn (${timer}s)`
              : "Nhập email của bạn để nhận liên kết khôi phục mật khẩu"}
          </Text>
        </div>
        {!showCodeInput ? (
          <Form
            name="forgot-password"
            onFinish={onFinishEmail}
            autoComplete="off"
            layout="vertical"
            className="forgot-password-form"
          >
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Email không được để trống!" },
                { type: "email", message: "Email không hợp lệ!" },
              ]}
            >
              <Input size="large" placeholder="Nhập email của bạn" />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={isSubmit}
                size="large"
                block
                className="submit-button"
              >
                Gửi Liên Kết Khôi Phục
              </Button>
            </Form.Item>

            <Text className="login-text">
              Quay lại <Link to="/login">Đăng Nhập</Link>
            </Text>
          </Form>
        ) : (
          <Form
            name="verify-code"
            onFinish={onFinishCode}
            autoComplete="off"
            layout="vertical"
            className="forgot-password-form"
          >
            <Form.Item
              label="Mã Xác Nhận"
              name="code"
              rules={[
                { required: true, message: "Mã xác nhận không được để trống!" },
                { len: 6, message: "Mã xác nhận phải có 6 chữ số!" },
              ]}
            >
              <Input
                size="large"
                placeholder="Nhập mã 6 chữ số"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </Form.Item>

            <Form.Item>
              <Space direction="vertical" style={{ width: "100%" }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={isSubmit}
                  size="large"
                  block
                  className="submit-button"
                >
                  Xác Nhận Mã
                </Button>
                <Button
                  size="large"
                  block
                  onClick={() => {
                    setShowCodeInput(false);
                    setTimer(60);
                  }}
                  className="resend-button"
                >
                  Gửi Lại Mã
                </Button>
              </Space>
            </Form.Item>

            <Text className="login-text">
              Quay lại <Link to="/login">Đăng Nhập</Link>
            </Text>
          </Form>
        )}
      </Card>
    </div>
  );
};

export default ForgotPasswordPage;
