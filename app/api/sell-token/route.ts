import { NextResponse } from "next/server";
import { sendWithdrawalTransactionEmail } from "@/app/utils/sendMail";

const test_mode = true;
let url_in_use:string;
let api_key_in_use:string;

if (test_mode) {
  url_in_use = "https://sandbox-api.kotanipay.io/api/v3";
  api_key_in_use = process.env.NEXT_PUBLIC_KOTANI_API_KEY_TEST || "";
} else {
  url_in_use = process.env.NEXT_PUBLIC_KOTANI_BASE_URL_PROD || "";
  api_key_in_use = process.env.NEXT_PUBLIC_KOTANI_API_KEY || "";
}

export async function POST(req: Request) {
  try {
    const {
      amount,
      email,
      bankDetails,
      currency
    } = await req.json();


    if (!amount || amount <= 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid amount. Please provide a valid amount to sell.",
        },
        { status: 400 }
      );
    }


    const transactionId = "txn_" + Math.random().toString(36).substr(2, 9);
    
    try {
      const url = `${url_in_use}/withdraw/v2/bank`;
      const options = {
        method: "POST",
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          authorization:
            `Bearer ${api_key_in_use}`,
        },
        body: JSON.stringify({
          bankDetails: {
            name: bankDetails.fullname,
            address: bankDetails.address,
            phoneNumber: bankDetails.phoneNumber,
            bankCode: bankDetails.bankCode,
            accountNumber: bankDetails.accountNumber,
            country: 'South Africa',
          },
          currency: currency,
          amount: amount,
          referenceId: transactionId,
        }),
      };

      
      const kotaniPayResponse = await fetch(url, options)
      .then((res) => res.json());

      if (email) {
        await sendWithdrawalTransactionEmail(
          email,
          amount,
          undefined,
          undefined,
          undefined,
          transactionId
        );
      }

      return NextResponse.json({
        success: true,
        message: kotaniPayResponse.message,
        transactionId,
        kotaniPayReference: kotaniPayResponse.data?.reference,
        amountReceived: amount,
      });
    } catch (kotaniError) {
      console.error("KotaniPay API error:", kotaniError);
      return NextResponse.json(
        {
          success: false,
          message: "An error occurred. Please try again.",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred. Please try again.",
      },
      { status: 500 }
    );
  }
}
