"use client";

import { Download, Heart, Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";

interface ImageProps {
	image: {
		id: string;
		url: string;
		alt: string;
		width: number;
		height: number;
		photographer: string;
	};
}

export default function ImageCard({ image }: ImageProps) {
	const [isHovered, setIsHovered] = useState(false);

	return (
		<div
			className="group relative overflow-hidden rounded-lg"
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			<img
				src={image.url || "/placeholder.svg"}
				alt={image.alt}
				width={image.width}
				height={image.height}
				className="h-auto w-full object-cover transition-transform duration-300 group-hover:scale-105"
			/>

			{isHovered && (
				<>
					<div className="absolute inset-0 bg-black bg-opacity-20 transition-opacity duration-300" />

					<div className="absolute top-4 right-4 flex gap-2">
						<Button
							size="icon"
							variant="ghost"
							className="h-8 w-8 rounded-md bg-white/80 hover:bg-white"
						>
							<Heart className="h-4 w-4" />
						</Button>
						<Button
							size="icon"
							variant="ghost"
							className="h-8 w-8 rounded-md bg-white/80 hover:bg-white"
						>
							<Plus className="h-4 w-4" />
						</Button>
					</div>

					<div className="absolute bottom-4 left-4">
						<p className="font-medium text-sm text-white">
							{image.photographer}
						</p>
					</div>

					<div className="absolute right-4 bottom-4">
						<Button
							size="icon"
							variant="ghost"
							className="h-8 w-8 rounded-md bg-white/80 hover:bg-white"
						>
							<Download className="h-4 w-4" />
						</Button>
					</div>
				</>
			)}
		</div>
	);
}
