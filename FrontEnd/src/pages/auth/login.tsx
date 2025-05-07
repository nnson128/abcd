import {
  Button,
  Card,
  Divider,
  Form,
  Input,
  message,
  notification,
  Typography,
} from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { callLogin, callGoogleLogin } from "@/config/api";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUserLoginInfo } from "@/redux/slice/accountSlide";
import { useAppSelector } from "@/redux/hooks";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import "./login.scss";

const { Title, Text } = Typography;

const LoginPage = () => {
  const navigate = useNavigate();
  const [isSubmit, setIsSubmit] = useState(false);
  const dispatch = useDispatch();
  const isAuthenticated = useAppSelector(
    (state) => state.account.isAuthenticated
  );

  let location = useLocation();
  let params = new URLSearchParams(location.search);
  const callback = params?.get("callback");

  useEffect(() => {
    if (isAuthenticated) {
      window.location.href = "/";
    }
  }, [isAuthenticated]);

  const onFinish = async (values) => {
    const { username, password } = values;
    setIsSubmit(true);
    try {
      const res = await callLogin(username, password);
      setIsSubmit(false);

      if (res?.data) {
        localStorage.setItem("access_token", res.data.access_token);
        dispatch(setUserLoginInfo(res.data.user));
        message.success("Đăng nhập tài khoản thành công!");
        window.location.href = callback || "/";
      } else {
        notification.error({
          message: "Có lỗi xảy ra",
          description:
            res.message && Array.isArray(res.message)
              ? res.message[0]
              : res.message,
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

  const handleGoogleLoginSuccess = async (credentialResponse: any) => {
    const idToken = credentialResponse.credential;
    if (!idToken) return;

    setIsSubmit(true);
    try {
      const res = await callGoogleLogin(idToken);
      setIsSubmit(false);

      if (res?.data) {
        localStorage.setItem("access_token", res.data.accessToken);
        dispatch(setUserLoginInfo(res.data.user));
        message.success("Đăng nhập bằng Google thành công!");
        window.location.href = callback || "/";
      } else {
        notification.error({
          message: "Đăng nhập thất bại",
          description: "Không nhận được phản hồi hợp lệ từ server",
          duration: 5,
        });
      }
    } catch (err) {
      setIsSubmit(false);
      notification.error({
        message: "Đăng nhập Google thất bại",
        description: "Vui lòng thử lại sau",
        duration: 5,
      });
    }
  };

  return (
    <div className="login-page">
      <Card className="login-card" bordered={false}>
        <div className="login-header">
          <Title level={2} style={{ marginBottom: 0 }}>
            Log in to your account
          </Title>
          <Text type="secondary">Welcome to Jobhunter application!</Text>
        </div>
        <Divider />
        <Form
          name="login"
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
          className="login-form"
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[
              { required: true, message: "username không được để trống!" },
            ]}
          >
            <Input size="large" placeholder="Nhập username của bạn" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: "Mật khẩu không được để trống!" },
            ]}
          >
            <Input.Password size="large" placeholder="Nhập mật khẩu" />
          </Form.Item>

          <Form.Item>
            <Link to="/forgot-password" className="forgot-password-link">
              Quên mật khẩu?
            </Link>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={isSubmit}
              size="large"
              block
              className="login-button"
            >
              Đăng nhập
            </Button>
          </Form.Item>

          <Form.Item>
            <GoogleOAuthProvider clientId="375619880981-hla5js4didg8108u2j814e89sonan5jq.apps.googleusercontent.com">
              <GoogleLogin
                onSuccess={handleGoogleLoginSuccess}
                onError={() => {
                  notification.error({
                    message: "Google Login thất bại",
                    description: "Không thể xác thực với Google",
                  });
                }}
                width="100%"
              />
            </GoogleOAuthProvider>
          </Form.Item>

          <Divider>Hoặc</Divider>
          <Text className="register-text">
            Chưa có tài khoản? <Link to="/register">Đăng Ký</Link>
          </Text>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage;
