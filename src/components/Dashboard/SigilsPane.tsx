import React from 'react';

/**
 * SigilsPane - Contacts/trust circles for Dashboard
 * Placeholder for now
 */
const SigilsPane: React.FC = () => {
  // TODO: Replace with real contacts API later
  const contacts: { id: string; name: string }[] = [];
  return (
    <section
      className="rounded-2xl bg-obsidian-light/60 border border-violetDeep/30 glow-violet p-6"
      aria-label="Sigils"
    >
      <div className="text-lg font-semibold mb-4">Sigils</div>
      <ul className="space-y-2">
        {contacts.length === 0 ? (
          <li className="text-whisper-dim">No contacts yet.</li>
        ) : (
          contacts.map((contact) => (
            <li key={contact.id}>
              <button
                className="w-full text-left rounded-lg px-3 py-2 hover:bg-violetDeep/10 focus:outline-none focus:ring-2 focus:ring-ember transition"
                aria-label={`Open contact: ${contact.name}`}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    /* TODO: open contact */
                  }
                }}
              >
                <div className="font-semibold truncate">{contact.name}</div>
              </button>
            </li>
          ))
        )}
      </ul>
    </section>
  );
};

export default SigilsPane;
