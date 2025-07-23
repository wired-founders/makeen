// src\types\chat.ts
export type BookResult = {
  title: string;
  author: string;
  isbn: string;
  price: number;
  available: boolean;
  stock: number;
};

export type Message = {
  id: string;
  sender: "user" | "bot";
  type: "text" | "image" | "both";
  content: string;
  file?: File | null;
  result?: BookResult | null;
};
