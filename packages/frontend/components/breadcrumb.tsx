import { Breadcrumb } from "antd";
import { useRouter } from "next/router";
import { navs } from "../lib/constant";

export default function AppBreadcrumb() {
  const router = useRouter();
  const path = router.pathname;
  const paths = path.split("/").slice(1);

  return (
    <Breadcrumb style={{ margin: "0 16px", padding: 16 }}>
      {paths.slice(1).map((path, index) => {
        let name = path;

        if (index === 0) {
          const nav = navs.find(item => item.path.includes(path));
          name = nav.label;
        } else {
          name = { add: "添加", edit: "更新", update: "更新", '[building]': '企业' }[path];
        }

        return <Breadcrumb.Item key={index}>{name}</Breadcrumb.Item>;
      })}
    </Breadcrumb>
  );
}
