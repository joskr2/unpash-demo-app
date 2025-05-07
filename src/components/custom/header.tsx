// src/components/custom/header.tsx
"use client";

import { Menu, Search } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react"; // useEffect para sincronizar con URL
import { Button } from "../ui/button"; // Asegura que la ruta a ui/button sea correcta

export default function Header() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [headerSearchInput, setHeaderSearchInput] = useState(
		searchParams.get("query") || "",
	);

	const handleHeaderSearch = (e: React.FormEvent) => {
		e.preventDefault();
		const query = headerSearchInput.trim();
		if (query) {
			router.push(`/?query=${encodeURIComponent(query)}`);
		} else {
			router.push("/"); // O `/?filter=popular` si es tu vista por defecto sin query
		}
	};

	// Sincronizar el input si el parámetro de la URL cambia
	useEffect(() => {
		setHeaderSearchInput(searchParams.get("query") || "");
	}, [searchParams]);

	return (
		<header className="sticky top-0 z-50 w-full border-b bg-white text-black">
			<div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
				<div className="flex items-center gap-6">
					<Link href="/" className="flex items-center gap-2">
						<svg
							viewBox="0 0 32 32"
							className="h-8 w-8"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<title>Unsplash Logo</title>
							<rect width="32" height="32" rx="5" fill="black" />
							<path
								d="M10 9H22V23H10V9Z"
								fill="white"
								stroke="white"
								strokeWidth="2"
							/>
						</svg>
						<span className="hidden font-bold text-black md:inline-block">
							Unsplash
						</span>
					</Link>
					<form
						onSubmit={handleHeaderSearch}
						className="relative hidden items-center md:flex"
					>
						<Search className="absolute left-3 h-4 w-4 text-gray-500" />
						<input
							type="search"
							placeholder="Search photos"
							className="w-64 rounded-lg bg-gray-100 py-2 pr-4 pl-10 text-black text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
							value={headerSearchInput}
							onChange={(e) => setHeaderSearchInput(e.target.value)}
						/>
					</form>
				</div>
				<div className="flex items-center gap-4">
					<nav className="hidden items-center gap-6 md:flex">
						<Link
							href="/?filter=popular"
							className="font-medium text-gray-700 text-sm hover:text-black"
						>
							Explore
						</Link>
						<Link
							href="#"
							className="font-medium text-gray-700 text-sm hover:text-black"
						>
							Advertise
						</Link>
						<Link
							href="#"
							className="font-medium text-gray-700 text-sm hover:text-black"
						>
							Blog
						</Link>
					</nav>
					<div className="hidden items-center gap-2 md:flex">
						<Button
							variant="ghost"
							size="sm"
							className="text-black hover:bg-gray-100"
						>
							Log in
						</Button>
						<Button size="sm" className="bg-black text-white hover:bg-gray-800">
							Sign up
						</Button>
					</div>
					<Button
						variant="ghost"
						size="icon"
						className="text-black hover:bg-gray-100 md:hidden"
					>
						<Menu className="h-5 w-5" />
						<span className="sr-only">Toggle menu</span>
					</Button>
				</div>
			</div>
		</header>
	);
}
