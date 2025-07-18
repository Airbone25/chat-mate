import PERSONAS from "@/prompts/personas";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    return NextResponse.json(PERSONAS);
  } catch (error) {
    console.error("Error fetching personas:", error);
    return NextResponse.json(
      { error: "Failed to fetch personas" },
      { status: 500 }
    );
  }
}