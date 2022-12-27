import { ListResponse, Paginator } from "./api";

export interface Rescue {
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

export interface RescuesRequest extends Paginator {
  name?: string;
  category?: string;
}

export interface RescuesResponse extends ListResponse {
  rescues: Rescue[];
}

export enum RescueType {
  firefighting = 'firefighting',
  tinyFirefighting = 'tinyFirefighting',
  securityOfficer = 'securityOfficer',
  skyRescue = 'skyRescue',
}

export enum RescueTypeZh {
  firefighting = "消防安全风险点",
  tinyFirefighting = '工业园微型消防站',
  securityOfficer = '安全员',
  skyRescue = '蓝天救援队',
}

export interface AddRescueRequest {
  name: string;
  person?: string;
  tel?: string;
  category?: RescueType;
  address?: string;
  coordinate: string;
  detail?: string;
  pictures?: string[];
}
