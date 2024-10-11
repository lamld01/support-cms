import { Project } from "@/pages/Project";

export type Node = {
  id: string;
  key: string;
  name: string;
  toggled?: boolean;
  loading?: boolean;
  value?: string;
  children?: Node[];
};

// Define a more specific type for parameters and headers
export interface KeyValue {
  [key: string]: string | number; // Allows for string or number values for params/headers
}

export interface TestApiFilter {
  projectId?: number;
  apiName?: string;
  description?: string;
  page: number; // Optional and can default to 1
  size: number; // Optional and can default to 20
  sort: string[]; // Optional, defaults to empty array
}

export interface TestApi {
  id: number;
  apiName: string;
  project: Project;
  description: string;
  method: 'POST' | 'PUT' | 'DELETE' | 'GET';
  param: KeyValue; // Using KeyValue for params
  header: KeyValue; // Using KeyValue for headers
  body: any; // Specify if you have a structure; otherwise, you can keep it as any
}

export interface TestApiCreate {
  id: number;
  apiName: string;
  projectId: number;
  description: string;
  method: 'POST' | 'PUT' | 'DELETE' | 'GET';
  param: KeyValue; // Using KeyValue for params
  header: KeyValue; // Using KeyValue for headers
  body: any; // Specify if you have a structure; otherwise, you can keep it as any
}

export interface TestApiUpdate {
  id: number;
  apiName: string;
  projectId: number;
  description: string;
  method: 'POST' | 'PUT' | 'DELETE' | 'GET';
  param: KeyValue; // Using KeyValue for params
  header: KeyValue; // Using KeyValue for headers
  body: any; // Specify if you have a structure; otherwise, you can keep it as any
}
