import React, { useEffect } from 'react';

export const ClickGlowManager: React.FC = () => {
  useEffect(() => {
    const handlePointerDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // 1. Identify clicked button or card
      const buttonEl = target.closest<HTMLElement>(
        'button, [role="button"], .sadara-btn-primary, a[href]'
      );
      const cardEl = target.closest<HTMLElement>(
        '.sadara-panel, .rounded-2xl, .rounded-3xl, .card-glow, [data-card="true"]'
      );

      const targetEl = buttonEl || cardEl;
      if (!targetEl) return;

      // 2. Add dynamic glow pulse class to the element
      targetEl.classList.add('sadara-glow-pulse');
      window.setTimeout(() => {
        targetEl.classList.remove('sadara-glow-pulse');
      }, 420);

      // 3. Create radiant glowing ripple wave
      const rect = targetEl.getBoundingClientRect();
      const diameter = Math.max(rect.width, rect.height, 60);

      const wave = document.createElement('span');
      wave.className = 'sadara-click-wave';
      wave.style.width = `${diameter}px`;
      wave.style.height = `${diameter}px`;
      wave.style.left = `${e.clientX}px`;
      wave.style.top = `${e.clientY}px`;
      wave.style.position = 'fixed';

      document.body.appendChild(wave);

      // Remove after animation finishes
      window.setTimeout(() => {
        wave.remove();
      }, 560);
    };

    window.addEventListener('pointerdown', handlePointerDown, { passive: true });
    return () => {
      window.removeEventListener('pointerdown', handlePointerDown);
    };
  }, []);

  return null;
};
