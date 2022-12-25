import { BaseType, ListResponse, Paginator } from './api';
import { Course, CourseShort } from './course';

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
export interface AddStudentRequest {
  name: string;
  country: string;
  email: string;
  type: number;
}

export type AddStudentResponse = Risk;

export interface UpdateStudentRequest extends AddStudentRequest {
  id: number;
}

export type UpdateStudentResponse = Risk;

export interface StudentRequest {
  id: number;
}
