import './globals.css';
import 'react-toastify/dist/ReactToastify.css';
import type { Metadata } from 'next';
import { ToastContainer } from 'react-toastify';

import { inter } from '@ffp-web/app/fonts';

import { Layouts } from './Layouts';

export const metadata: Metadata = {
  title: 'FFP Travels',
  description: 'FFP home website',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={`${inter.className} antialiased`}>
        <Layouts>
          <ToastContainer />
          {children}
        </Layouts>
      </body>
    </html>
  );
}
