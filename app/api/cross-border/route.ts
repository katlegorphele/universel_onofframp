import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {

        return NextResponse.json({
            success: true,
        })

    } catch (error) {
        console.error("Error parsing request body:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Invalid request body.",
            },
            { status: 400 }
        );
    }
}