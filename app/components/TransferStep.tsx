import React, { useState } from 'react'
import { useOnOffRampContext } from '../context/OnOffRampContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';


const TransferStep = () => {
    const { formData, setFormData } = useOnOffRampContext();
    const [addressTo, setAddressTo] = useState('')
    const [amount, setAmount] = useState(0)
    const [email, setEmail] = useState('')
    const [txHash, setTXHash] = useState('')
    const [walletAddress, setWalletAddress] = useState('')
    const [loading, setLoading] = useState(false)

    const handleTransfer = async () => {
        // perform transfer actions here
        alert('Transfer functionality loading')
    }



    return (
        <div className="p-6 rounded-lg shadow-md bg-gray-100">
            <label htmlFor="senderWalletAddress" className="block mb-2 text-sm font-medium text-gray-900">
                Enter Your Wallet Address
            </label>
            <Input
                type="text"
                id="walletAddress"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                className="mb-4"
            />

            <label htmlFor="recepientWalletAddress" className="block mb-2 text-sm font-medium text-gray-900">
                Enter Recepient Wallet Address
            </label>
            <Input
                type="text"
                id="recepientWalletAddress"
                value={addressTo}
                onChange={(e) => setAddressTo(e.target.value)}
                className="mb-4"
            />

            <label htmlFor="amount" className="block mb-2 text-sm font-medium text-gray-900">
                Amount To Transfer
            </label>
            <Input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="mb-4"
            />

            <label htmlFor="recepientWalletAddress" className="block mb-2 text-sm font-medium text-gray-900">
                Email Address
            </label>
            <Input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mb-4"
            />

            <Button onClick={handleTransfer} disabled={loading}>
                {loading ? 'Processing...' : 'Confirm & Proceed'}
                {/* Next: Transfer Funds */}
            </Button>


        </div>
    )
}

export default TransferStep