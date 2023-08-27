export interface Word {
  alternativeWords?: string[];
  associations?: string[];
  helpText?: string;
  isBonus?: boolean;
  isStartup?: boolean;
  word: string;
  x: number;
  y: number;
}
