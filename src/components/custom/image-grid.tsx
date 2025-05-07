"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import ImageCard from "./image-card";

interface Image {
	id: string;
	url: string;
	alt: string;
	width: number;
	height: number;
	photographer: string;
}

function Loading() {
	return <div>Loading...</div>;
}

export default function ImageGrid() {
	const [images, setImages] = useState<Image[]>([]);
	const [page, setPage] = useState(1);
	const [loading, setLoading] = useState(false);
	const observer = useRef<IntersectionObserver | null>(null);
	const lastImageRef = useRef<HTMLDivElement | null>(null);

	// Mock function to generate random images
	const generateMockImages = (page: number): Image[] => {
		return Array.from({ length: 15 }, (_, i) => {
			const id = `${page}-${i}`;
			const width = 1200;
			const height = Math.floor(Math.random() * 800) + 600;
			return {
				id,
				url: `/placeholder.svg?height=${height}&width=${width}`,
				alt: `Random image ${id}`,
				width,
				height,
				photographer: `Photographer ${id}`,
			};
		});
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	const loadMoreImages = useCallback(() => {
		setLoading(true);
		// Simulate API call delay
		setTimeout(() => {
			const newImages = generateMockImages(page);
			setImages((prev) => [...prev, ...newImages]);
			setPage((prev) => prev + 1);
			setLoading(false);
		}, 1000);
	}, [page]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		// Load initial images
		loadMoreImages();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (loading) return;

		if (observer.current) observer.current.disconnect();

		const callback = (entries: IntersectionObserverEntry[]) => {
			if (entries[0]?.isIntersecting) {
				loadMoreImages();
			}
		};

		observer.current = new IntersectionObserver(callback, {
			rootMargin: "100px",
		});

		if (lastImageRef.current) {
			observer.current.observe(lastImageRef.current);
		}
	}, [loading, loadMoreImages]);

	// Divide images into 3 columns for masonry layout
	const getColumnImages = (columnIndex: number) => {
		return images.filter((_, index) => index % 3 === columnIndex);
	};

	return (
		<section className="container mx-auto px-4 py-8 md:px-6">
			<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
				{[0, 1, 2].map((columnIndex) => (
					<div key={columnIndex} className="flex flex-col gap-4">
						{getColumnImages(columnIndex).map((image, index, array) => {
							const isLast = index === array.length - 1 && columnIndex === 2;
							return (
								<div key={image.id} ref={isLast ? lastImageRef : null}>
									<ImageCard image={image} />
								</div>
							);
						})}
					</div>
				))}
			</div>
			{loading && <Loading />}
		</section>
	);
}
