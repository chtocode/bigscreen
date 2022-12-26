import { APILoader, Map, ToolBarControl, Marker } from "@uiw/react-amap";
import { Input, Modal } from "antd";
import { useEffect, useState } from "react";
import { isNumber, isNaN } from "lodash";

interface CoordinateProps {
  value?: string;
  onChange?: (value: string) => void;
}

export default function Coordinate({ value, onChange }: CoordinateProps) {
  const [coordinate, setCoordinate] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [pos, setPos] = useState(null);

  return (
    <>
      <Input
        type="text"
        value={value ?? coordinate}
        addonAfter={
          <span className="cursor-pointer hover:text-blue-400" onClick={() => setIsOpen(true)}>
            地图选点
          </span>
        }
        placeholder="请输入"
        onChange={event => {
          console.log(event);

          if (onChange) {
            onChange(event.target.value);
          }
        }}
      />
      <Modal
        open={isOpen}
        onCancel={() => {
          setIsOpen(false);
        }}
        onOk={() => {
          const val = [pos.lng, pos.lat].join(",");
          setCoordinate(val);
          setIsOpen(false);
          onChange(val);
        }}
        okText="确定"
        cancelText="取消"
      >
        <APILoader version="2.0.5" akay="a7a90e05a37d3f6bf76d4a9032fc9129">
          <div>
            <Map
              style={{ height: 350 }}
              center={[113.9, 22.5]}
              onClick={event => {
                setPos(event.lnglat);
              }}
              onComplete={() => {
                if (
                  value &&
                  value
                    .split(",")
                    .map(item => +item)
                    .every(item => isNumber(item) && !isNaN(item))
                ) {
                  const [lng, lat] = value.split(",");
                  setPos(new AMap.LngLat(+lng, +lat));
                }
              }}
            >
              <>
                <ToolBarControl offset={[16, 10]} position="RB" />
                <Marker position={pos} />
              </>
            </Map>
          </div>
        </APILoader>
      </Modal>
    </>
  );
}
