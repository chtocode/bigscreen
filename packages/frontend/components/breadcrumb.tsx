import { Breadcrumb } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import { navs, SideNav } from "../lib/constant/routes";
import { deepSearchRecordFactory, getSideNavNameByPath } from "../lib/util";

export default function AppBreadcrumb() {
  const router = useRouter();
  const path = router.pathname;
  const paths = path.split("/").slice(1);
  const root = "/" + paths.slice(0, 2).join("/");
  const sideNav = navs;
  const names = getSideNavNameByPath(sideNav, path) || [];

  return (
    <Breadcrumb style={{ margin: "0 16px", padding: 16 }}>
      {names.map((name, index) => {
        if (name === "Detail") {
          return <Breadcrumb.Item key={index}>Detail</Breadcrumb.Item>;
        }

        const record = deepSearchRecordFactory(
          (nav: SideNav, value: any) => nav.label === value,
          name,
          "subNav",
        )(sideNav);

        const { navs }: { source: SideNav[]; navs: SideNav[] } = record.reduce(
          (acc, cur) => {
            const item = acc.source[acc.source.length + cur];

            return { source: item.subNav, navs: [...acc.navs, item] };
          },
          { source: sideNav, navs: [] },
        );

        const isText = index === names.length - 1 || navs.every(item => item.hideLinkInBreadcrumb);
        const subPath = navs
          .map(item => item.path)
          .reduce((acc, cur) => [...acc, ...cur], [])
          .filter(item => !!item)
          .join("/");

        return (
          <Breadcrumb.Item key={index}>
            {isText ? name : <Link href={`${root}/${subPath}`}>{name}</Link>}
          </Breadcrumb.Item>
        );
      })}
    </Breadcrumb>
  );
}
