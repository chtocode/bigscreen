import { InboxOutlined } from "@ant-design/icons";
import { Button, Col, Form, Input, message, Row, Select, Upload } from "antd";
import dynamic from "next/dynamic";
import * as qiniu from "qiniu-js";
import { useEffect, useState } from "react";
import { Rescue, RescueType } from "../lib/model";
import apiService from "../lib/services/api-service";
import { H4 } from "./layout/H4";
import { uniq } from "lodash";

const Coordinate = dynamic(() => import("./coordinate"), {
  ssr: false,
});

export function RescueForm({ rescue }: { rescue?: Rescue }) {
  const [form] = Form.useForm();
  const isEdit = !!rescue;
  const title = isEdit ? "更新救援点" : "添加救援点";
  const fileList = rescue?.pictures.map(item => ({
    name: item.split("/").reverse()[0],
    url: item,
    status: "done",
    uid: item,
  })) as any[];
  const [removedList, setRemovedList] = useState([]);

  useEffect(() => {
    if (rescue) {
      form.setFieldsValue(rescue);
    }
  }, [rescue]);

  return (
    <>
      <h3 className="mb-8">{title}</h3>

      <Form
        form={form}
        layout="vertical"
        onFinish={value => {
          const { images, ...rest } = value;
          const pictures =
            images && images.fileList?.length
              ? images.fileList.map(item => `http://rnhmcz3cs.hd-bkt.clouddn.com/${item.name}`)
              : [];
          const req = { ...rest, pictures };

          if (isEdit) {
            apiService.updateRescue({
              ...req,
              pictures: uniq([
                ...req.pictures,
                ...fileList.filter(item => !removedList.find(r => r === item.name)).map(item => item.url),
              ]),
              id: rescue.id,
            });
          } else {
            apiService.createRescue(req);
          }
        }}
      >
        <Form.Item>
          <H4>基本信息</H4>
        </Form.Item>

        <Row justify="space-between" className="px-4">
          <Col span={10}>
            <Form.Item name="name" label="救援点名称" rules={[{ required: true }]}>
              <Input placeholder="请输入救援点名称" />
            </Form.Item>

            <Form.Item name="tel" label="责任人电话">
              <Input placeholder="请输入" />
            </Form.Item>

            <Form.Item name="address" label="详细地址">
              <Input placeholder="请输入" />
            </Form.Item>
          </Col>

          <Col span={10}>
            <Form.Item name="person" label="责任人">
              <Input placeholder="请输入" />
            </Form.Item>

            <Form.Item name="category" label="救援点类型" initialValue={RescueType.firefighting}>
              <Select placeholder="请选择类型" style={{ minWidth: 200 }}>
                <Select.Option value={RescueType.firefighting}>消防安全救援点</Select.Option>
                <Select.Option value={RescueType.tinyFirefighting}>工业园微型消防站</Select.Option>
                <Select.Option value={RescueType.securityOfficer}>安全员</Select.Option>
                <Select.Option value={RescueType.skyRescue}>蓝天救援队</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item name="coordinate" label="经纬度" rules={[{ required: true }]}>
              <Coordinate />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item>
          <H4>详细信息</H4>
        </Form.Item>

        <Row className="px-4">
          <Col span="10">
            <Form.Item name="detail" label="">
              <Input.TextArea placeholder="请输入" />
            </Form.Item>

            <Form.Item name="images">
              <Upload.Dragger
                name="files"
                multiple
                action="http://rnhmcz3cs.hd-bkt.clouddn.com"
                defaultFileList={fileList}
                onRemove={file => {
                  setRemovedList([...removedList, file.name]);
                }}
                customRequest={async data => {
                  const { onError, onSuccess, onProgress } = data;
                  const file = data.file as any;
                  const res = await apiService.getUploadToken(file.name);

                  qiniu.upload(file as File, file.name, res.data).subscribe({
                    next(data) {
                      const { total } = data;
                      if (total.percent === 100) {
                        file.status = "done";
                        onSuccess(file);
                      } else {
                        file.status = "uploading";
                        onProgress({ percent: total.percent });
                      }
                    },
                    error(event) {
                      file.status = "error";
                      onError({ status: 404, method: "post", ...event });
                    },
                  });
                }}
                onChange={info => {
                  const { status } = info.file;

                  if (status === "done") {
                    message.success(`${info.file.name} 上传成功.`);
                  } else if (status === "error") {
                    message.error(`${info.file.name} 上传失败.`);
                  }
                }}
              >
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">点击选择或将图片拖动到此处</p>
              </Upload.Dragger>
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
