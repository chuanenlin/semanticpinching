import styled from 'styled-components';
import { motion } from 'framer-motion';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  min-height: 100vh;
  width: 100vw;
  background: #f5f5f5;
  padding: 2rem 2rem 0 2rem;
  box-sizing: border-box;
  overflow: auto;
`;

export const ContentBox = styled.div`
  position: relative;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  margin-top: 4rem;
  margin-bottom: 12rem;
`;

export const LevelIndicatorContainer = styled.div`
  position: absolute;
  top: 0.75rem;
  left: 50%;
  transform: translate(-50%, -30%);
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.2);
  padding: 0.2rem 0.5rem;
  border-radius: 12px;
  backdrop-filter: blur(4px);
  z-index: 100;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  width: auto;
  min-width: 60px;
  opacity: 1;
  pointer-events: none;
`;

export const LevelText = styled(motion.span)`
  color: rgba(255, 255, 255, 0.85);
  font-size: 0.65rem;
  font-weight: 400;
  letter-spacing: 0.3px;
  white-space: nowrap;
  display: block;
`;

export const LoadingIndicator = styled(motion.div)`
  position: absolute;
  top: -1rem;
  right: 2rem;
  color: rgba(0, 0, 0, 0.6);
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  z-index: 10;

  &::after {
    content: '';
    width: 0.5rem;
    height: 0.5rem;
    background: currentColor;
    border-radius: 50%;
    display: inline-block;
    animation: pulse 1s ease-in-out infinite;
  }

  @keyframes pulse {
    0% { opacity: 0.4; }
    50% { opacity: 1; }
    100% { opacity: 0.4; }
  }
`;

export const KeystrokeIndicator = styled(motion.div)`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 180px;
  height: 180px;
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0.95;
  background: rgba(0, 0, 0, 0.75);
  padding: 2rem;
  border-radius: 16px;
  backdrop-filter: blur(4px);

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    user-select: none;
    pointer-events: none;
    filter: brightness(1.1);
  }
`;

export const ContentContainer = styled(motion.div)`
  background: white;
  padding: 2rem 4rem;
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.06);
  width: 100%;
  min-height: 120px;
  position: relative;
  margin-top: 1rem;
`;

export const ContentWrapper = styled.div<{ 
  isEmojiLevel?: boolean; 
  isWordLevel?: boolean;
  isSentenceLevel?: boolean;
}>`
  font-size: 1.1rem;
  line-height: 1.6;
  color: #2c3e50;
  min-height: 2em;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Apple Color Emoji", "Segoe UI Emoji", sans-serif;
  text-align: justify;
  padding-top: 0.5rem;

  h1 {
    font-size: 1.8rem;
    font-weight: 600;
    margin-bottom: 1.5rem;
    color: #1a202c;
    text-align: left;
    outline: none;
    
    &:hover {
      background: rgba(0, 0, 0, 0.03);
    }
  }

  p {
    margin: 0;
    text-align: ${props => (props.isEmojiLevel || props.isWordLevel || props.isSentenceLevel) ? 'center' : 'justify'};
    outline: none;
    
    &:hover {
      background: rgba(0, 0, 0, 0.03);
    }
  }

  p + p {
    margin-top: 1.5rem;
  }

  ${props => props.isEmojiLevel && `
    font-size: 1.1rem;
    text-align: center;
  `}

  ${props => (props.isWordLevel || props.isSentenceLevel) && `
    text-align: center;
  `}
`;

export const ErrorMessage = styled(motion.div)`
  color: #e74c3c;
  margin-top: 1rem;
  text-align: center;
  font-size: 0.95rem;
`;

export const StatusIndicator = styled(motion.div)`
  position: absolute;
  top: -0.75rem;
  right: 2rem;
  font-size: 0.9rem;
  display: none;
  align-items: center;
  gap: 0.5rem;
  z-index: 10;

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

export const FooterHint = styled.div`
  position: relative;
  width: 90%;
  max-width: 100vw;
  margin: 0 auto;
  padding: 2rem 1rem 1rem 1rem;
  color: #bbb;
  font-size: 0.7rem;
  line-height: 1.8;
  text-align: center;
  hyphens: auto;
  word-wrap: break-word;

  a {
    color: #aaa;
    text-decoration: none;
    word-break: break-all;
  }
`;