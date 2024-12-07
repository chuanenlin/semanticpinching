import styled from 'styled-components';
import {
  KeystrokeIndicator as BaseKeystrokeIndicator,
  StatusIndicator as BaseStatusIndicator
} from './SemanticPinch.styles';

export const ContentBox = styled.div`
  position: relative;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  margin-top: 4rem;
  margin-bottom: 12rem;
`;

export const TextContent = styled.div<{ isEmoji?: boolean }>`
  background: white;
  padding: 2rem 4rem;
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.06);
  width: 100%;
  height: 500px;
  position: relative;
  margin-top: 1rem;
  font-size: ${props => props.isEmoji ? '5rem' : '1.2rem'};
  line-height: 1.6;
  color: #1a1a1a;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Apple Color Emoji", "Segoe UI Emoji", sans-serif;
`;

export const ImageContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.06);
  width: 100%;
  height: 500px;
  position: relative;
  margin-top: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    max-width: 100%;
    max-height: 100%;
    border-radius: 16px;
    object-fit: contain;
    opacity: 0;
    transition: opacity 0.2s ease;

    &.loaded {
      opacity: 1;
    }
  }
`;

export const KeystrokeIndicator = styled(BaseKeystrokeIndicator)`
  top: 45%;
  left: 50%;
`;

export const StatusIndicator = styled(BaseStatusIndicator)`
  position: absolute;
  top: -0.5rem;
  right: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  z-index: 10;
  font-size: 0.9rem;

  &.loading {
    color: rgba(0, 0, 0, 0.6);

    &::after {
      content: '';
      width: 0.5rem;
      height: 0.5rem;
      background: currentColor;
      border-radius: 50%;
      display: inline-block;
      animation: pulse 1s ease-in-out infinite;
    }
  }

  &.complete {
    color: #10b981;
    font-weight: 500;
  }

  @keyframes pulse {
    0% { opacity: 0.4; }
    50% { opacity: 1; }
    100% { opacity: 0.4; }
  }
`; 