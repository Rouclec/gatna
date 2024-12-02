export interface Course {
  _id: string;
  id: string;
  length?: number;
  title: string;
  description: string;
  fileType: string;
  link?: string;
}
