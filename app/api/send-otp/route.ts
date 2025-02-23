import { NextResponse } from "next/server";
import { sendOTP } from "@/app/utils/sendMail";

export async function POST(req: Request) {

    try {

        const { email } = await req.json();

        if (!email) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid email. Please provide a valid email address.",
                },
                { status: 400 }
            );
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const sent = await sendOTP(email, otp);

        if (sent) {
            return NextResponse.json(
                {
                    success: true,
                    message: "OTP sent successfully.",
                    otp,
                },
                { status: 200 }
            );
        } else {
            return NextResponse.json(
                {
                    success: false,
                    message: "Failed to send OTP. Please try again.",
                },
                { status: 500 }
            );
        }

    } catch (error) {
        console.error("Error in send-otp route:", error);
        return NextResponse.json(
            {
                success: false,
                message: "An error occurred. Please try again.",
            },
            { status: 500 }
        );
    }
}