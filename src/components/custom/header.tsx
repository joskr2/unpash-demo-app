import { Menu, Search } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

export default function Header() {
	return (
		<header className="sticky top-0 z-50 w-full border-b bg-white">
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
						<span className="hidden font-bold md:inline-block">Unsplash</span>
					</Link>
					<div className="relative hidden items-center md:flex">
						<Search className="absolute left-3 h-4 w-4 text-gray-500" />
						<input
							type="search"
							placeholder="Search photos"
							className="w-64 rounded-lg bg-gray-100 py-2 pr-4 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
						/>
					</div>
				</div>
				<div className="flex items-center gap-4">
					<nav className="hidden items-center gap-6 md:flex">
						<Link href="#" className="font-medium text-sm hover:text-gray-600">
							Explore
						</Link>
						<Link href="#" className="font-medium text-sm hover:text-gray-600">
							Advertise
						</Link>
						<Link href="#" className="font-medium text-sm hover:text-gray-600">
							Blog
						</Link>
					</nav>
					<div className="hidden items-center gap-2 md:flex">
						<Button variant="ghost" size="sm">
							Log in
						</Button>
						<Button size="sm">Sign up</Button>
					</div>
					<Button variant="ghost" size="icon" className="md:hidden">
						<Menu className="h-5 w-5" />
						<span className="sr-only">Toggle menu</span>
					</Button>
				</div>
			</div>
		</header>
	);
}
