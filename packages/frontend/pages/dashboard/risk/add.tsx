import { Button, Form, Input, Select } from "antd";
import { useState } from "react";
import Layout from "../../../components/layout/layout";

export enum RiskType {
  firefighting = "firefighting",
  traffic = "traffic",
  industry = "industry",
  building = "building",
  engineering = "engineering",
  slope = "slope",
  decrepitHouse = "decrepitHouse",
  waterPoint = "waterPoint",
}

export default function Page() {
  const [query, setQuery] = useState<{ name?: string; category?: string }>();
  const [form] = Form.useForm();

  return (
    <Layout>
      <Form layout="inline" form={form} className="flex gap-4">
        <Form.Item name="name" label="风险点名称">
          <Input placeholder="请输入风险点名称" />
        </Form.Item>

        <Form.Item name="category" label="风险点类型">
          <Select placeholder="请选择类型" style={{ minWidth: 200 }}>
            <Select.Option value={RiskType.firefighting}>消防安全风险点</Select.Option>
            <Select.Option value={RiskType.traffic}>交通安全风险点</Select.Option>
            <Select.Option value={RiskType.industry}>工商贸风险点</Select.Option>
            <Select.Option value={RiskType.building}>建筑风险点</Select.Option>
            <Select.Option value={RiskType.engineering}>小散工程风和零星作业风险点</Select.Option>
            <Select.Option value={RiskType.slope}>危险边坡</Select.Option>
            <Select.Option value={RiskType.decrepitHouse}>危旧房屋</Select.Option>
            <Select.Option value={RiskType.waterPoint}>内涝积水点</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            onClick={() => {
              const values = form.getFieldsValue();

              setQuery(values);
            }}
            className="mr-4"
          >
            查询
          </Button>

          <Button
            onClick={() => {
              form.resetFields();
              setQuery(undefined);
            }}
          >
            重置
          </Button>
        </Form.Item>
      </Form>
    </Layout>
  );
}
