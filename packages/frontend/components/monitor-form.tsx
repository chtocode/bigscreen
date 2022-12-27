import { Button, Col, Form, Input, Row } from "antd";
import dynamic from "next/dynamic";
import { useEffect } from "react";
import { Monitor } from "../lib/model";
import apiService from "../lib/services/api-service";
import { H4 } from "./layout/H4";

const Coordinate = dynamic(() => import("./coordinate"), {
  ssr: false,
});

export function MonitorForm({ monitor }: { monitor?: Monitor }) {
  const [form] = Form.useForm();
  const isEdit = !!monitor;
  const title = isEdit ? "更新设备" : "添加设备";

  useEffect(() => {
    if (monitor) {
      form.setFieldsValue(monitor);
    }
  }, [monitor]);

  return (
    <>
      <h3 className="mb-8">{title}</h3>

      <Form
        form={form}
        layout="vertical"
        onFinish={value => {
          if (isEdit) {
            apiService.updateMonitor({ ...value, id: monitor.id});
          } else {
            apiService.createMonitor(value);
          }
        }}
      >
        <Form.Item>
          <H4>基本信息</H4>
        </Form.Item>

        <Row justify="space-between" className="px-4">
          <Col span={10}>
            <Form.Item name="name" label="设备名称" rules={[{ required: true }]}>
              <Input placeholder="请输入设备名称" />
            </Form.Item>

            <Form.Item name="url" label="视频地址" rules={[{ required: true }]}>
              <Input placeholder="请输入" />
            </Form.Item>
          </Col>

          <Col span={10}>
            <Form.Item name="address" label="详细地址">
              <Input placeholder="请输入" />
            </Form.Item>

            <Form.Item name="coordinate" label="经纬度" rules={[{ required: true }]}>
              <Coordinate />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item className="px-4">
          <Button type="primary" htmlType="submit" className="mr-4">
            提交
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}
