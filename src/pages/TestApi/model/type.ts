import { Project } from "@/pages/Project";
import { JsonInfo, KeyValue } from "@/widgets";

export interface TestApiFilter {
  projectId?: number;
  apiName?: string;
  path?: string;
  description?: string;
  page: number; // Optional and can default to 1
  size: number; // Optional and can default to 20
  sort: string[]; // Optional, defaults to empty array
}

export interface TestApi {
  id: number;
  apiName: string;
  path: string;
  project: Project;
  description: string;
  method: 'POST' | 'PUT' | 'DELETE' | 'GET';
  param: KeyValue; // Using KeyValue for params
  header: KeyValue; // Using KeyValue for headers
  body: JsonInfo; // Specify if you have a structure; otherwise, you can keep it as any
}

export interface TestApiCreate {
  id: number;
  apiName: string;
  path: string;
  projectId?: number;
  description: string;
  method: 'POST' | 'PUT' | 'DELETE' | 'GET';
  param: KeyValue[];  // If param is also supposed to be a list of KeyValue
  header: KeyValue[];  // Update this to be an array of KeyValue
  body?: JsonInfo; // Specify if you have a structure; otherwise, you can keep it as any
}

export interface TestApiUpdate {
  id: number;
  apiName: string;
  path: string;
  projectId: number;
  description: string;
  method: "POST" | "PUT" | "DELETE" | "GET";
  param: KeyValue[];  // If param is also supposed to be a list of KeyValue
  header: KeyValue[];  // Update this to be an array of KeyValue
  body?: JsonInfo;
}
