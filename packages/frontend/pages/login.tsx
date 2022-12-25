import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Col, Form, Input, Row } from "antd";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { validateMessages } from "../lib/constant";
import { LoginFormValues } from "../lib/model/login";
import apiService from "../lib/services/api-service";
import storage from "../lib/services/storage";

export default function Login() {
  const [form] = Form.useForm();
  const router = useRouter();

  const login = async (loginRequest: LoginFormValues) => {
    const { data } = await apiService.login(loginRequest);

    if (!!data) {
      storage.setUserInfo(data);
      router.push("dashboard");
    }
  };

  useEffect(() => {
    if (storage?.userInfo) {
      router.push(`/dashboard`);
    }
  }, []);

  return (
    <div className="flex h-screen justify-center items-center" style={{ background: 'url("bg.png")' }}>
      <div className="w-full -mt-12">
        <Row justify="center">
          <h2 style={{ color: "rgb(1,251,248)" }} className="text-4xl mb-24">
            南头街道应急指挥中心
          </h2>
        </Row>

        <Row justify="center">
          <Col md={5} sm={24}>
            <Form
              name="login"
              initialValues={{
                name: "admin",
                password: "admin",
              }}
              onFinish={(values: LoginFormValues) => login(values)}
              form={form}
              validateMessages={validateMessages}
            >
              <Form.Item name="name" rules={[{ required: true }]}>
                <Input prefix={<UserOutlined />} placeholder="请输入用户名" />
              </Form.Item>

              <Form.Item name="password" rules={[{ required: true }, { min: 4, max: 16 }]}>
                <Input prefix={<LockOutlined />} type="password" placeholder="请输入密码" />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(9, 134, 170, 1) 0%, rgba(9, 134, 170, 1) 0%, rgba(3, 247, 255, 1) 24%, rgba(3, 247, 255, 1) 74%, rgba(9, 134, 170, 1) 100%, rgba(9, 134, 170, 1) 100%)",
                  }}
                  className="w-full"
                >
                  登录
                </Button>
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </div>
    </div>
  );
}
