import { Button, Col, Form, Input, InputNumber, message, Row, Upload } from "antd";
import dynamic from "next/dynamic";
import * as qiniu from "qiniu-js";
import { useEffect, useState } from "react";
import { Building } from "../lib/model";
import apiService from "../lib/services/api-service";
import { H4 } from "./layout/H4";

const Coordinate = dynamic(() => import("./coordinate"), {
  ssr: false,
});

export function BuildingForm({ building }: { building?: Building }) {
  const [form] = Form.useForm();
  const isEdit = !!building;
  const title = isEdit ? "更新楼宇" : "添加楼宇";

  useEffect(() => {
    if (building) {
      const { floors, ...rest } = building;
      const result = JSON.parse(floors || "{}");
      const fls = Object.entries(result).map(([key, value]) => ({ name: key, url: value }));
      form.setFieldsValue({ ...rest, floors: fls });
    }
  }, [building]);

  return (
    <>
      <h3 className="mb-8">{title}</h3>

      <Form
        form={form}
        layout="vertical"
        onFinish={value => {
          const { floors, ...rest } = value;
          const req = {
            ...rest,
            floors: JSON.stringify(floors.reduce((acc, cur) => ({ ...acc, [cur.name]: cur.url }), {})),
          };

          if (isEdit) {
            apiService.updateBuilding({
              ...req,
              id: building.id,
            });
          } else {
            apiService.createBuilding(req);
          }
        }}
      >
        <Form.Item>
          <H4>基本信息</H4>
        </Form.Item>

        <Row justify="space-between" className="px-4">
          <Col span={10}>
            <Form.Item name="name" label="楼宇名称" rules={[{ required: true }]}>
              <Input placeholder="请输入楼宇名称" />
            </Form.Item>

            <Form.Item name="person" label="责任人">
              <Input placeholder="请输入" />
            </Form.Item>

            <Form.Item name="tel" label="责任人电话">
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

        <Form.Item>
          <H4>楼层信息</H4>
        </Form.Item>

        <Row justify="space-between" className="px-4">
          <Col span={10}>
            <Form.Item name="totalFloors" label="总层数" rules={[{ required: true }]}>
              <InputNumber min={1} className="w-full" />
            </Form.Item>
          </Col>

          <Col span={10}>
            <Form.Item name="subsurfaceFloors" label="地下层数" rules={[{ required: true }]}>
              <InputNumber min={0} className="w-full" />
            </Form.Item>
          </Col>
        </Row>

        <Row className="mx-4 bg-gray-100 max-w-md m-4 py-2 rounded-sm">
          <Col span={16} className="text-center">
            楼层
          </Col>
          <Col span={8} className="text-center">
            楼层平面图
          </Col>
        </Row>

        <Form.List name="floors">
          {(fields, { add, remove }) => (
            <>
              {fields.map((field, index) => (
                <div className="flex items-center">
                  <Form.Item {...field} initialValue={{ name: "", url: "" }}>
                    <Floor />
                  </Form.Item>

                  <Form.Item>
                    <Button onClick={() => remove(index)} type="link">
                      删除楼层
                    </Button>
                  </Form.Item>
                </div>
              ))}

              <Form.Item className="max-w-md pl-4">
                <Button type="dashed" size="large" onClick={() => add()} block>
                  添加楼层
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        <Form.Item className="px-4">
          <Button type="primary" htmlType="submit" className="mr-4">
            提交
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}

interface CustomControlProps {
  value?: { name: string; url: string };
  onChange?: (value: { name: string; url: string }) => void;
}

function Floor({ value, onChange }: CustomControlProps) {
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const fileList = [{
    name: value.url.split("/").reverse()[0],
    url: value.url,
    status: "done",
    uid: value.url,
  }] as any;

  return (
    <div className="flex gap-4 items-center max-w-md mx-4 floor-control">
      <Input
        value={value?.name || name}
        onChange={event => {
          const url = image || value.url;
          setName(event.target.value);

          if (onChange) {
            onChange({ name: event.target.value, url });
          }
        }}
      />

      <Upload
        name="files"
        multiple
        action="http://rnhmcz3cs.hd-bkt.clouddn.com"
        defaultFileList={fileList}
        onRemove={file => {
          setImage("");
          if (onChange) {
            onChange({ name: name || value.name, url: "" });
          }
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
            if (onChange) {
              onChange({ name: name || value.name, url: `http://rnhmcz3cs.hd-bkt.clouddn.com/${info.file.name}` });
            }
          } else if (status === "error") {
            message.error(`${info.file.name} 上传失败.`);
          }
        }}
      >
        <Button>点击上传</Button>
      </Upload>
    </div>
  );
}
