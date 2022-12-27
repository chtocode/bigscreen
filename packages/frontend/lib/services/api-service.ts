// tslint:disable:max-classes-per-file
import { message } from "antd";
import axios, { AxiosError } from "axios";
import { AES } from "crypto-js";
import {
  AddMonitorRequest,
  AddRescueRequest,
  AddRiskRequest,
  Monitor,
  MonitorsRequest,
  MonitorsResponse,
  Rescue,
  RescuesRequest,
  RescuesResponse,
  Risk,
  RisksRequest,
  RisksResponse,
} from "../model";
import { DeleteResponse, IResponse, QueryParams } from "../model/api";
import { LoginRequest, LoginResponse, SignUpRequest } from "../model/login";
import { RootPath } from "./api-path";
import storage from "./storage";

const getBaseUrl = () => {
  if (process.env.NODE_ENV === "development") {
    return process.env.NEXT_PUBLIC_API || "http://localhost:3002/api";
  } else {
    return "http://bigscreen.chtoma.com/api";
  }
};
// const baseURL = getBaseUrl();
const baseURL = "http://bigscreen.chtoma.com/api";

const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
  responseType: "json",
});

axiosInstance.interceptors.request.use(config => {
  if (!config.url?.includes("login")) {
    return {
      ...config,
      headers: {
        ...config.headers,
        Authorization: "Bearer " + storage?.token,
      },
    };
  }

  return config;
});

type IPath = (string | number)[] | string | number;

class BaseApiService {
  protected async get<T>(path: IPath, params?: QueryParams): Promise<T> {
    path = this.getPath(path);
    path = !!params
      ? `${path}?${Object.entries(params)
          .map(([key, value]) => `${key}=${value}`)
          .join("&")}`
      : path;

    return axiosInstance
      .get(path)
      .then(res => res.data)
      .catch(err => this.errorHandler(err));
  }

  protected async post<T>(path: IPath, params: object): Promise<T> {
    return axiosInstance
      .post(this.getPath(path), params)
      .then(res => res.data)
      .catch(this.errorHandler);
  }

  protected async delete<T>(path: IPath): Promise<T> {
    return axiosInstance
      .delete(this.getPath(path))
      .then(res => res.data)
      .catch(this.errorHandler);
  }

  protected async put<T>(path: IPath, params: object): Promise<T> {
    return axiosInstance
      .put(this.getPath(path), params)
      .then(res => res.data)
      .catch(this.errorHandler);
  }

  /**
   * 根据 HTTP 状态码判断请求是否成功
   */
  protected isError(code: number): boolean {
    return !(code.toString().startsWith("2") || code.toString().startsWith("3"));
  }

  /**
   * 显示 Api 上的提示信息
   */
  protected showMessage =
    (isSuccessDisplay = false) =>
    (res: IResponse): IResponse => {
      const { code, msg } = res;
      const isError = this.isError(code);

      if (isError) {
        message.error(msg);
      }

      if (isSuccessDisplay && !isError) {
        message.success(msg);
      }

      return res;
    };

  /**
   * 处理 http 请求上的错误
   * 注意：此处返回的code是HTTP的状态码，并非后台自定义的code
   */
  private errorHandler(err: AxiosError<IResponse>): IResponse {
    const msg = err.response?.data.msg ?? "unknown error";
    const code = err.response?.status ?? -1;

    if (!err.response) {
      console.error("%c [ err ]-149", "font-size:13px; background:pink; color:#bf2c9f;", err);
    }

    return { msg, code };
  }

  private getPath(path: IPath): string {
    return !Array.isArray(path) ? String(path) : path.join("/");
  }
}

class ApiService extends BaseApiService {
  login({ password, ...rest }: LoginRequest): Promise<IResponse<LoginResponse>> {
    return this.post<IResponse<LoginResponse>>(RootPath.login, {
      ...rest,
      password: AES.encrypt(password, "bigscreen").toString(),
    }).then(this.showMessage());
  }

  logout(): Promise<IResponse<boolean>> {
    return this.post<IResponse<boolean>>(RootPath.logout, {}).then(this.showMessage());
  }

  signUp(req: SignUpRequest): Promise<IResponse<boolean>> {
    return this.post<IResponse<boolean>>([RootPath.signUp], req).then(this.showMessage(true));
  }

  getUploadToken(name: string): Promise<IResponse<string>> {
    return this.post<IResponse<string>>([RootPath.upload], { name });
  }

  getRisks(req?: RisksRequest): Promise<IResponse<RisksResponse>> {
    return this.get<IResponse<RisksResponse>>(RootPath.risk, req as unknown as QueryParams);
  }

  getRiskById(id?: number): Promise<IResponse<Risk>> {
    return this.get<IResponse<Risk>>([RootPath.risk, id]);
  }

  deleteRisk(id: number): Promise<IResponse<DeleteResponse>> {
    return this.delete([RootPath.risk, id]).then(this.showMessage(true));
  }

  createRisk(req: AddRiskRequest) {
    return this.post([RootPath.risk], req).then(this.showMessage(true));
  }

  updateRisk(req: AddRiskRequest) {
    return this.put([RootPath.risk], req).then(this.showMessage(true));
  }

  getRescues(req?: RescuesRequest): Promise<IResponse<RescuesResponse>> {
    return this.get<IResponse<RescuesResponse>>(RootPath.rescue, req as unknown as QueryParams);
  }

  getRescueById(id?: number): Promise<IResponse<Rescue>> {
    return this.get<IResponse<Rescue>>([RootPath.rescue, id]);
  }

  deleteRescue(id: number): Promise<IResponse<DeleteResponse>> {
    return this.delete([RootPath.rescue, id]).then(this.showMessage(true));
  }

  createRescue(req: AddRescueRequest) {
    return this.post([RootPath.rescue], req).then(this.showMessage(true));
  }

  updateRescue(req: AddRiskRequest) {
    return this.put([RootPath.rescue], req).then(this.showMessage(true));
  }

  getMonitors(req?: MonitorsRequest): Promise<IResponse<MonitorsResponse>> {
    return this.get<IResponse<MonitorsResponse>>(RootPath.monitor, req as unknown as QueryParams);
  }

  getMonitorById(id?: number): Promise<IResponse<Monitor>> {
    return this.get<IResponse<Monitor>>([RootPath.monitor, id]);
  }

  deleteMonitor(id: number): Promise<IResponse<DeleteResponse>> {
    return this.delete([RootPath.monitor, id]).then(this.showMessage(true));
  }

  createMonitor(req: AddMonitorRequest) {
    return this.post([RootPath.monitor], req).then(this.showMessage(true));
  }

  updateMonitor(req: AddRiskRequest) {
    return this.put([RootPath.monitor], req).then(this.showMessage(true));
  }
}

export const apiService = new ApiService();

export default apiService;
