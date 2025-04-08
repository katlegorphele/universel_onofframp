import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const {crossBorder} = await req.json();
        console.log(crossBorder)

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