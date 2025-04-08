// Static configuration data for the OnOffRamp form

export const currencyProviders: { [key: string]: string[] } = {
  KES: ['MPESA'],
  GHS: ['MTN', 'VODAFONE'],
  ZMW: ['MTN', 'AIRTEL',],
  XOF: ['MTN', 'ORANGE'],
  XAF: ['MTN', 'ORANGE'],
  CDF: ['AIRTEL', 'ORANGE'],
  TZS: ['AIRTEL', 'TIGO'],
  MWK: ['AIRTEL', 'TNM'],
  UGX: ['MTN'],
  RWF: ['MTN', 'AIRTEL'],
  ZAR: ['BANK'],
};

export const bankCodes = [
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

export const currencyOptions = [
  // EDIT HERE TO ADD MORE CURRENCIES
  { value: 'ZAR', label: 'South African Rand (ZAR)' },
  { value: 'CDF', label: 'Congolese Franc (CFD)' },
  { value: 'GHS', label: 'Ghanaian Cedi (GHS)' },
  { value: 'KES', label: 'Kenyan Shillings (KES)' },
  { value: "MWK", label: "Malawian Kwacha ()" },
  { value: 'RWF', label: 'Rwandan Franc (RWF)' },
  { value: 'TZS', label: 'Tanzanian Shilling (TZS)' },
  { value: 'UGX', label: 'Ugandan Shilling (UGX)' },
  { value: 'XAF', label: 'C African CFA Franc (XAF)' },
  { value: 'XOF', label: 'W African CFA Franc (XOF)' },
  { value: 'ZMW', label: 'Zambian Kwacha (ZMW)' },
  // { value: 'NGN', label: 'Nigerian Naira' },
];

export const chainOptions = [
  // ALL SUPPORTED CHAINS
  { value: 'ARBITRUM', label: 'ARBITRUM' },
  // { value: 'ETHEREUM', label: 'ETHEREUM' },
  { value: 'BASE', label: 'BASE' },
  { value: 'LISK', label: 'LISK' },
];

export const receiveCurrencyOptions = [
  // AVAILABLE TOKENS
  { value: 'UZAR', label: 'UZAR' },
  { value: 'USDC', label: 'USDC' },
  // { value: 'USDT', label: 'USDT' },
];

export const paymentMethodsZAR = ['CARD', 'BANK'];
export const paymentMethodsZARforSelling = ['E-WALLET / CASH SEND', 'BANK TRANSFER'];
