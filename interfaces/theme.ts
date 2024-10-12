// theme/types.ts
export interface ThemeColors {
  primary: string;
  background: string;
  text: string;
  card: string;
  border: string;
  notification: string;
  // Add more colors as needed
}

export interface Theme {
  colors: ThemeColors;
  // You can add typography, spacing, etc., if needed
}
