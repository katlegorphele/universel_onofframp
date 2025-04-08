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
    }
}

export async function sendCrossBorderEmail(

    // crossBorder: {
    //     sendCurrency: '',
    //     receiveCurrency: '',
    //     sendAmount: 0,
    //     receiveAmount: 0,
    //     exchangeRate: 0,
    //     totalFee: 0,
    //     senderDetails: {},
    //     recieverDetails: {},
    //     senderPaymentMethod: '',
    //     recieverPaymentMethod: '',
    //   },
    recipientEmail: string | undefined,
    sendAmount: number,
    sendCurrency: string,
    recieverDetails: ReceiverDetails ,
    senderDetails: SenderDetails ,


) {
    if (!recipientEmail) return;
    try {
        await transporter.sendMail({
            from: 'UZAR Team',
            to: process.env.NEXT_PUBLIC_ADMIN_EMAIL,
            subject: `Cross Border Transaction`,
            text: `
            
            New cross-border transaction initiated:

      Regards

      UZAR Team
            `

        })
    }
    catch (error) {
        console.error('Failed to send email notification:', error);
    }

}

export async function sendCrossBorderToUs(
    sendAmount: number,
    sendCurrency: string,
    receiveAmount: number,
    receiveCurrency: string,
    senderBankDetails: {
        fullname: string;
        phoneNumber: string;
        paymentMethod: string;
        bankCode: string;
        address: string;
        accountNumber: string;
        country: string;
    } | undefined,
    senderMobileWallet: {
        phoneNumber: string;
        network: string;
        accountName: string;
    } | undefined,
    recieverBankDetails: {
        fullname: string;
        phoneNumber: string;
        paymentMethod: string;
        bankCode: string;
        address: string;
        accountNumber: string;
        country: string;
    } | undefined,
    recieverMobileWallet: {
        phoneNumber: string;
        network: string;
        accountName: string;
    } | undefined,
) {
    try {
        await transporter.sendMail({
            from: 'UZAR Team',
            to: process.env.NEXT_PUBLIC_ADMIN_EMAIL,
            subject: `Cross Border Transaction`,
            text: `
      New cross-border transaction initiated:

      Sender Details:
      Name: ${senderBankDetails?.fullname || senderMobileWallet?.accountName}
      Phone Number: ${senderBankDetails?.phoneNumber || senderMobileWallet?.phoneNumber}
      Payment Method: ${senderBankDetails?.paymentMethod || senderMobileWallet?.network}

      Receiver Details:
      Name: ${recieverBankDetails?.fullname || recieverMobileWallet?.accountName}
      Phone Number: ${recieverBankDetails?.phoneNumber || recieverMobileWallet?.phoneNumber}
      Payment Method: ${recieverBankDetails?.paymentMethod || recieverMobileWallet?.network}

      Transaction Details:
      - Amount Sent: ${sendAmount} ${sendCurrency}
      - Amount Received: ${receiveAmount} ${receiveCurrency}

      Regards

      UZAR Team
            `
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

