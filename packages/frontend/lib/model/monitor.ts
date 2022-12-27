import { ListResponse, Paginator } from "./api";

export interface Monitor {
  createdAt: string;
  updatedAt: string;
  id: number;
  name: string;
  address: string;
  coordinate: string;
  url: string;
}

export interface MonitorsRequest extends Paginator {
  name?: string;
}

export interface MonitorsResponse extends ListResponse {
  monitors: Monitor[];
}

export interface AddMonitorRequest {
  name: string;
  address?: string;
  coordinate: string;
  url: string;
}
