import { ListResponse, Paginator } from "./api";

export interface Enterprise {
  createdAt: string;
  updatedAt: string;
  id: number;
  name: string;
  person: string;
  tel: string;
  address: string;
  detail: string;
  pictures: string[];
}

export interface EnterprisesRequest extends Paginator {
  name?: string;
  buildingId?: number;
}

export interface EnterprisesResponse extends ListResponse {
  enterprises: Enterprise[];
}


export interface AddEnterpriseRequest {
  buildingId: number;
  name: string;
  person: string;
  tel: string;
  address: string;
  detail: string;
  pictures: string[];
}
