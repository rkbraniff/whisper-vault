# Project Notes Log

## 2025-07-04 Evaluation

- **Purpose**: Evaluate existing React + TypeScript project.
- **Key Files**:
  - `src/crypto/crypto.ts`: libsodium-based encryption utilities.
  - `src/components`: ChatBubble, ChatInput, ChatThread, CryptoTest.
  - `src/pages/Messenger.tsx`: simple chat UI with identity key pair generation.
- **Observations**:
  - No Node/Express backend yet; purely client-side.
  - Basic messaging state management; uses local libsodium wrappers for encryption tests.
  - Tailwind is referenced by classes but no config found (likely using default). No server code.
- **Next Steps**: define server API or extend crypto functions; implement tests; add README details.


## 2025-07-04 Tailwind Integration
- **Purpose**: Improve UI/UX with Tailwind CSS and Cenobrach theme.
- **Key Decisions**:
  - Added Tailwind and PostCSS setup with custom theme colors.
  - Switched PostCSS config to CJS for compatibility.
  - Updated Chat components to use `bg-vault-bg` and accent colors.
- **Challenges**:
  - Build failed initially due to Tailwind v4 plugin changes. Installed `@tailwindcss/postcss` and `@tailwindcss/nesting`.
- **Next Steps**: Refine theme, create reusable components, and explore Express backend.

## 2025-07-04 Cleanup and Build Fixes
- **Purpose**: Address feedback on previous PR and fix build warnings.
- **Key Decisions**:
  - Removed temporary `ChatBubble` example from `Messenger` page.
  - Deleted debug `console.log` from `ChatBubble` component.
  - Replaced `@apply text-white` in `index.css` with standard CSS to avoid Tailwind errors.
- **Challenges or Edge Cases**: Tailwind v4 strict mode flagged unknown utilities when using `@apply`.
- **Next Steps**: Continue refining UI components and document server requirements.

