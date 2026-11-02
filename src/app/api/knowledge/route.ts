import { getCurrentUser } from "@/lib/auth";
import { getLibraryPage } from "@/features/knowledge/library-data";
import { parseLibraryQuery } from "@/features/knowledge/library";
export async function GET(request: Request) {
  const headers = { "Cache-Control": "private, no-store" };
  if (!(await getCurrentUser()))
    return Response.json(
      { error: "Cần đăng nhập để xem cẩm nang." },
      { status: 401, headers },
    );
  const params = new URL(request.url).searchParams;
  const query = parseLibraryQuery({
    q: params.get("q"),
    stage: params.get("stage"),
    page: params.get("page"),
  });
  return Response.json(await getLibraryPage(query), { headers });
}
