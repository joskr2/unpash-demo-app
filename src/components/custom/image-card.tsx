// src/components/custom/image-card.tsx
"use client";

import { Download, Heart, Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button"; // Asegura que la ruta a ui/button sea correcta

interface CardImage {
	id: string;
	url: string;
	alt: string;
	width: number;
	height: number;
	photographer: string;
}

interface ImageCardProps {
	image: CardImage;
}

export default function ImageCard({ image }: ImageCardProps) {
	const [isHovered, setIsHovered] = useState(false);

	// Función para manejar la descarga (ejemplo básico)
	const handleDownload = async () => {
		try {
			const response = await fetch(image.url); // O image.src.original para la mejor calidad
			const blob = await response.blob();
			const downloadUrl = window.URL.createObjectURL(blob);
			const link = document.createElement("a");
			link.href = downloadUrl;
			link.setAttribute("download", `${image.photographer}-${image.id}.jpg`); // Nombre del archivo
			document.body.appendChild(link);
			link.click();
			link.parentNode?.removeChild(link);
			window.URL.revokeObjectURL(downloadUrl);
		} catch (error) {
			console.error("Error downloading image:", error);
			alert("Could not download image.");
		}
	};

	return (
		<div
			className="group relative overflow-hidden rounded-lg"
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			<img
				src={image.url}
				alt={image.alt}
				// width y height aquí son para accesibilidad y aspect ratio si el CSS no lo maneja
				width={image.width}
				height={image.height}
				className="h-auto w-full object-cover transition-transform duration-300 group-hover:scale-105"
				// style={{ aspectRatio: `${image.width} / ${image.height}` }} // Si quieres forzar el aspect ratio original
				loading="lazy" // Carga diferida para imágenes que no están en el viewport inicial
			/>

			{isHovered && (
				<>
					<div className="absolute inset-0 bg-black bg-opacity-20 transition-opacity duration-300" />

					<div className="absolute top-4 right-4 flex gap-2">
						<Button
							size="icon"
							variant="ghost"
							className="h-8 w-8 rounded-md bg-white/80 text-gray-800 hover:bg-white hover:text-black"
							title="Like"
						>
							<Heart className="h-4 w-4" />
						</Button>
						<Button
							size="icon"
							variant="ghost"
							className="h-8 w-8 rounded-md bg-white/80 text-gray-800 hover:bg-white hover:text-black"
							title="Add to collection"
						>
							<Plus className="h-4 w-4" />
						</Button>
					</div>

					<div className="absolute bottom-4 left-4">
						<p className="font-medium text-sm text-white drop-shadow-sm">
							{image.photographer}
						</p>
					</div>

					<div className="absolute right-4 bottom-4">
						<Button
							size="icon"
							variant="ghost"
							className="h-8 w-8 rounded-md bg-white/80 text-gray-800 hover:bg-white hover:text-black"
							title="Download"
							onClick={handleDownload}
						>
							<Download className="h-4 w-4" />
						</Button>
					</div>
				</>
			)}
		</div>
	);
}
