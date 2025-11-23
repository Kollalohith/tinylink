import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(_req: Request, context: { params: { code: string } }) {
  const { code } = context.params;

  if (!code) {
    return NextResponse.json({ error: "Code missing" }, { status: 400 });
  }

  try {
    // Find the link
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

    // Redirect user
    return NextResponse.redirect(link.targetUrl, 302);
  } catch (err) {
    console.error("REDIRECT ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
