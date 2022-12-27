import { ReadOutlined } from "@ant-design/icons";

/**
 * router path
 */
export enum RoutePath {
  add = "add",
  edit = "edit",
  rescue = "rescue",
  industry = "industry",
  risk = "risk",
  monitor = "monitor",
}

export interface SideNav {
  icon?: JSX.Element;
  label: string;
  path: string[];
  hideLinkInBreadcrumb?: boolean; // 当前面包屑上的链接是否应该被隐藏
  subNav?: SideNav[];
  hide?: boolean;
}

const risks: SideNav = {
  path: [RoutePath.risk],
  label: "风险点管理",
  icon: <ReadOutlined />,
  hideLinkInBreadcrumb: true,
};

const rescues: SideNav = {
  path: [RoutePath.rescue],
  label: "救援救助力量管理",
  icon: <ReadOutlined />,
  hideLinkInBreadcrumb: true,
};

const industry: SideNav = {
  path: [RoutePath.industry],
  label: "企业管理",
  icon: <ReadOutlined />,
  hideLinkInBreadcrumb: true,
};

const monitor: SideNav = {
  path: [RoutePath.monitor],
  label: "视频监控管理",
  icon: <ReadOutlined />,
  hideLinkInBreadcrumb: true,
};

export const navs: SideNav[] = [risks, rescues, industry, monitor];
