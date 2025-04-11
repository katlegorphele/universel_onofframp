import { sendCrossBorderEmail, sendCrossBorderToAdmin } from "@/app/utils/sendMail";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const body = await req.json();
    const { email, crossBorder} = body;
    
    try {       
        const { sendAmount, sendCurrency, receiveAmount, receiveCurrency, senderDetails, recieverDetails } = crossBorder;
        await sendCrossBorderEmail(email, sendAmount, sendCurrency, receiveAmount, receiveCurrency, senderDetails, recieverDetails);
        await sendCrossBorderToAdmin(sendAmount, sendCurrency, receiveAmount, receiveCurrency, senderDetails,recieverDetails);
        return NextResponse.json({ message: "Email sent successfully", status: 200, success: true });
    } catch (error) {
        console.error("Error sending email:", error);
        return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
    }
}
