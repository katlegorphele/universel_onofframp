import nodemailer from 'nodemailer';

const chainScanURLS = {
    'ETHEREUM' : 'https://etherscan.io/tx/',
    'ARBITRUM' : 'https://arbiscan.io/tx/',
    'BASE' : 'https://blockscout.com/poa/xdai/tx/',
    'LISK' : 'https://sepolia.scrollscan.com/tx/'
}

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
    kotaniPayReference?: string | undefined,
    

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
      ${currency !== "ZAR"
                    ? `Payment method: Mobile Money`
                    : `Payment method: Bank Transfer`
                }
      
      Transaction ID: ${transactionId}
      KotaniPay Reference: ${kotaniPayReference}
      
      You will receive a confirmation once the payment is processed.
      
      Thank you for using our service!
      
      Best regards,
      The UZAR Team
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

