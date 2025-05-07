import { z } from "zod";
import { env } from "~/env.js";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

interface PexelsPhoto {
	id: number;
	width: number;
	height: number;
	url: string;
	photographer: string;
	photographer_url: string;
	src: {
		original: string;
		large2x: string;
		large: string;
		medium: string;
		small: string;
		portrait: string;
		landscape: string;
		tiny: string;
	};
	alt: string;
}

interface PexelsSearchResponse {
	photos: PexelsPhoto[];
	page: number;
	per_page: number;
	total_results: number;
	next_page?: string;
}

export const pexelsRouter = createTRPCRouter({
	searchPhotos: publicProcedure
		.input(
			z.object({
				query: z.string().min(1),
				perPage: z.number().min(1).max(80).optional().default(15),
				page: z.number().min(1).optional().default(1),
			}),
		)
		.query(async ({ input }) => {
			const { query, perPage, page } = input;
			const pexelsApiUrl = env.PEXELS_API_URL;
			const pexelsApiKey = env.PEXELS_API_KEY;

			const searchUrl = new URL(`${pexelsApiUrl}search`);
			searchUrl.searchParams.append("query", query);
			searchUrl.searchParams.append("per_page", perPage.toString());
			searchUrl.searchParams.append("page", page.toString());

			try {
				console.log(`Fetching Pexels API: ${searchUrl.toString()}`);
				const response = await fetch(searchUrl.toString(), {
					headers: {
						Authorization: pexelsApiKey,
					},
				});

				if (!response.ok) {
					const errorBody = await response.text();
					console.error(
						`Pexels API error: ${response.status} ${response.statusText}`,
						errorBody,
					);
					throw new Error(
						`Error fetching from Pexels: ${response.status} ${response.statusText}`,
					);
				}

				const data = (await response.json()) as PexelsSearchResponse;
				return data;
			} catch (error) {
				console.error("Failed to fetch photos from Pexels:", error);
				if (error instanceof Error) {
					throw new Error(
						`Could not fetch photos from Pexels: ${error.message}`,
					);
				}
				throw new Error(
					"An unknown error occurred while fetching photos from Pexels.",
				);
			}
		}),

	// getCuratedPhotos: publicProcedure
	//   .input(z.object({
	//     perPage: z.number().min(1).max(80).optional().default(15),
	//     page: z.number().min(1).optional().default(1),
	//   }))
	//   .query(async ({ input }) => { /* ... lógica similar ... */ })
});
