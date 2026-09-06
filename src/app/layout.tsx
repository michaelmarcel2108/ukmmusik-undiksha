import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "UKM Musik Undiksha",
  description: "Website Resmi UKM Musik Undiksha - Salam Rock",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${outfit.variable} h-full antialiased dark`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                if (typeof window !== 'undefined') {
                  const observer = new MutationObserver(function(mutations) {
                    mutations.forEach(function(mutation) {
                      if (mutation.type === 'attributes' && mutation.attributeName === 'bis_skin_checked') {
                        mutation.target.removeAttribute('bis_skin_checked');
                      }
                    });
                  });
                  observer.observe(document.documentElement, { attributes: true, subtree: true, attributeFilter: ['bis_skin_checked'] });
                  
                  // Also clean up any existing ones just in case
                  window.addEventListener('DOMContentLoaded', function() {
                    document.querySelectorAll('[bis_skin_checked]').forEach(function(el) {
                      el.removeAttribute('bis_skin_checked');
                    });
                  });
                }
              })();
            `,
          }}
        />
      </head>
      <body 
        className="min-h-full flex flex-col font-sans bg-background text-foreground selection:bg-ukmred selection:text-white"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
