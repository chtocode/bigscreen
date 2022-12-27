import { ListResponse, Paginator } from "./api";

export interface Building {
  createdAt: string;
  updatedAt: string;
  id: number;
  name: string;
  person: string;
  tel: string;
  address: string;
  coordinate: string;
  totalFloors: number;
  subsurfaceFloors: number;
  enterpriseCount: number;
  floors: string; // JSON string
}

export interface BuildingsRequest extends Paginator {
  name?: string;
}

export interface BuildingsResponse extends ListResponse {
  buildings: Building[];
}


export interface AddBuildingRequest {
  name: string;
  person: string;
  tel: string;
  address: string;
  coordinate: string;
  totalFloors: number;
  subsurfaceFloors: number;
  enterpriseCount: number;
  floors: { [key: string]: string };
}
