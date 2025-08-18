import type { Metadata } from "next";
import type { ReactNode } from "react";
import { generateMetadata, seoTemplates } from "@/lib/seo/metadata";

export const metadata: Metadata = generateMetadata(seoTemplates.blog);

export default function BlogLayout({ children }: { children: ReactNode }) {
  return children;
}
