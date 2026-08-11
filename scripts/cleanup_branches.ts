import { db } from '../lib/db';

async function main() {
  console.log('Fetching branches from database...');
  const branches = await db.branch.findMany();
  console.log('Current branches in DB count:', branches.length);

  const azamTowns = branches.filter(b => b.name.toLowerCase().includes('azam town') || b.slug.includes('azam'));
  if (azamTowns.length > 1) {
    console.log(`Found ${azamTowns.length} Azam Town branches. Keeping the first one and deleting duplicates...`);
    const [keep, ...duplicates] = azamTowns;
    for (const dup of duplicates) {
      const orderCount = await db.order.count({ where: { branchId: dup.id } });
      if (orderCount === 0) {
        await db.branch.delete({ where: { id: dup.id } });
        console.log(`Deleted duplicate Azam Town branch ID: ${dup.id}`);
      }
    }
  }

  const akhtar = branches.find(b => b.slug.includes('akhtar'));
  if (akhtar) {
    await db.branch.update({
      where: { id: akhtar.id },
      data: {
        name: 'Tawakal Restaurant — Akhtar Colony',
        address: 'Plot No 358, Street 5, Sector B, Main Road Akhter Colony, Opposite Saddique Medical Store, Karachi, Pakistan',
        locationReference: 'R3QF+WGH, Akhtar Colony Main Rd, Sector C Akhtar Colony, Karachi, Pakistan',
        phone: '+92 343 1265090',
        whatsapp: '+92 343 1265090',
        openingHours: '12:00 PM - 01:00 AM',
        isActive: true,
      },
    });
    console.log('Updated Akhtar Colony branch with real owner data.');
  }

  const finalBranches = await db.branch.findMany();
  console.log('Final branches count:', finalBranches.length);
  console.log(finalBranches.map(b => ({ id: b.id, name: b.name, slug: b.slug, address: b.address })));
}

main().catch(console.error).finally(() => process.exit(0));
