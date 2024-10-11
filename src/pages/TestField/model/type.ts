import { Project } from "@/pages/Project";
import { ValidateConstrain } from "@/pages/ValidateConstrain/model/type";

export interface TestFieldFilter {
    projectId?: number;
    fieldName?: string;
    fieldCode?: string;
    constrainIds?: number[];
    page: number | 1;
    size: number | 20;
    sort: string[] | [];
}

export interface TestField {
    id: 0,
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