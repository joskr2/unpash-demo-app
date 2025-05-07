// src/app/page.tsx
import Link from "next/link";
import { PexelsSearch } from "~/app/_components/PexelsSearch"; // <--- 1. IMPORTA EL COMPONENTE
import { LatestPost } from "~/app/_components/post";
import { HydrateClient, api } from "~/trpc/server";

export default async function Home() {
	const hello = await api.post.hello({ text: "from tRPC" });

	// `prefetch` es útil si `LatestPost` usa `useSuspenseQuery` o si quieres
	// que los datos estén disponibles inmediatamente para la hidratación.
	void api.post.getLatest.prefetch();

	return (
		<HydrateClient>
			{" "}
			{/* Necesario para que LatestPost (Client Component) se hidrate con los datos pre-fetched */}
			<main className="flex min-h-screen flex-col items-center bg-gradient-to-b from-[#2e026d] to-[#15162c] py-16 text-white">
				{" "}
				{/* Ajustado py y removido justify-center para permitir scroll si el contenido es largo */}
				<div className="container flex flex-col items-center gap-12 px-4">
					{" "}
					{/* Removido justify-center */}
					<h1 className="font-extrabold text-5xl tracking-tight sm:text-[5rem]">
						Create <span className="text-[hsl(280,100%,70%)]">T3</span> App
					</h1>
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
						<Link
							className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20"
							href="https://create.t3.gg/en/usage/first-steps"
							target="_blank"
						>
							<h3 className="font-bold text-2xl">First Steps →</h3>
							<div className="text-lg">
								Just the basics - Everything you need to know to set up your
								database and authentication.
							</div>
						</Link>
						<Link
							className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20"
							href="https://create.t3.gg/en/introduction"
							target="_blank"
						>
							<h3 className="font-bold text-2xl">Documentation →</h3>
							<div className="text-lg">
								Learn more about Create T3 App, the libraries it uses, and how
								to deploy it.
							</div>
						</Link>
					</div>
					<div className="flex flex-col items-center gap-2">
						<p className="text-2xl text-white">
							{hello ? hello.greeting : "Loading tRPC query..."}
						</p>
					</div>
					<LatestPost />
					{/* --- 2. AÑADE TU COMPONENTE PexelsSearch AQUÍ --- */}
					<PexelsSearch />
					{/* ------------------------------------------------- */}
				</div>
			</main>
		</HydrateClient>
	);
}
