import { Package } from "../hooks/package";

export interface Course {
  _id: string;
  id: string;
  length?: number;
  package?: Package;
  title: string;
  description: string;
  fileType: string;
  link?: string;
}
