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
  queryOrFilterKey: string;
}

export default function ImageGridClient({
  initialPageData,
  dataSourceType,
  queryOrFilterKey,
}: ImageGridClientProps) {
  const observer = useRef<IntersectionObserver | null>(null);
  const lastImageRef = useRef<HTMLDivElement | null>(null);

  const commonInfiniteQueryOptions = {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  };

  // @ts-ignore-next-line
  const searchPhotosQueryResult = api.pexels.searchPhotos.useInfiniteQuery(
    {
      query: queryOrFilterKey,
      perPage: 15,
    },
    {
      ...commonInfiniteQueryOptions,
      getNextPageParam: (lastPage: PexelsCollectionResponse) => {
        if (!lastPage.next_page || lastPage.photos.length === 0)
          return undefined;
        if (
          lastPage.page * lastPage.per_page >= lastPage.total_results &&
          lastPage.total_results > 0
        )
          return undefined;
        return lastPage.page + 1;
      },
      initialData: () => {
        if (
          dataSourceType === "search" &&
          initialPageData?.photos?.length > 0
        ) {
          return {
            pages: [initialPageData],
            pageParams: [initialPageData.page],
          };
        }
        return undefined;
      },
      enabled: dataSourceType === "search",
    }
  );

  // @ts-ignore-next-line
  const curatedPhotosQueryResult = api.pexels.getCuratedPhotos.useInfiniteQuery(
    {
      perPage: 15,
    },
    {
      ...commonInfiniteQueryOptions,
      getNextPageParam: (lastPage: PexelsCollectionResponse) => {
        if (!lastPage.next_page || lastPage.photos.length === 0)
          return undefined;
        return lastPage.page + 1;
      },
      initialData: () => {
        if (
          dataSourceType === "curated" &&
          initialPageData?.photos?.length > 0
        ) {
          return {
            pages: [initialPageData],
            pageParams: [initialPageData.page],
          };
        }
        return undefined;
      },
      enabled: dataSourceType === "curated",
    }
  );

  const activeQueryResult =
    dataSourceType === "search"
      ? searchPhotosQueryResult
      : curatedPhotosQueryResult;

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = activeQueryResult;

  const allPhotosFromPages: TPexelsPhoto[] =
    data?.pages.flatMap(
      (pageData: PexelsCollectionResponse) => pageData.photos
    ) ?? [];
  const cardImages: CardImage[] = allPhotosFromPages.map(
    adaptPexelsPhotoToCardImage
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (isFetchingNextPage || !hasNextPage) return;

    const currentObserver = observer.current;
    if (currentObserver) {
      currentObserver.disconnect();
    }

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    });

    if (lastImageRef.current) {
      observer.current.observe(lastImageRef.current);
    }

    return () => {
      if (currentObserver) {
        currentObserver.disconnect();
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, lastImageRef, data]);

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

  if (cardImages.length === 0 && !isLoading && !isFetchingNextPage) {
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
            {getColumnImages(columnIndex).map((image, index) => {
              const isTheVeryLastImageInList =
                cardImages.length > 0 &&
                image.id === cardImages[cardImages.length - 1]?.id;
              return (
                <div
                  key={`${image.id}-${index}`}
                  ref={isTheVeryLastImageInList ? lastImageRef : null}
                >
                  <ImageCard image={image} />
                </div>
              );
            })}
          </div>
        ))}
      </div>
      {isFetchingNextPage && (
        <div className="py-8 text-center">
          <LoadingSpinner />
        </div>
      )}
      {!hasNextPage && cardImages.length > 0 && !isFetchingNextPage && (
        <p className="py-8 text-center text-gray-500">
          You've reached the end!
        </p>
      )}
    </section>
  );
}
