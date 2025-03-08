// components/Layout.tsx
import Head from "next/head";
import React from "react";

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  keywords?: string;
  author?: string;
  favicon?: string;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  title = "Next.js Application",
  description = "A Next.js application with TypeScript",
  keywords = "next.js, react, typescript",
  author = "fvtrx",
  favicon = "/favicon.ico",
}) => {
  return (
    <>
      <Head>
        {/* Basic Meta Tags */}
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="author" content={author} />

        {/* Favicon */}
        <link rel="icon" href={favicon} />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </Head>
      <main>{children}</main>
    </>
  );
};

export default Layout;
