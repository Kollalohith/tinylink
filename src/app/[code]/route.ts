import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(_req: Request, context: any) {
  try {
    const { code } = await context.params;  // ✅ FIXED — await the params

    // Fetch the link
    const link = await prisma.link.findUnique({
      where: { code },
    });

    if (!link) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Update click stats
    await prisma.link.update({
      where: { code },
      data: {
        totalClicks: { increment: 1 },
        lastClickedAt: new Date(),
      },
    });

    return NextResponse.redirect(link.targetUrl, 302);

  } catch (err) {
    console.error("REDIRECT ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
