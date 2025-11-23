import { NextResponse, NextRequest } from "next/server";
import  prisma  from "@/lib/prisma";
import { validateCode, validateUrl, generateRandomCode } from "@/lib/validation";

export async function GET() {
  const links = await prisma.link.findMany({
    orderBy: { createdAt: "desc" },
  });

  const base = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const formatted = links.map(l => ({
    ...l,
    shortUrl: `${base}/${l.code}`,
  }));

  return NextResponse.json(formatted);
}


export async function POST(req: NextRequest) {
  const { longUrl, code: customCode } = await req.json();

  if (!longUrl || !validateUrl(longUrl)) {
    return NextResponse.json(
      { error: "Invalid URL. Must start with http:// or https://" },
      { status: 400 }
    );
  }

  let code = customCode?.trim();

  if (code) {
    if (!validateCode(code)) {
      return NextResponse.json(
        { error: "Code must match [A-Za-z0-9]{6,8}" },
        { status: 400 }
      );
    }

    const existing = await prisma.link.findUnique({ where: { code } });
    if (existing) {
      return NextResponse.json(
        { error: "Code already exists" },
        { status: 409 }
      );
    }
  } else {
    
    let unique = false;
    while (!unique) {
      code = generateRandomCode(6);
      const exists = await prisma.link.findUnique({ where: { code } });
      if (!exists) unique = true;
    }
  }


const link = await prisma.link.create({
  data: {
    code,
    targetUrl: longUrl,
  },
});


const shortUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/${code}`;

return NextResponse.json(
  {
    ...link,
    shortUrl,
  },
  { status: 201 }
);
}