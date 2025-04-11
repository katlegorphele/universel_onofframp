import nodemailer from 'nodemailer';

const chainScanURLS = {
    'ETHEREUM': 'https://etherscan.io/tx/',
    'ARBITRUM': 'https://arbiscan.io/tx/',
    'BASE': 'https://blockscout.com/poa/xdai/tx/',
    'LISK': 'https://blockscout.lisk.com/tx/'
}

interface BankDetails {
    fullname: string;
    phoneNumber: string;
    paymentMethod: string;
    bankCode: string;
    address: string;
    accountNumber: string;
    country: string;
}

interface MobileWalletDetails {
    phoneNumber: string;
    network: string;
    accountName: string;
}

type SenderDetails = BankDetails | MobileWalletDetails;
type ReceiverDetails = BankDetails | MobileWalletDetails;

const bankCodes = [
    // Banks
    { value: '6320', label: 'ABSA' },
    { value: '4300', label: 'African Bank' },
    { value: '4620', label: 'BidVest Bank' },
    { value: '4700', label: 'Capitec' },
    { value: '4701', label: 'Capitec Business Bank' },
    { value: '6799', label: 'Discovery Bank' },
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
    token?: string | undefined,

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
        return false;
    }
}

export async function sendCrossBorderEmail(

    recipientEmail: string | undefined,
    sendAmount: number,
    sendCurrency: string,
    receiveAmount: number,
    receiveCurrency: string,
    senderDetails: ReceiverDetails,
    recieverDetails: SenderDetails,
) {
    if (!recipientEmail) return;
    try {
        const senderInfo = extractDetails(senderDetails);
        const receiverInfo = extractDetails(recieverDetails);

        const emailMessage = `
Dear valued customer,

We are processing your cross-border transaction with the following details:

Transaction Details:
- Amount Sent: ${sendAmount} ${sendCurrency}
- Amount Recieved: ${receiveAmount} ${receiveCurrency}

Your Details:
    ${senderInfo}

Receiver Details:
    ${receiverInfo}

Thank you for using our service
Regards
`.trim()

        await transporter.sendMail({
            from: 'UZAR Team',
            to: recipientEmail,
            subject: `Cross Border Transaction`,
            text: emailMessage
        });
    }
    catch (error) {
        console.error('Failed to send email notification:', error);
    }

}

export async function sendCrossBorderToAdmin(
    sendAmount: number,
    sendCurrency: string,
    receiveAmount: number,
    receiveCurrency: string,
    senderDetails: SenderDetails,
    receiverDetails: ReceiverDetails,
) {
    try {
        const senderInfo = extractDetails(senderDetails);
        const receiverInfo = extractDetails(receiverDetails);

        const emailMessage = `
Dear UZAR Team,
A new cross-border transaction has been initiated:

Transaction Details:
- Send Amount: ${sendAmount} ${sendCurrency}
- Receive Amount: ${receiveAmount} ${receiveCurrency}

Sender Details:
    ${senderInfo}

Receiver Details:
    ${receiverInfo}

Thank you for using our service
Regards
`.trim()

        await transporter.sendMail({
            from: 'UZAR Team',
            to: process.env.NEXT_PUBLIC_ADMIN_EMAIL,
            subject: `Cross Border Transaction`,
            text: emailMessage
        });

    } catch (error) {
        console.error('Failed to send email notification:', error);
    }
}

