import { InboxOutlined } from "@ant-design/icons";
import { Button, Col, Form, Input, message, Row, Select, Upload } from "antd";
import dynamic from "next/dynamic";
import * as qiniu from "qiniu-js";
import { useEffect, useState } from "react";
import { Building, Enterprise } from "../lib/model";
import apiService from "../lib/services/api-service";
import { H4 } from "./layout/H4";
import { uniq } from "lodash";
import { useRouter } from "next/router";

const Coordinate = dynamic(() => import("./coordinate"), {
  ssr: false,
});

export function EnterpriseForm({ enterprise }: { enterprise?: Enterprise }) {
  const [form] = Form.useForm();
  const isEdit = !!enterprise;
  const title = isEdit ? "更新风险点" : "添加风险点";
  const fileList = enterprise?.pictures.map(item => ({
    name: item.split("/").reverse()[0],
    url: item,
    status: "done",
    uid: item,
  })) as any[];
  const [removedList, setRemovedList] = useState([]);
  const router = useRouter();
  const [floors, setFloors] = useState([]);

  useEffect(() => {
    if (enterprise) {
      form.setFieldsValue(enterprise);
    }
  }, [enterprise]);

  useEffect(() => {
    const { building } = router.query;

    apiService.getBuildingById(+building).then(res => {
      const floor = JSON.parse(res.data.floors);

      setFloors(Object.entries(floor).map(([key, value]) => ({ name: key, url: value })));
    });
  }, [router.query]);

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
          const { building } = router.query;
          const req = { ...rest, pictures, buildingId: +building };

          if (isEdit) {
            apiService.updateEnterprise({
              ...req,
              pictures: uniq([
                ...req.pictures,
                ...fileList.filter(item => !removedList.find(r => r === item.name)).map(item => item.url),
              ]),
              id: enterprise.id,
            });
          } else {
            apiService.createEnterprise(req);
          }
        }}
      >
        <Form.Item>
          <H4>基本信息</H4>
        </Form.Item>

        <Row justify="space-between" className="px-4">
          <Col span={10}>
            <Form.Item name="name" label="企业名称" rules={[{ required: true }]}>
              <Input placeholder="请输入企业名称" />
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

            <Form.Item name="floor" label="楼层" rules={[{ required: true }]}>
              <Select>
                {floors.map((item, index) => (
                  <Select.Option value={item.name} key={index}>
                    {item.name}
                  </Select.Option>
                ))}
              </Select>
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
