import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  try {
    const clientType = req.headers.get("x-client-type");

    const backendRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(clientType && { "X-Client-Type": clientType }),
        },
        body: JSON.stringify({ email, password }),
      }
    );

    const data = await backendRes.json();

    const response = new NextResponse(JSON.stringify(data), {
      status: backendRes.status,
      headers: {
        "Content-Type": "application/json",
      },
    });

    const setCookieHeader = backendRes.headers.get("Set-Cookie");
    if (setCookieHeader) {
      response.headers.set("Set-Cookie", setCookieHeader);
    }

    return response;
  } catch (error) {
    console.error("Login API Route error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
