import { Project } from "@/pages/Project";
import { ValidateConstrain } from "@/pages/ValidateConstrain/model/type";

export interface TestFieldFilter {
  apiId?: number | string | null;
  projectId?: number;
  fieldName?: string;
  fieldCode?: string;
  constrainIds?: number[];
  page: number | 1;
  size: number | 20;
  sort: string;
}

export interface TestField {
  id: number,
  fieldName: string,
  project: Project,
  description: string,
  defaultRegexValue: string,
  fieldCode: string,
  validateConstrains?: ValidateConstrain[]
}

export interface TestFieldCreate {
  fieldName: string,
  projectId: number,
  description: string,
  defaultRegexValue: string,
  fieldCode: string,
  validateConstrainIds: number[]
}

export interface TestFieldUpdate {
  fieldName: string,
  projectId: number,
  description: string,
  defaultRegexValue: string,
  fieldCode: string,
  validateConstrainIds: number[]
}

export interface TestFieldTableProps {
  testFields: TestField[];
  loading: boolean;
  fetchTestFields: () => Promise<void>;
  handleOpenUpdateModal: (testField: TestField) => void;
  handleDeleteTestField?: (id: number) => Promise<void>;
}