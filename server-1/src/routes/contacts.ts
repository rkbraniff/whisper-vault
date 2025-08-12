
import { createContactSchema, updateContactSchema } from '../validators/contact.js';
import { listContacts, getContact, createContact, updateContact, deleteContact } from '../services/contacts.js';
import { requireAuth } from '../middleware/auth.js';
import { Router } from 'express';

export const contactsRouter = Router();

contactsRouter.use(requireAuth);

// GET /api/contacts?q=term
contactsRouter.get('/', async (req: any, res, next) => {
  try {
    const q = typeof req.query.q === 'string' ? req.query.q : undefined;
    const rows = await listContacts(req.user.id, q);
    res.json(rows);
  } catch (err) { next(err); }
});

// GET /api/contacts/:id
contactsRouter.get('/:id', async (req: any, res, next) => {
  try {
    const row = await getContact(req.user.id, req.params.id);
    if (!row) return res.status(404).json({ error: 'not_found' });
    res.json(row);
  } catch (err) { next(err); }
});

// POST /api/contacts
contactsRouter.post('/', async (req: any, res, next) => {
  try {
    const parsed = createContactSchema.parse(req.body);
    const row = await createContact(req.user.id, parsed);
    res.status(201).json(row);
  } catch (err) { next(err); }
});

// PUT /api/contacts/:id
contactsRouter.put('/:id', async (req: any, res, next) => {
  try {
    const parsed = updateContactSchema.parse(req.body);
    const row = await updateContact(req.user.id, req.params.id, parsed);
    if (!row) return res.status(404).json({ error: 'not_found' });
    res.json(row);
  } catch (err) { next(err); }
});

// DELETE /api/contacts/:id
contactsRouter.delete('/:id', async (req: any, res, next) => {
  try {
    const existing = await getContact(req.user.id, req.params.id);
    if (!existing) return res.status(404).json({ error: 'not_found' });
    await deleteContact(req.user.id, req.params.id);
    res.status(204).end();
  } catch (err) { next(err); }
});
