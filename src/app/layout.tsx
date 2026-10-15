import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ticket-IT Admin Prototype",
  description: "Clickable design prototype of a Ticket-IT admin feature (design only, no functionality).",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <head>
        {/* same icon set as New-Frontend (fa-solid / fa-regular) */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
