import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <title>BÆKON Research Console</title>
        <meta name="description" content="Zero-hallucination rails for FL & fringe corpora" />
      </head>
      <body className="min-h-screen bg-cyber-grid">
        {children}
      </body>
    </html>
  );
}
