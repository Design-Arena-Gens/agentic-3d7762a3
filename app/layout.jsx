import '../styles/globals.css';

export const metadata = {
  title: 'Dog with Red Flames Generator',
  description: 'Generate an image of a dog with red flames',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