export async function sendWithdrawalTransactionEmail(
    recipientEmail: string | undefined,
    amount: number,
    token: string | undefined,
    txHash: string,
    chain: keyof typeof chainScanURLS,
    paymentMethod: string,
    bank: string,
    accountNumber: number,
    phoneNumber: string,
    transactionId?: string | undefined,
) {
    if (!recipientEmail) return;
    const blockscannerUrl = `${chainScanURLS[chain]}${txHash}`;
    const bankDetails = bankCodes.find((item) => item.value === bank);
    const bankName = bankDetails ? bankDetails.label : 'Unknown Bank';

    try {
        await transporter.sendMail({
            from: 'UZAR Team <noreply@uzar.com>',
            to: recipientEmail,
            subject: `${token} Sale Confirmation`,
            text: `
      Dear valued customer,
      
      Your sale of ${amount} ${token} has been successfully initiated.
      
      Transaction Details:
      - Amount Sold: ${amount} ${token}
      - Blockchain Receipt: ${blockscannerUrl} 
      - Transaction ID: ${transactionId}
      - Transaction Fee (1%): R${amount * 1 / 100}
      - You Recieve: R${amount - (amount * 1 / 100)}

      ${paymentMethod === 'BANK TRANSFER'
                    ? `
      Your payment will be processed to the following bank account:
      - Bank: ${bankName}
      - Account Number: ${accountNumber}
      `
                    : `
      Your payment code will be sent to the following phone number:
      - Phone Number: ${phoneNumber}
      `}

      Please note:
      - You can track your transaction on the blockchain using the provided link.
      - The processing time may vary depending on network conditions and banking/e-wallet procedures.
      - You will receive a confirmation once the payment has been successfully completed.
      
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
    token: string,
    txHash: string,
    chain: keyof typeof chainScanURLS,
    bank: string | undefined,
    email: string | undefined,
    accountNumber: number | undefined,
    userName: string | undefined,
    phoneNumber: string | undefined,
    paymentMethod: string,
    transactionFee: number,

) {
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
      Payment Method: ${paymentMethod}
      Account Number: ${accountNumber}
      Bank: ${bank} (${bankName})


      Transaction Details:
      Token: ${token}
      Amount: ${amount}
      Total Payout: R${amount - transactionFee}   
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
    if (!to) return;
    if (!txHash) return;


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

// Type guard functions
function isBankDetails(details: SenderDetails | ReceiverDetails): details is BankDetails {
    return (
        typeof details === 'object' &&
        details !== null &&
        'fullname' in details
    );
}

function getSenderName(details: SenderDetails): string {
    if (typeof details !== 'object' || details === null) {
        return 'Unknown Sender';
    }
    if (isBankDetails(details)) {
        return details.fullname;
    } else if ('accountName' in details) {
        return details.accountName;
    }
    return 'Unknown Sender';
}

function getSenderPhone(details: SenderDetails): string {
    if (typeof details !== 'object' || details === null) {
        return 'Unknown Phone';
    }
    return 'phoneNumber' in details ? details.phoneNumber : 'Unknown Phone';
}

//   function getSenderPaymentMethod(details: SenderDetails): string {
//     if (typeof details !== 'object' || details === null) {
//       return 'Unknown Payment Method';
//     }
//     if (isBankDetails(details)) {
//       return details.paymentMethod;
//     } else if ('network' in details) {
//       return details.network;
//     }
//     return 'Unknown Payment Method';
//   }

// Similar updates for receiver functions
function getReceiverName(details: ReceiverDetails): string {
    if (typeof details !== 'object' || details === null) {
        return 'Unknown Receiver';
    }
    if (isBankDetails(details)) {
        return details.fullname;
    } else if ('accountName' in details) {
        return details.accountName;
    }
    return 'Unknown Receiver';
}

function getReceiverPhone(details: ReceiverDetails): string {
    if (typeof details !== 'object' || details === null) {
        return 'Unknown Phone';
    }
    return 'phoneNumber' in details ? details.phoneNumber : 'Unknown Phone';
}

function getReceiverPaymentMethod(details: ReceiverDetails): string {
    if (typeof details !== 'object' || details === null) {
        return 'Unknown Payment Method';
    }
    if (isBankDetails(details)) {
        return details.paymentMethod;
    } else if ('network' in details) {
        return details.network;
    }
    return 'Unknown Payment Method';
}

function extractDetails(details: Record<string, any>): string {
    if (typeof details !== 'object' || details === null) {
        return 'No details provided';
    }
    const detailStrings = Object.entries(details).map(([key, value]) => {
        // Format key to be more readable (e.g., camelCase to Title Case)
        const formattedKey = key.replace(/([A-Z])/g, ' $1').trim().toLowerCase();
        return `${formattedKey.charAt(0).toUpperCase() + formattedKey.slice(1)}: ${value}`;
    });
    return detailStrings.join('\n');
}

