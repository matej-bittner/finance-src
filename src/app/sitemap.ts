import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${process.env.NEXT_PUBLIC_APP_URL}`,
      lastModified: new Date(),
      alternates: {
        languages: {
          cs: `${process.env.NEXT_PUBLIC_APP_URL}/cs`,
          en: `${process.env.NEXT_PUBLIC_APP_URL}/en`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_APP_URL}/blog`,
      lastModified: new Date(),
      alternates: {
        languages: {
          cs: `${process.env.NEXT_PUBLIC_APP_URL}/cs/blog`,
          en: `${process.env.NEXT_PUBLIC_APP_URL}/en/blog`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_APP_URL}/login`,
      lastModified: new Date(),
      alternates: {
        languages: {
          cs: `${process.env.NEXT_PUBLIC_APP_URL}/cs/login`,
          en: `${process.env.NEXT_PUBLIC_APP_URL}/en/login`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_APP_URL}/register`,
      lastModified: new Date(),
      alternates: {
        languages: {
          cs: `${process.env.NEXT_PUBLIC_APP_URL}/cs/register`,
          en: `${process.env.NEXT_PUBLIC_APP_URL}/en/register`,
        },
      },
    },
  ];
}
