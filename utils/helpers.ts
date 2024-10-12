// utils/helpers.ts
export const getGreetingMessage = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning!";
    if (hour < 18) return "Good Afternoon!";
    return "Good Evening!";
  };
  
  import { getSelectedQuotes } from '@/db/database';

  export const getRandomQuote = async () => {
    try {
      const quotes = await getSelectedQuotes();
      if (quotes.length === 0) return undefined;
      const randomIndex = Math.floor(Math.random() * quotes.length);
      const quote = quotes[randomIndex];
      return {
        text: quote.quoteText,
        author: quote.author,
        explanation: quote.explanation,
      };
    } catch (error) {
      console.error('Error getting random quote:', error);
      return undefined;
    }
  };
  