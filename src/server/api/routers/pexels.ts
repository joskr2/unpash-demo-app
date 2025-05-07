import { z } from "zod";
import { env } from "~/env.js";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export interface PexelsPhoto {

  id: number;
  width: number;
  height: number;
  url: string;
  photographer: string;
  photographer_url: string;
  photographer_id: number;
  avg_color: string;
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
  liked: boolean;
  alt: string;
}

export interface PexelsCollectionResponse {
  photos: PexelsPhoto[];
  page: number;
  per_page: number;
  total_results: number;
  prev_page?: string;
  next_page?: string;
}

export const pexelsRouter = createTRPCRouter({
  searchPhotos: publicProcedure
    .input(
      z.object({
        query: z.string().min(1),
        perPage: z.number().min(1).max(80).optional().default(15),
        page: z.number().min(1).optional().default(1),
      })
    )
    .query(async ({ input }): Promise<PexelsCollectionResponse> => {
      const { query, perPage, page } = input;
      const pexelsApiUrl = env.PEXELS_API_URL;
      const pexelsApiKey = env.PEXELS_API_KEY;

      const searchUrl = new URL(`${pexelsApiUrl}search`);
      searchUrl.searchParams.append("query", query);
      searchUrl.searchParams.append("per_page", perPage.toString());
      searchUrl.searchParams.append("page", page.toString());

      try {
        const response = await fetch(searchUrl.toString(), {
          headers: {
            Authorization: pexelsApiKey,
          },
        });

        if (!response.ok) {
          const errorBody = await response.text();
          console.error(
            `Pexels API (search) error: ${response.status} ${response.statusText}`,
            errorBody
          );
          throw new Error(
            `Error fetching from Pexels (search): ${response.statusText}`
          );
        }
        return response.json() as Promise<PexelsCollectionResponse>;
      } catch (error) {
        console.error("Failed to fetch searched photos from Pexels:", error);
        if (error instanceof Error) {
          throw new Error(
            `Could not fetch searched photos from Pexels: ${error.message}`
          );
        }
        throw new Error(
          "An unknown error occurred while fetching searched photos from Pexels."
        );
      }
    }),

  getCuratedPhotos: publicProcedure
    .input(
      z.object({
        perPage: z.number().min(1).max(80).optional().default(15),
        page: z.number().min(1).optional().default(1),
      })
    )
    .query(async ({ input }): Promise<PexelsCollectionResponse> => {
      const { perPage, page } = input;
      const pexelsApiUrl = env.PEXELS_API_URL;
      const pexelsApiKey = env.PEXELS_API_KEY;

      const curatedUrl = new URL(`${pexelsApiUrl}curated`);
      curatedUrl.searchParams.append("per_page", perPage.toString());
      curatedUrl.searchParams.append("page", page.toString());

      try {
        const response = await fetch(curatedUrl.toString(), {
          headers: {
            Authorization: pexelsApiKey,
          },
        });

        if (!response.ok) {
          const errorBody = await response.text();
          console.error(
            `Pexels API (curated) error: ${response.status} ${response.statusText}`,
            errorBody
          );
          throw new Error(
            `Error fetching from Pexels (curated): ${response.statusText}`
          );
        }
        return response.json() as Promise<PexelsCollectionResponse>;
      } catch (error) {
        console.error("Failed to fetch curated photos from Pexels:", error);
        if (error instanceof Error) {
          throw new Error(
            `Could not fetch curated photos from Pexels: ${error.message}`
          );
        }
        throw new Error(
          "An unknown error occurred while fetching curated photos from Pexels."
        );
      }
    }),

  getPhotoById: publicProcedure
    .input(
      z.object({
        id: z.number().int().positive(),
      })
    )
    .query(async ({ input }): Promise<PexelsPhoto> => {
      const { id } = input;
      const pexelsApiUrl = env.PEXELS_API_URL;
      const pexelsApiKey = env.PEXELS_API_KEY;

      const photoUrl = new URL(`${pexelsApiUrl}photos/${id}`);

      try {
        const response = await fetch(photoUrl.toString(), {
          headers: {
            Authorization: pexelsApiKey,
          },
        });

        if (!response.ok) {
          const errorBody = await response.text();
          console.error(
            `Pexels API (photo by ID) error: ${response.status} ${response.statusText}`,
            errorBody
          );
          throw new Error(
            `Error fetching from Pexels (photo by ID): ${response.statusText}`
          );
        }
        return response.json() as Promise<PexelsPhoto>;
      } catch (error) {
        console.error(
          `Failed to fetch photo with ID ${id} from Pexels:`,
          error
        );
        if (error instanceof Error) {
          throw new Error(
            `Could not fetch photo (ID: ${id}) from Pexels: ${error.message}`
          );
        }
        throw new Error(
          `An unknown error occurred while fetching photo (ID: ${id}) from Pexels.`
        );
      }
    }),
});
