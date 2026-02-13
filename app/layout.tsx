import "./globals.css";
import { ConvexClientProvider } from "./ConvexClientProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-background">
        <ConvexClientProvider>
          <div className="max-w-6xl mx-auto p-6">
            {children}
          </div>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
