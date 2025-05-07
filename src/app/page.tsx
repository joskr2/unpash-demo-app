import Link from "next/link";
import Header from "~/components/custom/header";
import Hero from "~/components/custom/hero";
import ImageGridClient from "~/components/custom/image-grid-client";

import type { PexelsCollectionResponse } from "~/server/api/routers/pexels";
import { api } from "~/trpc/server";

export default async function Home({
  searchParams,
}: {
  searchParams?: { query?: string; filter?: string };
}) {
  const userSearchQuery = searchParams?.query?.trim();
  const filterType = searchParams?.filter;

  let initialPhotosData: PexelsCollectionResponse;
  let dataSourceType: "search" | "curated" = "search";
  let activeQueryOrFilter = "popular";

  try {
    if (userSearchQuery) {
      activeQueryOrFilter = userSearchQuery;
      dataSourceType = "search";
      initialPhotosData = await api.pexels.searchPhotos({
        query: userSearchQuery,
        page: 1,
        perPage: 15,
      });
    } else if (filterType === "curated") {
      activeQueryOrFilter = "curated_photos_feed"; 
      dataSourceType = "curated";
      initialPhotosData = await api.pexels.getCuratedPhotos({
        page: 1,
        perPage: 15,
      });
    } else {
      activeQueryOrFilter = "popular_photos_feed"; 
      dataSourceType = "search"; 
      initialPhotosData = await api.pexels.searchPhotos({
        query: "popular",
        page: 1,
        perPage: 15,
      });
    }
  } catch (error) {
    console.error("Error fetching initial photos in page.tsx:", error);
    initialPhotosData = {
      photos: [],
      page: 1,
      per_page: 15,
      total_results: 0,
      next_page: undefined,
      prev_page: undefined,
    };
  }

  return (
    <main className="min-h-screen bg-white text-black">
      <Header />
      <Hero />
      <div className="container mx-auto px-4 py-8 md:px-6">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="font-bold text-2xl">Explore</h2>
          <div className="flex gap-4">
            <Link
              href="/?filter=popular" 
              className={`text-sm font-medium hover:text-gray-600 ${
                (!filterType || filterType === "popular") && !userSearchQuery
                  ? "text-black underline"
                  : "text-gray-700"
              }`}
              scroll={false}
            >
              Popular
            </Link>
            <Link
              href="/?filter=curated"
              className={`text-sm font-medium hover:text-gray-600 ${
                filterType === "curated" && !userSearchQuery
                  ? "text-black underline"
                  : "text-gray-700"
              }`}
              scroll={false}
            >
              Latest (Curated)
            </Link>
          </div>
        </div>
        <ImageGridClient
          initialPageData={initialPhotosData}
          dataSourceType={dataSourceType}
          queryOrFilterKey={activeQueryOrFilter}
        />
      </div>
    </main>
  );
}
