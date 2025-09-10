export interface Question {
  id: number;
  question: string;
  options: string[];
  key: string;
  icons?: React.FC<React.SVGProps<SVGSVGElement>>[];
  selectType: 'single' | 'multiple';
}

export interface Destination {
  name: string;
  description: string;
  imageUrl: string;
}
