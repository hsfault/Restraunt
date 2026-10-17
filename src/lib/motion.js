// Shared motion language. Curtains and reveals use `primary`, UI uses `ui`.
export const ease = {
  primary: [0.76, 0, 0.24, 1],
  ui: [0.22, 1, 0.36, 1],
};

export const spring = { type: 'spring', stiffness: 300, damping: 30 };
export const softSpring = { type: 'spring', stiffness: 260, damping: 32 };
export const popSpring = { type: 'spring', stiffness: 320, damping: 28 };

export const reveal = { duration: 0.9, ease: ease.ui };
