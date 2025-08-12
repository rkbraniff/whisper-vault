import { prisma } from '../lib/prisma.js';

export async function listContacts(ownerId: string, q?: string) {
  return prisma.contact.findMany({
    where: q
      ? {
          ownerId,
          OR: [
            { firstName: { contains: q, mode: 'insensitive' } },
            { lastName:  { contains: q, mode: 'insensitive' } },
            { emails:    { some: { email: { contains: q, mode: 'insensitive' } } } },
            { phones:    { some: { e164:  { contains: q } } } },
          ],
        }
      : { ownerId },
    include: { emails: true, phones: true },
    orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }],
  });
}

export async function getContact(ownerId: string, id: string) {
  return prisma.contact.findFirst({
    where: { id, ownerId },
    include: { emails: true, phones: true },
  });
}

type CreateData = {
  firstName?: string;
  lastName?: string;
  note?: string;
  emails?: { email: string; isPrimary?: boolean }[];
  phones?: { e164: string; label?: string }[];
};

export async function createContact(ownerId: string, data: CreateData) {
  return prisma.contact.create({
    data: {
      ownerId,
      firstName: data.firstName,
      lastName: data.lastName,
      note: data.note,
      emails: data.emails?.length
        ? { createMany: { data: data.emails.map(e => ({ email: e.email, isPrimary: !!e.isPrimary })) } }
        : undefined,
      phones: data.phones?.length
        ? { createMany: { data: data.phones.map(p => ({ e164: p.e164, label: p.label })) } }
        : undefined,
    },
    include: { emails: true, phones: true },
  });
}

export async function updateContact(ownerId: string, id: string, data: CreateData) {
  // simple approach: replace all child rows if arrays provided
  return prisma.$transaction(async tx => {
    const existing = await tx.contact.findFirst({ where: { id, ownerId } });
    if (!existing) return null;

    if (data.emails) {
      await tx.contactEmail.deleteMany({ where: { contactId: id } });
      if (data.emails.length) {
        await tx.contactEmail.createMany({
          data: data.emails.map(e => ({ contactId: id, email: e.email, isPrimary: !!e.isPrimary })),
        });
      }
    }

    if (data.phones) {
      await tx.contactPhone.deleteMany({ where: { contactId: id } });
      if (data.phones.length) {
        await tx.contactPhone.createMany({
          data: data.phones.map(p => ({ contactId: id, e164: p.e164, label: p.label })),
        });
      }
    }

    await tx.contact.update({
      where: { id },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        note: data.note,
      },
    });

    return tx.contact.findUnique({ where: { id }, include: { emails: true, phones: true } });
  });
}

export async function deleteContact(ownerId: string, id: string) {
  // will cascade delete children due to onDelete: Cascade relations
  return prisma.contact.delete({ where: { id, ownerId } as any });
}
