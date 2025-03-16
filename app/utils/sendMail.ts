import nodemailer from 'nodemailer';

const chainScanURLS = {
    'ETHEREUM' : 'https://etherscan.io/tx/',
    'ARBITRUM' : 'https://arbiscan.io/tx/',
    'BASE' : 'https://blockscout.com/poa/xdai/tx/',
    'LISK' : 'https://blockscout.lisk.com/tx/'
}

const bankCodes = [
  // Banks
  { value: '6320', label: 'ABSA' },
  { value: '4300', label: 'African Bank'},
  { value: '4620', label: 'BidVest Bank'},
  { value: '4700', label: 'Capitec' },
  { value: '4701', label: 'Capitec Business Bank'},
  { value: '6799', label: 'Discovery Bank'},
  { value: '2500', label: 'FNB' },
  { value: '5800', label: 'Investec Bank Limited' },
  { value: '1987', label: 'Nedbank' },
  { value: '5100', label: 'Standard Bank' },
  { value: '6789', label: 'TymeBank' },
];

const transporter = nodemailer.createTransport({
    service: "gmail",
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.NEXT_PUBLIC_BURNER_USERNAME,
        pass: process.env.NEXT_PUBLIC_BURNER_PASSWORD
    }
});

export async function sendOTP(email: string | undefined, otp: string | undefined) {
    if (!email) return;

    try {
        await transporter.sendMail({
            from: 'UZAR Team',
            to: email,
            subject: 'UZAR OTP',
            text: `
      Dear valued customer,
      
      Your OTP is ${otp}
      
      Thank you for using our service!
      
      Best regards,
      The UZAR Team
            `
        });
        return true;
    } catch (error) {
        console.error('Failed to send email notification:', error);
        return false;
    }
}

export async function sendPaymentTransactionEmail(
    recipientEmail: string | undefined,
    amount: number,
    currency: string | undefined,
    transactionId?: string | undefined,
    paymentURL?: string | undefined,
    token?:string | undefined,

) {
    if (!recipientEmail) return;

    try {
        await transporter.sendMail({
            from: 'UZAR Team',
            to: recipientEmail,
            subject: `${token} Purchase Confirmation`,
            text: `
      Dear valued customer,
      
      Your purchase of ${amount} ${token} has been initiated.
      ${currency !== "ZAR"
                    ? `Payment method: Mobile Money`
                    : `Payment method: Bank Transfer`
                }
      
      Transaction ID: ${transactionId}

      To complete the transaction please visit the link provided
        ${paymentURL}   
      
      Thank you for using our service!
      
      Best regards,
      The UZAR Team
            `
        });
    } catch (error) {
        console.error('Failed to send email notification:', error);
    }
}

export async function sendWithdrawalTransactionEmail(
    recipientEmail: string | undefined,
    amount: number,
    currency: string | undefined,
    token: string | undefined,
    transactionId?: string | undefined,
    

) {
    if (!recipientEmail) return;

    try {
        await transporter.sendMail({
            from: 'UZAR Team',
            to: recipientEmail,
            subject: `${token} Sale Confirmation`,
            text: `
      Dear valued customer,
      
      Your sale of ${amount} ${token} has been initiated.
      
      Transaction Details:      
      Token Sold: ${token}
      Amount: ${amount}
      Transaction Fee (1%): ${amount * 1/100}
      You Recieve: ${currency}${amount - (amount * 1/100)}
      Transaction ID: ${transactionId}
      
      
      Thank you for using our service!
      
      Best regards,
      The UZAR Team
            `
        });
    } catch (error) {
        console.error('Failed to send email notification:', error);
    }
}

export async function sendWithdrawalToUs(
    amount: number,
    token: string | undefined,
    txHash: string,
    chain: keyof typeof chainScanURLS,
    bank:string | undefined,
    email: string | undefined,
    accountNumber : number | undefined,
    userName: string | undefined,
    phoneNumber: string | undefined,
    

) {
    const fee = amount * (1/100)
    if (!bank) {
        return
    }

    try {

        const bankDetails = bankCodes.find((item) => item.value === bank);
        const bankName = bankDetails ? bankDetails.label : 'Unknown Bank';

        await transporter.sendMail({
            from: 'UZAR Team',
            to: process.env.NEXT_PUBLIC_ADMIN_EMAIL,
            subject: `${token} Sale`,
            text: `
      New ${token} sale initiated:

      Customer Details:
      Name: ${userName}
      Email: ${email}
      Phone: ${phoneNumber}
      
      Bank Details:
      Account Number: ${accountNumber}
      Bank: ${bank} (${bankName})
      Email: ${email}

      Transaction Details:
      
      Token: ${token}
      Amount: ${amount}
      Total Payout: R${amount - fee}   
      Blockchain Receipt: ${chainScanURLS[chain]}${txHash}

      Regards

      UZAR Team
            
      `
        });
    } catch (error) {
        console.error('Failed to send email notification:', error);
    }
}

export async function sendTransferEmail(
    // needs amount, to
    recipientEmail: string | undefined,
    amount: number,
    to: string | undefined,
    txHash: string | undefined,
    token: string | undefined,
    chain: keyof typeof chainScanURLS
) {
    if (!recipientEmail) return;
    if(!to) return;
    if(!txHash) return;


    try {
        await transporter.sendMail({
            from: 'UZAR Team',
            to: recipientEmail,
            subject: `${token} Transfer Confirmation`,
            text: `
    Dear valued customer,
      
    You have successfully transferred ${amount} ${token} to ${to}.
    
    View blockchain receipt:
    ${chainScanURLS[chain]}${txHash}
    
    Thank you for using our service!
    
    Best regards,
    The UZAR Team
        `
        });
    } catch (error) {
        console.error('Failed to send email notification:', error);
    }
}

