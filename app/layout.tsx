import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Qiancheng Li | Content & Data Storytelling',
  description: 'Portfolio of Qiancheng Li — content strategy, social media, visual media, and data storytelling.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
