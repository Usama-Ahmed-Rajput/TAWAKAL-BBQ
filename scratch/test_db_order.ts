import { prisma } from '../lib/db.js';

async function verifyOrderInDB() {
  try {
    const latestOrder = await prisma.order.findFirst({
      orderBy: { createdAt: 'desc' },
      include: { orderItems: true, branch: true }
    });

    console.log('--- LATEST ORDER IN DATABASE ---');
    console.log('Order Number:', latestOrder?.orderNumber);
    console.log('Customer:', latestOrder?.customerName, latestOrder?.customerPhone);
    console.log('Subtotal:', latestOrder?.subtotal);
    console.log('Delivery Fee:', latestOrder?.deliveryFee);
    console.log('Total Amount:', latestOrder?.totalAmount);
    console.log('Items Count:', latestOrder?.orderItems?.length);
    console.log('Branch Name:', latestOrder?.branch?.name);
    console.log('Status:', latestOrder?.orderStatus);
    console.log('Created At:', latestOrder?.createdAt);
  } catch (err) {
    console.error('DB ERROR:', err);
  }
}

verifyOrderInDB();
