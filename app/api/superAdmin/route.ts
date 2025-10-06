import { NextRequest, NextResponse } from "next/server";

// TODO: Implement super admin functionality
export async function POST(req: NextRequest) {
  return NextResponse.json({ message: "Super admin endpoint - implementation pending" }, { status: 501 });
}

export async function GET(req: NextRequest) {
  return NextResponse.json({ message: "Super admin endpoint - implementation pending" }, { status: 501 });
}
