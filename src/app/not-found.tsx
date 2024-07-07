import React from "react";
import { Manrope } from "next/font/google";
import Link from "next/link";
const manrope = Manrope({ subsets: ["latin"] });

const NotFound = () => {
  return (
    <html>
      <body
        className={`${manrope.className}`}
        style={{
          display: "flex",
          flexDirection: "column",
          paddingBottom: "4px",
          backgroundColor: "beige",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          margin: "0",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            paddingBottom: "4px",
          }}
        >
          <p style={{ fontSize: "32px", margin: 0, fontWeight: 800 }}>ERROR</p>
          <p style={{ fontSize: "42px", margin: 0, fontWeight: 800 }}>404</p>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",

            alignItems: "center",
            gap: "4px",
          }}
        >
          <Link href="/" style={{ color: "black" }}>
            Back to homepage
          </Link>
          <Link href="/" style={{ color: "black" }}>
            Zpět na hlavní stránku
          </Link>
        </div>
      </body>
    </html>
  );
};

export default NotFound;
