import { Theme } from "@/interfaces/theme";
import { createTheme } from "@rneui/themed";


export const lightTheme: Theme = {
  colors: {
    primary: '#6200EE',
    background: '#FFFFFF',
    text: '#000000',
    card: '#FFFFFF',
    border: '#cccccc',
    notification: '#6200EE',
    // Add more colors as needed
  },
};

export const darkTheme: Theme = {
  colors: {
    primary: '#BB86FC',
    background: '#121212',
    text: '#FFFFFF',
    card: '#1E1E1E',
    border: '#444444',
    notification: '#BB86FC',
    // Add more colors as needed
  },
};

// Additional predefined themes can be added here



export const theme = createTheme({
});
