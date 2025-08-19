import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma.js';
import { requireAuth } from '../middleware/auth.js';

export const usersRouter = Router();

usersRouter.use(requireAuth);

// GET /api/users/search?q=term&page=1&pageSize=20
usersRouter.get('/search', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const q = (req.query.q as string | undefined)?.trim() || '';
    const page = Math.max(Number(req.query.page ?? 1), 1);
    const pageSize = Math.min(Number(req.query.pageSize ?? 20), 100);
    const skip = (page - 1) * pageSize;

    // Get contacts owned by the user. Include the optional linked `user` relation so we can
    // exclude app users that are already represented by a contact, plus emails/phones.
    const myContacts = await prisma.contact.findMany({
      where: { ownerId: userId },
      include: {
        emails: { select: { email: true } },
        phones: { select: { e164: true } },
      },
    }) as any;

    // Build exclusion lists
    const excludeIdsSet = new Set<string>([userId]);
    const excludeEmails: string[] = [];
    const excludePhones: string[] = [];

    for (const c of myContacts) {
      // `userId` is a scalar we added in the schema; cast to any above so it's safe to read here.
      if (c.userId) excludeIdsSet.add(c.userId as string);
      if (c.emails && c.emails.length) excludeEmails.push(...c.emails.map((e: { email: string }) => e.email));
      if (c.phones && c.phones.length) excludePhones.push(...c.phones.map((p: { e164: string }) => p.e164));
    }

    const excludeIds = Array.from(excludeIdsSet);

    // Build Prisma where filter: always exclude ids (and optionally emails/phones),
    // and if q is present add the OR search conditions.
    const where: any = { id: { notIn: excludeIds } };
    if (excludeEmails.length) where.email = { notIn: excludeEmails };
    if (excludePhones.length) where.phone = { notIn: excludePhones };

    if (q) {
      where.AND = where.AND ?? [];
      where.AND.push({
        OR: [
          { firstName: { contains: q, mode: 'insensitive' } },
          { lastName: { contains: q, mode: 'insensitive' } },
          { email: { contains: q, mode: 'insensitive' } },
          { phone: { contains: q } },
        ],
      });
    }

    const [items, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: { id: true, firstName: true, lastName: true, email: true, avatarUrl: true, phone: true },
        skip,
        take: pageSize,
        orderBy: { lastName: 'asc' },
      }),
      prisma.user.count({ where }),
    ]);

    res.json({ items, total, page, pageSize });
  } catch (err) { next(err); }
});
