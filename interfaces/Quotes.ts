

export interface Quote {
  id?: number;
  quoteText: string;
  explanation: string;
  author: string;
  packId: number;
}

export interface QuotePack {
  id?: number;
  name: string;
  description: string;
  isPredefined: number;
}
