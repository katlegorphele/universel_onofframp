import { NextResponse } from "next/server";

export async function POST(req: Request) {

    try {
        const {
            amount,
            bankDetails,
            walletAddress,
            email,
            currency
        } = await req.json()

        console.log(`
            Amount: ${amount}
            Bank Details: ${bankDetails}
            Wallet Details: ${walletAddress}
            Email: ${email}
            Currency: ${currency}
            `)

        return NextResponse.json({
            success: true,
        })


    } catch (error) {
        console.error(error)
    }
    
}