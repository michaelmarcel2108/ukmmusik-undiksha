import type { Metadata } from "next";
import "./globals.css";

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
      className="h-full antialiased dark font-sans"
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Anton&family=Outfit:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                if (typeof window !== 'undefined') {
                  // Suppress unhandled promise rejections originating from browser extensions
                  window.addEventListener('unhandledrejection', function(event) {
                    var reason = event.reason;
                    var stack = (reason && reason.stack) ? String(reason.stack) : '';
                    var message = (reason && reason.message) ? String(reason.message) : '';
                    if (
                      stack.includes('chrome-extension://') ||
                      stack.includes('moz-extension://') ||
                      stack.includes('safari-extension://') ||
                      message.includes('M_ID')
                    ) {
                      event.preventDefault();
                      event.stopImmediatePropagation();
                    }
                  });

                  // Clean up extension-injected attributes
                  const observer = new MutationObserver(function(mutations) {
                    mutations.forEach(function(mutation) {
                      if (mutation.type === 'attributes' && mutation.attributeName === 'bis_skin_checked') {
                        mutation.target.removeAttribute('bis_skin_checked');
                      }
                    });
                  });
                  observer.observe(document.documentElement, { attributes: true, subtree: true, attributeFilter: ['bis_skin_checked'] });
                  
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
