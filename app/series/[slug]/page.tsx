import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getSeries } from "@/lib/articles";
import { absoluteUrl } from "@/lib/site";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export async function generateStaticParams() {
  return getSeries().map((series) => ({
    slug: series.slug,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const series = getSeries().find((item) => item.slug === slug);

  if (!series) return {};

  return {
    title: series.name,
    description: series.description,
    alternates: {
      canonical: absoluteUrl(`/series/${series.slug}`),
    },
  };
}

export default async function SeriesDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const series = getSeries().find((item) => item.slug === slug);
  if (!series) notFound();
  return (
    <div className="page-shell narrow-collection">
      <header className="collection-header">
        <nav className="reader-breadcrumb" aria-label="パンくず">
          <Link href="/series">シリーズ</Link>
          <span aria-hidden>/</span>
          <span>{series.category}</span>
        </nav>
        <h1 className="page-heading">{series.name}</h1>
        <p className="page-subtitle">{series.description}</p>
      </header>
      <p className="reader-description">{series.goal}</p>
      {series.sections.map((section) => (
        <section className="series-collection" key={section.title}>
          <h2>{section.title}</h2>
          <p>{section.description}</p>
          <ol>
            {section.articles.map((article) => (
              <li key={article.slug}>
                <Link href={article.url}>
                  {article.title}
                  <span>{article.readingTimeMinutes}分</span>
                </Link>
              </li>
            ))}
          </ol>
        </section>
      ))}
      <Link className="text-link" href="/books">
        章立てで読むブックへ →
      </Link>
    </div>
  );
}
