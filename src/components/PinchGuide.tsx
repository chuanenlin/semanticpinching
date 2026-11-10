import React from 'react';
import styled, { css, keyframes } from 'styled-components';

// Shows people what pinching does before they try it: one plain line at the top, the ladder of
// levels with the current one highlighted, and two buttons that do the same as the arrow keys
// (or a pinch on a phone). The buttons light up when the real key is pressed, which teaches the
// shortcut.

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const Tagline = styled.p`
  margin: 1.25rem 0 0.75rem;
  max-width: 640px;
  text-align: center;
  color: #444;
  font-size: 0.95rem;
  line-height: 1.5;
  @media (max-width: 600px) {
    margin-top: 3.25rem; /* the mode buttons wrap to two lines on a phone */
  }
`;

const Ladder = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 0.25rem;
  margin-bottom: 1rem;
`;

const Rung = styled.button<{ $current: boolean; $clickable: boolean }>`
  border: none;
  border-radius: 999px;
  padding: 0.3rem 0.8rem;
  font-size: 0.85rem;
  font-family: inherit;
  background: ${p => (p.$current ? '#2d2d2d' : 'transparent')};
  color: ${p => (p.$current ? '#fff' : '#666')};
  cursor: ${p => (p.$clickable ? 'pointer' : 'default')};
  transition: background 0.15s, color 0.15s;
  ${p => p.$clickable && !p.$current && css`
    &:hover { background: #e4e4e4; color: #222; }
  `}
  &:focus-visible { outline: 2px solid #2d2d2d; outline-offset: 2px; }
  &:disabled { cursor: default; }
`;

const Dot = styled.span`
  color: #bbb;
  font-size: 0.8rem;
`;

const pulse = keyframes`
  0%, 100% { box-shadow: 0 0 0 0 rgba(45, 45, 45, 0.35); }
  50% { box-shadow: 0 0 0 8px rgba(45, 45, 45, 0); }
`;

const Buttons = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.75rem;
  margin-top: 1.25rem;
`;

const StepButton = styled.button<{ $lit: boolean; $nudge: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  border: 1px solid #d6d6d6;
  border-radius: 12px;
  padding: 0.55rem 1rem;
  font-size: 0.95rem;
  font-family: inherit;
  background: ${p => (p.$lit ? '#2d2d2d' : '#fff')};
  color: ${p => (p.$lit ? '#fff' : '#222')};
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
  &:hover:not(:disabled) { border-color: #999; }
  &:disabled { opacity: 0.35; cursor: default; }
  &:focus-visible { outline: 2px solid #2d2d2d; outline-offset: 2px; }
  ${p => p.$nudge && css`
    animation: ${pulse} 1.8s ease-in-out infinite;
    @media (prefers-reduced-motion: reduce) { animation: none; }
  `}
`;

const TouchHint = styled.span`
  color: #888;
  font-size: 0.8rem;
`;

const Key = styled.kbd<{ $lit: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.6rem;
  height: 1.6rem;
  border-radius: 6px;
  border: 1px solid ${p => (p.$lit ? '#666' : '#cfcfcf')};
  border-bottom-width: 2px;
  font-family: inherit;
  font-size: 0.85rem;
  background: ${p => (p.$lit ? '#444' : '#f7f7f7')};
  color: inherit;
`;

interface TopProps {
  tagline: string;
  levels: readonly string[];
  current: number;
  busy: boolean;
  onJump?: (index: number) => void;
}

export const PinchGuideTop: React.FC<TopProps> = ({ tagline, levels, current, busy, onJump }) => (
  <>
    <Tagline>{tagline}</Tagline>
    <Ladder aria-label="Levels">
      {levels.map((level, i) => (
        <React.Fragment key={level}>
          {i > 0 && <Dot aria-hidden="true">·</Dot>}
          <Rung
            type="button"
            $current={i === current}
            $clickable={!!onJump}
            aria-current={i === current ? 'step' : undefined}
            disabled={!onJump || busy || i === current}
            onClick={() => onJump && onJump(i)}
          >
            {cap(level)}
          </Rung>
        </React.Fragment>
      ))}
    </Ladder>
  </>
);

interface ButtonProps {
  current: number;
  count: number;
  busy: boolean;
  isTouch: boolean;
  pressed: 'up' | 'down' | null;
  nudge: boolean;
  upLabel: string;
  downLabel: string;
  onStep: (direction: number) => void;
}

export const PinchGuideButtons: React.FC<ButtonProps> = ({
  current, count, busy, isTouch, pressed, nudge, upLabel, downLabel, onStep,
}) => (
  <Buttons>
    <StepButton
      type="button"
      $lit={pressed === 'up'}
      $nudge={false}
      disabled={busy || current === 0}
      onClick={() => onStep(-1)}
    >
      {!isTouch && <Key $lit={pressed === 'up'} aria-label="Up arrow">↑</Key>}
      <span>{upLabel}</span>
      {isTouch && <TouchHint>(pinch in)</TouchHint>}
    </StepButton>
    <StepButton
      type="button"
      $lit={pressed === 'down'}
      $nudge={nudge && !busy && current < count - 1}
      disabled={busy || current === count - 1}
      onClick={() => onStep(1)}
    >
      {!isTouch && <Key $lit={pressed === 'down'} aria-label="Down arrow">↓</Key>}
      <span>{downLabel}</span>
      {isTouch && <TouchHint>(pinch out)</TouchHint>}
    </StepButton>
  </Buttons>
);
