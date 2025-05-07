// src/components/custom/image-grid-client.tsx
"use client";

import { useEffect, useRef } from "react";
import type {
  PexelsCollectionResponse,
  PexelsPhoto as TPexelsPhoto,
} from "~/server/api/routers/pexels";
import { api } from "~/trpc/react";
import ImageCard from "./image-card";
import LoadingSpinner from "./loading";

interface CardImage {
  id: string;
  url: string;
  alt: string;
  width: number;
  height: number;
  photographer: string;
}

const adaptPexelsPhotoToCardImage = (pexelsPhoto: TPexelsPhoto): CardImage => ({
  id: pexelsPhoto.id.toString(),
  url: pexelsPhoto.src.large2x || pexelsPhoto.src.medium,
  alt: pexelsPhoto.alt || `Photo by ${pexelsPhoto.photographer}`,
  width: pexelsPhoto.width,
  height: pexelsPhoto.height,
  photographer: pexelsPhoto.photographer,
});

interface ImageGridClientProps {
  initialPageData: PexelsCollectionResponse;
  dataSourceType: "search" | "curated";
  queryOrFilterKey: string; // Será la query de búsqueda o una clave como "curated"
}

export default function ImageGridClient({
  initialPageData,
  dataSourceType,
  queryOrFilterKey,
}: ImageGridClientProps) {
  const observer = useRef<IntersectionObserver | null>(null);
  const lastImageRef = useRef<HTMLDivElement | null>(null);

  // Hook para fotos de búsqueda
  const searchPhotosQuery = api.pexels.searchPhotos.useQuery(
    {
      query: queryOrFilterKey,
      perPage: 15,
    },
    {
      enabled: dataSourceType === "search",
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      // No paginación aquí, solo una página
      initialData: dataSourceType === "search" ? initialPageData : undefined,
    }
  );

  // Hook para fotos curadas
  const curatedPhotosQuery = api.pexels.getCuratedPhotos.useQuery(
    {
      perPage: 15,
    },
    {
      enabled: dataSourceType === "curated",
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      initialData: dataSourceType === "curated" ? initialPageData : undefined,
    }
  );

  // Seleccionar los datos y funciones del hook activo
  const activeQuery =
    dataSourceType === "search" ? searchPhotosQuery : curatedPhotosQuery;
  const { data, isLoading, error } = activeQuery;

  const allPhotos = data?.photos ?? [];
  const cardImages: CardImage[] = allPhotos.map(adaptPexelsPhotoToCardImage);

  // Mostrar loading si el hook activo está cargando Y no hay imágenes aún
  // (considerando que initialPageData pudo haber fallado en el servidor)
  if (isLoading && cardImages.length === 0) {
    return (
      <div className="py-8 text-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8 text-center text-red-500">
        Error: {error.message}
      </div>
    );
  }

  if (cardImages.length === 0 && !isLoading) {
    return (
      <div className="py-8 text-center text-gray-500">
        No images found for "{queryOrFilterKey}".
      </div>
    );
  }

  const getColumnImages = (columnIndex: number) =>
    cardImages.filter((_, index) => index % 3 === columnIndex);

  return (
    <section className="mx-auto px-0 py-8 md:px-0">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((columnIndex) => (
          <div key={columnIndex} className="flex flex-col gap-4">
            {getColumnImages(columnIndex).map((image, index, columnArray) => {
              const isLastImageInItsColumn = index === columnArray.length - 1;
              // Mejorar la lógica para el observer, podría ser el último elemento general
              const isLastOverall =
                cardImages.length > 0 &&
                image.id === cardImages[cardImages.length - 1]?.id;

              return (
                <div key={image.id} ref={isLastOverall ? lastImageRef : null}>
                  <ImageCard image={image} />
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </section>
  );
}
