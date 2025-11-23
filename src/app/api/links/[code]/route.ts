import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  _req: Request,
  context: { params: { code: string } }
) {
  const { code } = context.params;

  if (!code) {
    return NextResponse.json({ error: "Code missing" }, { status: 400 });
  }

  const link = await prisma.link.findUnique({ where: { code } });

  if (!link) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(link);
}

export async function DELETE(
  _req: Request,
  context: { params: { code: string } }
) {
  const { code } = context.params;

  if (!code) {
    return NextResponse.json({ error: "Code missing" }, { status: 400 });
  }

  const link = await prisma.link.findUnique({ where: { code } });

  if (!link) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.link.delete({ where: { code } });

  return NextResponse.json({ message: "Deleted" });
}
