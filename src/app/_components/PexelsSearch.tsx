"use client";

import { useState } from "react";
import { api } from "~/trpc/react";

export function PexelsSearch() {
	const [searchTerm, setSearchTerm] = useState("animals");
	const [submittedQuery, setSubmittedQuery] = useState("animals");

	const { data, isLoading, error, refetch } = api.pexels.searchPhotos.useQuery(
		{ query: submittedQuery, perPage: 6 },
		{
			enabled: !!submittedQuery,
		},
	);

	const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setSubmittedQuery(searchTerm);
	};

	return (
		<div className="mt-10 w-full max-w-4xl text-white">
			<h2 className="mb-4 text-center font-semibold text-3xl">
				Search Photos on Pexels
			</h2>
			<form
				onSubmit={handleSearchSubmit}
				className="mb-6 flex justify-center gap-2"
			>
				<input
					type="text"
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					placeholder="e.g., nature, cities..."
					className="w-full max-w-xs rounded-md bg-white/10 px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[hsl(280,100%,70%)]"
				/>
				<button
					type="submit"
					className="rounded-md bg-[hsl(280,100%,70%)] px-6 py-2 font-semibold text-white transition hover:bg-[hsl(280,100%,60%)]"
					disabled={isLoading}
				>
					{isLoading ? "Searching..." : "Search"}
				</button>
			</form>

			{isLoading && <p className="text-center">Loading images...</p>}
			{error && (
				<p className="text-center text-red-400">Error: {error.message}</p>
			)}

			{data && data.photos.length > 0 && (
				<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
					{data.photos.map((photo) => (
						<div
							key={photo.id}
							className="overflow-hidden rounded-lg bg-white/10 shadow-lg"
						>
							<img
								src={photo.src.medium}
								alt={photo.alt || `Photo by ${photo.photographer}`}
								className="aspect-square h-auto w-full object-cover"
							/>
							<div className="p-3 text-xs">
								<p>
									By:{" "}
									<a
										href={photo.photographer_url}
										target="_blank"
										rel="noopener noreferrer"
										className="hover:text-[hsl(280,100%,70%)] hover:underline"
									>
										{photo.photographer}
									</a>
								</p>
							</div>
						</div>
					))}
				</div>
			)}
			{data && data.photos.length === 0 && !isLoading && (
				<p className="text-center">No results found for "{submittedQuery}".</p>
			)}
		</div>
	);
}
