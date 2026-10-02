import { searchProducts } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const q = new URL(request.url).searchParams.get("q")?.trim() ?? "";
  if (q.length < 2) return Response.json({ results: [] });

  try {
    const results = await searchProducts(q, 6);
    return Response.json({
      results: results.map((r) => ({
        slug: r.slug,
        name: r.name,
        arabicName: r.arabicName,
        image: r.images[0],
        price: r.price,
        compareAtPrice: r.compareAtPrice,
        family: r.family,
        concentration: r.concentration,
      })),
    });
  } catch (error) {
    console.error("search failed", error);
    return Response.json({ results: [], error: "Search is temporarily unavailable." }, { status: 500 });
  }
}
