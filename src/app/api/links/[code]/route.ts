import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  _req: Request,
  context: { params: { code: string } }
) {
  const code = context.params.code;

  if (!code) {
    return NextResponse.json({ error: "Code missing" }, { status: 400 });
  }

  try {
    const link = await prisma.link.findUnique({
      where: { code },
    });

    if (!link) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await prisma.link.update({
      where: { code },
      data: {
        totalClicks: { increment: 1 },
        lastClickedAt: new Date(),
      },
    });

    return NextResponse.redirect(link.targetUrl, 302);
  } catch (error) {
    console.error("REDIRECT ERROR:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
