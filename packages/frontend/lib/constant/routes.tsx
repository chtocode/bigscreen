import { EditOutlined, FileAddOutlined, ProjectOutlined, ReadOutlined } from "@ant-design/icons";

/**
 * router path
 */
export enum RoutePath {
  add = "add",
  edit = "edit",
  rescues = "rescues",
  teachers = "teachers",
  students = "students",
  selectStudents = "selectStudents",
  risk = "risk",
  own = "own",
  schedule = "schedule",
  profile = "profile",
  message = "message",
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
  subNav: [
    { path: [""], label: "风险点列表", icon: <ProjectOutlined /> },
    { path: [RoutePath.add], label: "添加风险点", icon: <FileAddOutlined /> },
    { path: [RoutePath.edit], label: "更新风险点", icon: <EditOutlined /> },
  ],
};

const rescues: SideNav = {
  path: [RoutePath.risk],
  label: "救援救助力量管理",
  icon: <ReadOutlined />,
  hideLinkInBreadcrumb: true,
  subNav: [
    { path: [""], label: "救援救助力量列表", icon: <ProjectOutlined /> },
    { path: [RoutePath.add], label: "添加救援求助力量", icon: <FileAddOutlined /> },
    { path: [RoutePath.edit], label: "更新救援求助力量", icon: <EditOutlined /> },
  ],
};

export const navs: SideNav[] = [risks, rescues];
