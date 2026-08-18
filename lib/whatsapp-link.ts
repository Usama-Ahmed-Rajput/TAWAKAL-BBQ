export interface OrderWhatsAppDetails {
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  orderType: string;
  deliveryAddress?: string | null;
  deliveryArea?: string | null;
  area?: string | null;
  sector?: string | null;
  houseFlatNo?: string | null;
  landmark?: string | null;
  subtotal: number;
  deliveryFee?: number;
  totalAmount: number;
  paymentMethod?: string;
  createdAt?: string | Date;
  orderItems: Array<{
    name: string;
    variantName?: string | null;
    quantity: number;
    price: number;
  }>;
  branch?: {
    name?: string;
    phone?: string;
    whatsapp?: string;
  } | null;
}

export function formatPhoneForDisplay(phone: string): string {
  if (!phone) return '';
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('92') && digits.length === 12) {
    return `+${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5)}`;
  }
  if (digits.startsWith('03') && digits.length === 11) {
    return `+92 ${digits.slice(1, 4)} ${digits.slice(4)}`;
  }
  if (digits.length === 10 && digits.startsWith('3')) {
    return `+92 ${digits.slice(0, 3)} ${digits.slice(3)}`;
  }
  return phone.startsWith('+') ? phone : `+${phone}`;
}

export function parseAddressFields(order: OrderWhatsAppDetails) {
  let area = order.area || order.deliveryArea || '';
  let sector = order.sector || '';
  let houseFlatNo = order.houseFlatNo || '';
  let landmark = order.landmark || '';

  const fullAddr = order.deliveryAddress || '';

  // Clean area if it contains parenthetical sectors like "(Sector A, B, C)"
  area = area.replace(/\s*\([^)]*\)/g, '').trim();

  // If structured fields missing, parse from formatted address string
  if (!area && fullAddr) {
    const areaMatch = fullAddr.match(/Area:\s*([^|,\n]+)/i);
    if (areaMatch) {
      area = areaMatch[1].replace(/\s*\([^)]*\)/g, '').trim();
    } else {
      const firstPart = fullAddr.split(/[,|]/)[0] || '';
      area = firstPart.replace(/\s*\([^)]*\)/g, '').trim();
    }
  }

  if (!sector && fullAddr) {
    const sectorMatch = fullAddr.match(/Sector:\s*([^|,\n]+)/i);
    if (sectorMatch) {
      sector = sectorMatch[1].trim();
    }
  }

  if (!houseFlatNo && fullAddr) {
    const houseMatch = fullAddr.match(/House\/Flat:\s*([^|,\n]+)/i);
    if (houseMatch) {
      houseFlatNo = houseMatch[1].trim();
    }
  }

  if (!landmark && fullAddr) {
    const landmarkMatch = fullAddr.match(/Landmark:\s*([^|,\n]+)/i);
    if (landmarkMatch) {
      landmark = landmarkMatch[1].trim();
    }
  }

  // Default fallback if area is still unpopulated
  if (!area || area.toLowerCase().includes('pickup')) {
    area = 'Akhtar Colony';
  }

  return {
    area,
    sector: sector || 'Sector A',
    houseFlatNo,
    landmark,
  };
}

export function buildWhatsAppMessageText(order: OrderWhatsAppDetails): string {
  const formattedPhone = formatPhoneForDisplay(order.customerPhone);

  const itemsLines = (order.orderItems || [])
    .map((item) => {
      const variant = item.variantName ? ` (${item.variantName})` : '';
      const lineTotal = (item.price * item.quantity).toLocaleString();
      return `• ${item.name}${variant} × ${item.quantity} — Rs. ${lineTotal}`;
    })
    .join('\n');

  const isDelivery = (order.orderType || 'DELIVERY').toUpperCase() === 'DELIVERY';

  let deliveryDetailsSection = '';
  if (isDelivery) {
    const { area, sector, houseFlatNo, landmark } = parseAddressFields(order);
    const houseLine = houseFlatNo ? `House/Flat: ${houseFlatNo}\n` : '';
    const landmarkLine = landmark ? `Landmark: ${landmark}\n` : '';

    deliveryDetailsSection = `━━━━━━━━━━━━━━━━
DELIVERY DETAILS
━━━━━━━━━━━━━━━━

Order Type: Delivery
Payment: Cash on Delivery

Area: ${area}
Sector: ${sector}
${houseLine}${landmarkLine}City: Karachi
Country: Pakistan`;
  } else {
    deliveryDetailsSection = `━━━━━━━━━━━━━━━━
PICKUP DETAILS
━━━━━━━━━━━━━━━━

Order Type: Self Pickup
Payment: Cash on Delivery

Pickup Location: ${order.branch?.name || 'Tawakal Restaurant — Akhtar Colony'}
City: Karachi
Country: Pakistan`;
  }

  return `🔔 NEW ORDER — TAWAKAL BBQ

━━━━━━━━━━━━━━━━
ORDER DETAILS
━━━━━━━━━━━━━━━━

Order #: ${order.orderNumber}
Customer: ${order.customerName}
Phone: ${formattedPhone}

━━━━━━━━━━━━━━━━
ITEMS
━━━━━━━━━━━━━━━━

${itemsLines || '• Order items summary'}

━━━━━━━━━━━━━━━━
BILL SUMMARY
━━━━━━━━━━━━━━━━

Subtotal: Rs. ${order.subtotal.toLocaleString()}
Delivery: Rs. ${(order.deliveryFee || 0).toLocaleString()}
TOTAL: Rs. ${order.totalAmount.toLocaleString()}

${deliveryDetailsSection}

━━━━━━━━━━━━━━━━

Please check the admin dashboard for full order details.`;
}

export function buildWhatsAppClickToChatUrl(order: OrderWhatsAppDetails): string {
  const rawAdminNumber =
    order.branch?.whatsapp ||
    order.branch?.phone ||
    process.env.NEXT_PUBLIC_WHATSAPP_ADMIN_NUMBER ||
    process.env.WHATSAPP_ADMIN_NUMBER ||
    '923485650906';

  let cleanNumber = rawAdminNumber.replace(/\D/g, '');
  if (cleanNumber.startsWith('03') && cleanNumber.length === 11) {
    cleanNumber = '92' + cleanNumber.substring(1);
  }

  const messageText = buildWhatsAppMessageText(order);
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(messageText)}`;
}

export function launchCustomerWhatsApp(order: OrderWhatsAppDetails): boolean {
  try {
    const url = buildWhatsAppClickToChatUrl(order);
    if (typeof window !== 'undefined') {
      window.open(url, '_blank', 'noopener,noreferrer');
      return true;
    }
  } catch (err) {
    console.error('Failed to launch WhatsApp click-to-chat:', err);
  }
  return false;
}
