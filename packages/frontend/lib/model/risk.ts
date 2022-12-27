import { ListResponse, Paginator } from "./api";

export interface Risk {
  createdAt: string;
  updatedAt: string;
  id: number;
  name: string;
  person: string;
  tel: string;
  category: string;
  address: string;
  coordinate: string;
  detail: string;
  pictures: string[];
}

export interface RisksRequest extends Paginator {
  name?: string;
  category?: string;
}

export interface RisksResponse extends ListResponse {
  risks: Risk[];
}

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

export enum RiskTypeZh {
  firefighting = "消防安全风险点",
  traffic = "交通安全风险点",
  industry = "工商贸风险点",
  building = "建筑风险点",
  engineering = "小散工程风和零星作业风险点",
  slope = "危险边坡",
  decrepitHouse = "危旧房屋",
  waterPoint = "内涝积水点",
}

export interface AddRiskRequest {
  name: string;
  person?: string;
  tel?: string;
  category?: RiskType;
  address?: string;
  coordinate: string;
  detail?: string;
  pictures?: string[];
}
