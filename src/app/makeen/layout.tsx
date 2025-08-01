// src\app\makeen\layout.tsx
import Header from "@/components/Header";

export default function BookLookupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}
