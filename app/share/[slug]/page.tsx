import { getReportBySlug } from "@/lib/supabase";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import SharedReportView from "./SharedReportView";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const report = await getReportBySlug(params.slug);

  if (!report) {
    return { title: "Report Not Found" };
  }

  return {
    title: `Dating Audit: ${report.scoreLabel} (${report.dateabilityScore}/100) | Should I Date This Man?`,
    description: report.funnyOneLiner,
    openGraph: {
      title: `Should I Date This Man? Score: ${report.dateabilityScore}/100`,
      description: `${report.verdict} ${report.shareableCaption}`,
    },
  };
}

export default async function SharePage({ params }: Props) {
  const report = await getReportBySlug(params.slug);

  if (!report) {
    notFound();
  }

  return <SharedReportView report={report} slug={params.slug} />;
}
