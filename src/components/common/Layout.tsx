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

        <style>
          @import
          url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
        </style>
      </Head>
      <main>{children}</main>
    </>
  );
};

export default Layout;
