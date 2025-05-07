import Link from "next/link";
// src/app/page.tsx
import Header from "~/components/custom/header";
import Hero from "~/components/custom/hero";
import ImageGridClient from "~/components/custom/image-grid-client";
import Loading from "~/components/custom/loading";
import type { PexelsCollectionResponse } from "~/server/api/routers/pexels"; // Importar el tipo
import { api } from "~/trpc/server";

export default async function Home({
	searchParams,
}: {
	searchParams?: { query?: string; filter?: string };
}) {
	const userSearchQuery = searchParams?.query?.trim();
	const filterType = searchParams?.filter; // "popular", "curated"

	let initialPhotosData: PexelsCollectionResponse;
	let dataSourceType: "search" | "curated" = "search"; // Para pasar a ImageGridClient
	let activeQueryOrFilter = "popular"; // Para pasar a ImageGridClient

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
			activeQueryOrFilter = "curated"; // Representa el tipo de filtro
			dataSourceType = "curated";
			initialPhotosData = await api.pexels.getCuratedPhotos({
				// Llamada al nuevo endpoint
				page: 1,
				perPage: 15,
			});
		} else {
			// Por defecto es "popular" (que trataremos como una búsqueda)
			activeQueryOrFilter = "popular";
			dataSourceType = "search";
			initialPhotosData = await api.pexels.searchPhotos({
				query: "popular", // Búsqueda del término "popular"
				page: 1,
				perPage: 15,
			});
		}
	} catch (error) {
		console.error("Error fetching initial photos in page.tsx:", error);
		// Fallback a datos vacíos en caso de error
		initialPhotosData = { photos: [], page: 1, per_page: 0, total_results: 0 };
		// Podrías querer establecer un estado de error aquí y mostrarlo en la UI
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
							className={`font-medium text-sm hover:text-gray-600 ${
								(!filterType || filterType === "popular") && !userSearchQuery
									? "text-black underline"
									: "text-gray-700"
							}`}
							scroll={false}
						>
							Popular
						</Link>
						{/* El botón "Latest" ahora apunta al filtro "curated" */}
						<Link
							href="/?filter=curated"
							className={`font-medium text-sm hover:text-gray-600 ${
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
					queryOrFilterKey={activeQueryOrFilter} // Esta clave ayuda a react-query a diferenciar queries
				/>
			</div>
		</main>
	);
}
