import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { requireAuth } from '../middleware/auth.js';
import { z } from 'zod';

const r = Router();
r.use(requireAuth);

const phoneE164 = z.string().regex(/^\+\d{7,15}$/);
const emailStr = z.string().email();

const createSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  note: z.string().optional(),
  publicKey: z.string().optional(),
  emails: z.array(emailStr).default([]),
  phones: z.array(z.object({ e164: phoneE164, label: z.string().optional() })).default([]),
});

r.get('/', async (req, res, next) => {
  try {
    const userId = req.user!.id;
    const q = (req.query.query as string | undefined)?.trim();
    const page = Number(req.query.page ?? 1);
    const pageSize = Math.min(Number(req.query.pageSize ?? 20), 100);
    const skip = (page - 1) * pageSize;

    const where = q ? {
      ownerId: userId,
      OR: [
        { firstName: { contains: q, mode: 'insensitive' } },
        { lastName:  { contains: q, mode: 'insensitive' } },
        { emails: { some: { email: { contains: q, mode: 'insensitive' } } } },
        { phones: { some: { e164:  { contains: q } } } },
      ],
    } : { ownerId: userId };

    const [items, total] = await Promise.all([
      prisma.Contact.findMany({
        where, skip, take: pageSize,
        include: { emails: true, phones: true },
        orderBy: { updatedAt: 'desc' },
      }),
      prisma.Contact.count({ where }),
    ]);

    res.json({ items, total, page, pageSize });
  } catch (err) { next(err); }
});

r.post('/', async (req, res, next) => {
  try {
    const userId = req.user!.id;
    const body = createSchema.parse(req.body);

    const created = await prisma.Contact.create({
      data: {
        ownerId: userId,
        firstName: body.firstName,
        lastName: body.lastName,
        note: body.note,
        publicKey: body.publicKey,
        emails: { create: body.emails.map(email => ({ email })) },
        phones: { create: body.phones.map(p => ({ e164: p.e164, label: p.label })) },
      },
      include: { emails: true, phones: true },
    });

    res.status(201).json(created);
  } catch (err) { next(err); }
});

r.put('/:id', async (req, res, next) => {
  try {
    const userId = req.user!.id;
    const id = req.params.id;
    const body = createSchema.partial().parse(req.body);

    // Replace emails/phones if provided
    const updated = await prisma.Contact.update({
      where: { id, ownerId: userId },
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        note: body.note,
        publicKey: body.publicKey,
        ...(body.emails ? {
          emails: { deleteMany: {}, create: body.emails.map(email => ({ email })) }
        } : {}),
        ...(body.phones ? {
          phones: { deleteMany: {}, create: body.phones.map(p => ({ e164: p.e164, label: p.label })) }
        } : {}),
      },
      include: { emails: true, phones: true },
    });

    res.json(updated);
  } catch (err) { next(err); }
});

r.delete('/:id', async (req, res, next) => {
  try {
    const userId = req.user!.id;
    const id = req.params.id;

    await prisma.contact.delete({ where: { id, ownerId: userId } as any });
    res.status(204).end();
  } catch (err) { next(err); }
});

export const contactsRouter = r;
