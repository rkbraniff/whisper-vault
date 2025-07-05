import type { ReactNode } from "react";

/**
 * Dashboard - Chamber View for WhisperVault
 * Three resizable panes: WhispersPane, SigilsPane, KeysLocksPane
 * Floating Action Button: Send a Whisper
 */
export default function Dashboard({
  whispersPane,
  sigilsPane,
  keysLocksPane,
  fab,
}: {
  whispersPane: ReactNode;
  sigilsPane: ReactNode;
  keysLocksPane: ReactNode;
  fab?: ReactNode;
}) {
  return (
    <div className="relative h-screen w-full bg-obsidian flex flex-col">
      {/* Main grid */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-0 h-full">
        {/* WhispersPane */}
        <section className="bg-obsidian-light border-r border-violet-deep/10 flex flex-col min-h-0">
          {whispersPane}
        </section>
        {/* SigilsPane */}
        <section className="bg-obsidian flex flex-col min-h-0 border-r border-violet-deep/10">
          {sigilsPane}
        </section>
        {/* KeysLocksPane */}
        <section className="bg-obsidian-dark flex flex-col min-h-0">
          {keysLocksPane}
        </section>
      </div>
      {/* Floating Action Button */}
      {fab && (
        <div className="absolute bottom-8 right-8 z-20">
          {fab}
        </div>
      )}
    </div>
  );
}
