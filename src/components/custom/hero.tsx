// src/components/custom/hero.tsx
"use client";

import { Camera, Search } from "lucide-react";
import Image from "next/image"; // Si usas imágenes estáticas aquí
import Link from "next/link";
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
			router.push("/"); // O `/?filter=popular`
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

						<div className="flex items-center pt-2">
							<span className="text-gray-500 text-sm">Supported by</span>
							<Link href="#" className="ml-2">
								<svg /* Tu SVG del logo de Unsplash */
									width="120"
									height="24"
									viewBox="0 0 120 24"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
									className="h-6"
								>
									<title>Unsplash Logo</title>
									<path
										d="M114.593 9.93v7.275h-1.298V9.93h-3.522V8.67h8.342V9.93h-3.522zm-8.113 0v2.625h4.95v1.26h-4.95v3.39h-1.298V8.67h6.757V9.93h-5.459zm-5.165 7.275l-3.89-5.355c-.223-.3-.446-.63-.631-.945h-.037c.037.33.037.66.037.99v5.31h-1.298V8.67h1.41l3.816 5.28c.223.3.446.615.631.93h.037c-.037-.33-.037-.66-.037-.975V8.67h1.298v8.535h-1.336zm-12.332-7.275v2.625h4.95v1.26h-4.95v3.39h-1.298V8.67h6.757V9.93h-5.459zm-8.41 7.275h-1.298V8.67h1.298v8.535zm-4.21 0h-6.087V8.67h1.298v7.275h4.79v1.26zm-8.78 0h-1.298V8.67h1.298v8.535zm-3.075-4.26c0 2.76-1.968 4.38-4.605 4.38-2.637 0-4.456-1.74-4.456-4.23 0-2.595 1.93-4.35 4.604-4.35 2.675 0 4.457 1.8 4.457 4.2zm-7.716.09c0 1.845 1.187 3.09 3.186 3.09 1.968 0 3.155-1.29 3.155-3.15 0-1.695-1.076-3.09-3.155-3.09-2.08 0-3.186 1.35-3.186 3.15zm-3.372 4.17h-1.298V9.93h-3.521V8.67h8.34V9.93h-3.521v7.275zm-8.113 0h-1.298V8.67h1.298v8.535zm-4.21 0h-6.087V8.67h1.298v7.275h4.79v1.26zm-11.417.12c-2.6 0-4.456-1.74-4.456-4.23 0-2.595 1.93-4.35 4.604-4.35 1.373 0 2.266.3 2.934.72l-.372 1.125c-.594-.33-1.373-.615-2.525-.615-1.856 0-3.298 1.095-3.298 3.075 0 1.845 1.187 3.105 3.26 3.105 1.002 0 1.893-.225 2.6-.615l.297 1.125c-.631.39-1.707.66-3.044.66zm-8.447-4.29c0 2.76-1.967 4.38-4.604 4.38-2.637 0-4.456-1.74-4.456-4.23 0-2.595 1.93-4.35 4.604-4.35 2.675 0 4.456 1.8 4.456 4.2zm-7.716.09c0 1.845 1.187 3.09 3.186 3.09 1.968 0 3.156-1.29 3.156-3.15 0-1.695-1.077-3.09-3.156-3.09-2.08 0-3.186 1.35-3.186 3.15zm-7.902 4.08h-1.299V8.67h3.745c2.266 0 3.596.765 3.596 2.52 0 1.74-1.373 2.73-3.559 2.73h-2.483v3.285zm0-4.5h2.34c1.373 0 2.377-.435 2.377-1.53 0-1.035-.891-1.35-2.303-1.35h-2.414v2.88z"
										fill="#000"
									/>
								</svg>
							</Link>
						</div>
					</div>

					<div className="hidden lg:col-span-2 lg:block">
						<div className="relative overflow-hidden rounded-lg">
							<div className="grid grid-cols-2 gap-1">
								<div className="relative aspect-square overflow-hidden">
									<Image
										src="/placeholder.svg?height=400&width=400" // Reemplaza con una imagen real o usa Pexels aquí también
										alt="Featured image"
										width={400}
										height={400}
										className="h-full w-full object-cover"
										priority // Para LCP si es visible inmediatamente
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
