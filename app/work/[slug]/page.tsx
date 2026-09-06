import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProjectBySlug, PROJECTS } from "@/lib/projects";
import { ProjectDetailPage } from "@/components/projects/ProjectDetailPage";

/* ------------------------------------------------------------------
   /work/[slug] — one detail page per project in lib/projects.ts.
   ------------------------------------------------------------------
   The three known slugs are statically rendered at build time
   (generateStaticParams). Unknown slugs 404 — nothing is generated or
   served on demand, so the workers bundle stays fully static.
------------------------------------------------------------------- */

interface WorkDetailProps {
  slug: string;
}

export function generateStaticParams(): WorkDetailProps[] {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return { title: "Not found — Julius Matro" };
  return {
    title: `${project.name} — Julius Matro`,
    description: project.tagline,
    openGraph: {
      type: "website",
      url: `https://julius-matro-portfolio.juliusmatro01.workers.dev/work/${slug}`,
      title: `${project.name} — Julius Matro`,
      description: project.tagline,
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: "Julius Matro — Software, engineered for every platform.",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.name} — Julius Matro`,
      description: project.tagline,
      images: ["/og-image.png"],
    },
  };
}

export default async function ProjectPage({
  params,
}: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  return <ProjectDetailPage project={project} />;
}