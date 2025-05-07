"use client";

import { Camera, Search } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import type React from "react";
import { useEffect, useState } from "react";

export default function Hero() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [currentSearchInput, setCurrentSearchInput] = useState(
		searchParams.get("query") || "",
	);

	const handleFormSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const query = currentSearchInput.trim();
		if (query) {
			router.push(`/?query=${encodeURIComponent(query)}`);
		} else {
			router.push("/");
		}
	};

	useEffect(() => {
		setCurrentSearchInput(searchParams.get("query") || "");
	}, [searchParams]);

	return (
		<section className="relative bg-white py-16 text-black md:py-20">
			<div className="container mx-auto px-4 md:px-6">
				<div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-5">
					<div className="space-y-6 lg:col-span-3">
						<h1 className="font-bold text-5xl text-black md:text-6xl">
							Unsplash
						</h1>
						<div className="space-y-2">
							<p className="text-gray-800 text-xl">
								The internet's source for visuals.
							</p>
							<p className="text-gray-800 text-xl">
								Powered by creators everywhere.
							</p>
						</div>

						<form
							onSubmit={handleFormSubmit}
							className="relative mt-8 max-w-full"
						>
							<div className="relative flex items-center">
								<Search className="absolute left-4 h-5 w-5 text-gray-500" />
								<input
									type="search"
									placeholder="Search photos and illustrations"
									className="w-full rounded-lg bg-gray-100 py-4 pr-4 pl-12 text-base text-black focus:outline-none focus:ring-2 focus:ring-gray-200"
									value={currentSearchInput}
									onChange={(e) => setCurrentSearchInput(e.target.value)}
								/>
								<button
									type="button"
									className="absolute right-4"
									aria-label="Visual search"
								>
									<Camera className="h-5 w-5 text-gray-500" />
								</button>
							</div>
						</form>

						<div className="flex items-center pt-2" />
					</div>

					<div className="hidden lg:col-span-2 lg:block">
						<div className="relative overflow-hidden rounded-lg">
							<div className="grid grid-cols-2 gap-1">
								<div className="relative aspect-square overflow-hidden">
									<Image
										src="/placeholder.svg?height=400&width=400"
										alt="Featured image"
										width={400}
										height={400}
										className="h-full w-full object-cover"
										priority
									/>
								</div>
								<div className="grid grid-rows-2 gap-1">
									<div className="relative aspect-[4/2] overflow-hidden">
										<Image
											src="/placeholder.svg?height=200&width=400"
											alt="Featured image"
											width={400}
											height={200}
											className="h-full w-full object-cover"
										/>
									</div>
									<div className="relative aspect-[4/2] overflow-hidden">
										<Image
											src="/placeholder.svg?height=200&width=400"
											alt="Featured image"
											width={400}
											height={200}
											className="h-full w-full object-cover"
										/>
									</div>
								</div>
							</div>
							<div className="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black/50 to-transparent p-4">
								<h3 className="font-bold text-white text-xl">Unhinged</h3>
								<p className="text-sm text-white/80">52 images</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
