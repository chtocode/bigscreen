import { Button, Divider, Form, Input, Popconfirm, Select, Space, Table } from "antd";
import { ColumnType } from "antd/lib/table";
import TextLink from "antd/lib/typography/Link";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useListEffect } from "../../../components/custom-hooks/list-effect";
import Layout from "../../../components/layout/layout";
import { Rescue, RescuesRequest, RescuesResponse, RescueType, RescueTypeZh } from "../../../lib/model";
import apiService from "../../../lib/services/api-service";
import { genCommonTableProps } from "../../../lib/util";

export default function Page() {
  const router = useRouter();
  const [query, setQuery] = useState<{ name?: string; category?: string }>();
  const [form] = Form.useForm();
  const { data, loading, paginator, setPaginator, total, setTotal, setData } = useListEffect<
    RescuesRequest,
    RescuesResponse,
    Rescue
  >(apiService.getRescues.bind(apiService), "rescues", true, query);

  const columns: ColumnType<Rescue>[] = [
    {
      title: "序号",
      key: "index",
      render: (_1, _2, index) => index + 1,
    },
    {
      title: "名称",
      dataIndex: "name",
    },
    {
      title: "类型",
      dataIndex: "category",
      render(val) {
        return RescueTypeZh[val];
      }
    },
    {
      title: "详细地址",
      dataIndex: "address",
    },
    {
      title: "责任人",
      dataIndex: "person",
    },
    {
      title: "责任人电话",
      dataIndex: "tel",
    },
    {
      title: "操作",
      dataIndex: "action",
      render: (_, record: Rescue) => (
        <Space size="middle">
          <Link href={`/dashboard/rescue/edit/${record.id}`}>编辑</Link>

          <Popconfirm
            title="确定要删除吗?"
            onConfirm={() => {
              apiService.deleteRescue(record.id).then(res => {
                const { data: isDeleted } = res;

                if (isDeleted) {
                  const index = data.findIndex(item => item.id === record.id);
                  const updatedData = [...data];

                  updatedData.splice(index, 1);
                  setData(updatedData);
                  setTotal(total - 1);
                }
              });
            }}
            okText="确定"
            cancelText="取消"
          >
            <TextLink>删除</TextLink>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Layout>
      <Form layout="inline" form={form} className="flex gap-4">
        <Form.Item name="name" label="风险点名称">
          <Input placeholder="请输入风险点名称" />
        </Form.Item>

        <Form.Item name="category" label="风险点类型">
          <Select placeholder="请选择类型" style={{ minWidth: 200 }}>
            <Select.Option value={RescueType.firefighting}>消防安全风险点</Select.Option>
            <Select.Option value={RescueType.tinyFirefighting}>工业园微型消防站</Select.Option>
            <Select.Option value={RescueType.securityOfficer}>安全员</Select.Option>
            <Select.Option value={RescueType.skyRescue}>蓝天救援队</Select.Option>
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

      <Divider></Divider>

      <div className="flex items-center justify-between mb-4">
        <h4>信息列表</h4>

        <Button type="primary" onClick={() => router.push("rescue/add")}>
          添加
        </Button>
      </div>

      <Table
        {...genCommonTableProps({
          data,
          paginator,
          loading,
          setPaginator,
          columns,
          total,
        })}
      ></Table>
    </Layout>
  );
}
