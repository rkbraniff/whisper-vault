
/**
 * Sidebar component for desktop layout
 * Houses different functional areas of the vault
 */
interface SidebarProps {
  side: 'left' | 'right';
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ side, isOpen, onClose }: SidebarProps) {
  // Sidebar container styling
  const baseClasses = `
    fixed lg:relative top-0 z-50 h-full w-72
    bg-gradient-to-b from-obsidian-light to-obsidian
    shadow-2xl border-violet-deep/30
    flex flex-col
    transition-transform duration-300 ease-in-out
  `;
  const leftClasses = `${baseClasses} left-0 border-r ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`;
  const rightClasses = `${baseClasses} right-0 border-l ${isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}`;

  if (side === 'left') {
    return (
      <aside className={leftClasses + ' rounded-r-3xl'}>
        <div className="p-6 border-b border-violet-deep/20">
          <h2 className="text-whisper font-sigil text-xl tracking-wide mb-2">Vault Modes</h2>
          <p className="text-whisper-dim text-sm font-ritual mb-4">Choose your ritual of communication</p>
          <div className="space-y-3">
            <ModeItem title="Chamber View" description="Standard secure messaging" icon="◊" isActive={true} />
            <ModeItem title="Blackout Mode" description="Emergency concealment" icon="●" isActive={false} />
            <ModeItem title="Nightwatch" description="Minimal interface" icon="☾" isActive={false} />
            <ModeItem title="Keysmith Console" description="Advanced encryption" icon="⚿" isActive={false} />
          </div>
        </div>
        <button
          onClick={onClose}
          className="lg:hidden absolute top-4 right-4 text-whisper-dim hover:text-whisper bg-obsidian-light rounded-full p-2 shadow-md border border-violet-deep/20"
        >✕</button>
      </aside>
    );
  }

  return (
    <aside className={rightClasses + ' rounded-l-3xl'}>
      <div className="p-6 border-b border-violet-deep/20">
        <h2 className="text-whisper font-sigil text-xl tracking-wide mb-2">Sigil Contacts</h2>
        <p className="text-whisper-dim text-sm font-ritual mb-4">Your trusted circle of whispers</p>
        <div className="space-y-3">
          <ContactItem name="Anonymous Monk" status="online" lastSeen="2 minutes ago" trustLevel="high" />
          <ContactItem name="Shadow Keeper" status="away" lastSeen="1 hour ago" trustLevel="medium" />
          <ContactItem name="Void Walker" status="offline" lastSeen="3 days ago" trustLevel="high" />
        </div>
      </div>
      <div className="p-4 border-t border-violet-deep/20 mt-auto">
        <button className="w-full p-3 rounded-xl bg-violet-deep/20 text-whisper-dim hover:bg-violet-deep/30 transition-colors font-whisper text-sm font-semibold shadow">+ Invite New Contact</button>
      </div>
      <button
        onClick={onClose}
        className="lg:hidden absolute top-4 right-4 text-whisper-dim hover:text-whisper bg-obsidian-light rounded-full p-2 shadow-md border border-violet-deep/20"
      >✕</button>
    </aside>
  );
}

function ModeItem({ title, description, icon, isActive }: {
  title: string;
  description: string;
  icon: string;
  isActive: boolean;
}) {
  return (
    <div className={`
      p-4 rounded-2xl cursor-pointer flex items-center gap-4
      transition-all duration-200 shadow-sm
      ${isActive 
        ? 'bg-violet-deep/30 border border-violet-deep/60 text-ember' 
        : 'hover:bg-violet-deep/10 border border-transparent text-whisper-dim'}
    `}>
      <div className="text-violet-deep text-2xl font-sigil">{icon}</div>
      <div>
        <div className="text-whisper font-whisper text-base font-semibold">{title}</div>
        <div className="text-whisper-dim text-xs font-ritual">{description}</div>
      </div>
    </div>
  );
}

function ContactItem({ name, status, lastSeen, trustLevel }: {
  name: string;
  status: 'online' | 'away' | 'offline';
  lastSeen: string;
  trustLevel: 'high' | 'medium' | 'low';
}) {
  const statusColors = {
    online: 'bg-green-500',
    away: 'bg-yellow-500',
    offline: 'bg-gray-500'
  };
  const trustColors = {
    high: 'border-ember/50',
    medium: 'border-violet-deep/50',
    low: 'border-shadow/50'
  };
  return (
    <div className={`
      p-4 rounded-2xl cursor-pointer flex items-center gap-4
      hover:bg-violet-deep/10 border ${trustColors[trustLevel]} shadow-sm
      transition-all duration-200
    `}>
      <div className="relative">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-deep to-violet-soft flex items-center justify-center shadow">
          <span className="text-whisper text-lg font-sigil">
            {name.split(' ').map(n => n[0]).join('')}
          </span>
        </div>
        <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-obsidian ${statusColors[status]}`} />
      </div>
      <div className="flex-1">
        <div className="text-whisper font-whisper text-base font-semibold">{name}</div>
        <div className="text-whisper-dim text-xs font-ritual">{lastSeen}</div>
      </div>
    </div>
  );
}
