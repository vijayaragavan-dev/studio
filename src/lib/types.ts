export interface Question {
  id: number;
  question: string;
  options: string[];
  key: string;
  icons?: React.FC<React.SVGProps<SVGSVGElement>>[];
}

export interface Destination {
  name: string;
  description: string;
  imageUrl: string;
}
