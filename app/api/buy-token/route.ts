import { NextResponse } from "next/server";
import { sendPaymentTransactionEmail } from "@/app/utils/sendMail";


const test_mode = true;
let url_in_use: string;
let api_key_in_use: string;

if (test_mode) {
  url_in_use = "https://sandbox-api.kotanipay.io/api/v3";
  api_key_in_use = process.env.NEXT_PUBLIC_KOTANI_API_KEY_TEST || "";
} else {
  url_in_use = process.env.NEXT_PUBLIC_KOTANI_BASE_URL_PROD || "";
  api_key_in_use = process.env.NEXT_PUBLIC_KOTANI_API_KEY || "";
}

const generateTXNID = (tx_type: string) => {
  if (tx_type == 'mobile') {
    return "txn_mobile_" + Math.random().toString(36).substr(2, 9);
  } else {
    return "txn_bank_" + Math.random().toString(36).substr(2, 9);
  }
}




export async function POST(req: Request) {
  const { amount, currency, chain, receiveCurrency, walletAddress, mobileWallet, bankDetails, email, token } = await req.json();

  let tx_id
  if (currency == 'ZAR') {
    tx_id = generateTXNID('bank');
  } else {
    tx_id = generateTXNID('mobile');
  }

  const bankingCheckout = {
    fullName: "",
    phoneNumber: "",
    paymentMethod: ""
  }
  const mobileCheckout = {
    providerNetwork: "",
    phoneNumber: "",
    accountName: ""
  }

  if (currency === 'ZAR') {
    bankingCheckout.fullName = bankDetails.fullname;
    bankingCheckout.phoneNumber = bankDetails.phoneNumber;
    bankingCheckout.paymentMethod = bankDetails.paymentMethod;
  } else {
    mobileCheckout.providerNetwork = mobileWallet.providerNetwork;
    mobileCheckout.phoneNumber = mobileWallet.phoneNumber;
    mobileCheckout.accountName = mobileWallet.accountName;
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
          chain: chain.toUpperCase(),
          token: token,
          fiatAmount: amount,
          receiverAddress: walletAddress,
          referenceId: "txn_" + Math.random().toString(36).substr(2, 9)
        })
      };
      console.log(options)
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
          referenceId: "txn_" + Math.random().toString(36).substr(2, 9)
        })
      };

      console.log(options)
    }

    const KotaniPayResponse = await fetch(url, options)
      .then((res) => res.json())

    if (!KotaniPayResponse.success) {
      return NextResponse.json(
        {
          success: false,
          message: KotaniPayResponse.message,
          errordata: KotaniPayResponse.data,
        }
      );
    } 

    const redirectUrl = KotaniPayResponse.data?.redirectUrl;
    console.log('redirectUrl', redirectUrl);

    if (email) {
      await sendPaymentTransactionEmail(
        email,
        amount,
        currency,
        mobileWallet.phoneNumber,
        bankDetails,
        tx_id,
        redirectUrl
      );
      console.log('Email sent to', email);
    } else {
      console.log('No listed email')
    }

    return NextResponse.json({
      success: true,
      message: `Successfully initiated purchase of ${amount} ${token} using ${currency !== "ZAR"
          ? `Mobile Money (${mobileWallet.networkProvider})`
          : `bank account (${bankDetails.paymentMethod})`
        }.`,
      tx_id,
      amountReceived: amount,
      redirectUrl,
    })

  } catch (error) {
    console.error(error)
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred. Please try again.",
      },
      { status: 500 }
    );
  }
}
