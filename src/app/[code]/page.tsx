import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function RedirectPage(props: { params: Promise<{ code: string }> }) {
  const { code } = await props.params;

  const link = await prisma.link.findUnique({
    where: { code },
  });

  if (!link) {
    return <h1>404 - Link not found</h1>;
  }

  await prisma.link.update({
    where: { code },
    data: {
      totalClicks: { increment: 1 },
      lastClickedAt: new Date(),
    },
  });

  redirect(link.targetUrl);
}
