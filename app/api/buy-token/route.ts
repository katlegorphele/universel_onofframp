import { NextResponse } from "next/server";
import { sendPaymentTransactionEmail } from "@/app/utils/sendMail";

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
      currency,
      chain,
      receiveCurrency,
      walletAddress,
      mobileWallet,
      bankDetails,
      email,
    } = await req.json();
    let bankingCheckout = {}
    let mobileCheckout = {}
    // Generate transaction ID
    const transactionId = "txn_" + Math.random().toString(36).substr(2, 9);

    

    if (currency == 'ZAR') {
      // CREATE BANK CHECKOUT OBJECT
      bankingCheckout = {paymentMethod: bankDetails.paymentMethod, fullName: bankDetails.fullname, phoneNumber: bankDetails.phoneNumber}
      // Execute 
    } else {
      mobileCheckout = {providerNetwork: mobileWallet.providerNetwork, phoneNumber: mobileWallet.phoneNumber, accountName: mobileWallet.accountName}
    }


    // Validate required fields
    if (!amount || amount <= 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Please provide a valid amount.",
        },
        { status: 400 }
      );
    }

    if (!bankDetails.name || !bankDetails.phoneNumber) {
      return NextResponse.json(
        {
          success: false,
          message: "Please provide your name and phone number.",
        },
        { status: 400 }
      );
    }


    
    

    try {
      const url = `${url_in_use}/onramp`;
      let options = {}

      if (currency == 'ZAR') {
        options = {
          method: 'POST',
          headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            authorization: `Bearer ${api_key_in_use}`
          },
          body: JSON.stringify({
            bankCheckout: bankingCheckout,
            currency: currency,
            chain: chain,
            token: receiveCurrency,
            fiatAmount: amount,
            receiverAddress: walletAddress,
            referenceId: transactionId
          })
        };
      } else {
        options = {
          method: 'POST',
          headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            authorization: `Bearer ${api_key_in_use}`
          },
          body: JSON.stringify({
            mobileMoney: mobileCheckout,
            currency: currency,
            chain: chain,
            token: receiveCurrency,
            fiatAmount: amount,
            receiverAddress: walletAddress,
            referenceId: transactionId
          })
        };
      }
      

      const KotaniPayResponse = await fetch(url, options)
      .then((res) => res.json())

      
      if (!KotaniPayResponse.success) {
        return NextResponse.json(
          {
            success: false,
            message: KotaniPayResponse.message,
          }
        );
      }
      
      const redirectUrl = KotaniPayResponse.data?.redirectUrl;
      console.log('redirectUrl', redirectUrl);


      // Send email notification
      if (email) {
        await sendPaymentTransactionEmail(
          email,
          amount,
          currency,
          mobileWallet.phoneNumber,
          bankDetails,
          transactionId
        );
      }

      console.log('KotaniPayResponse', KotaniPayResponse);

      

      return NextResponse.json({
        success: true,
        message: `Successfully initiated purchase of ${amount} UZAR using ${
          currency === "KES"
            ? `Mobile Money (${mobileWallet.networkProvider})`
            : `bank account (${bankDetails.paymentMethod})`
        }.`,
        transactionId,
        // kotaniPayReference: kotaniPayResponse.data?.reference,
        amountReceived: amount,
        redirectUrl,
      });
    } catch (kotaniError) {
      console.error("KotaniPay API error:", kotaniError);
      return NextResponse.json(
        {
          success: false,
          message: "Failed to process payment. Please try again.",
          error:
            kotaniError instanceof Error
              ? kotaniError.message
              : "Unknown error",
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
