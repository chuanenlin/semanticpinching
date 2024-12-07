import { SemanticPinch } from './components/SemanticPinch';
import { MultimodalPinch } from './components/MultimodalPinch';
import styled, { createGlobalStyle } from 'styled-components';
import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    user-select: none;
    -ms-user-select: none;
    -moz-user-select: none;
  }

  html {
    overscroll-behavior: none;
    -webkit-text-size-adjust: none;
    -moz-text-size-adjust: none;
    -ms-text-size-adjust: none;
    text-size-adjust: none;
    -webkit-tap-highlight-color: transparent;
    height: 100%;
    position: fixed;
    width: 100%;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background: #f5f5f5;
    position: fixed;
    width: 100%;
    height: 100%;
    overscroll-behavior: none;
    -webkit-overflow-scrolling: touch;
  }

  #root {
    height: 100%;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    position: relative;
  }
`;

const AppContainer = styled.div`
  min-height: 100%;
  width: 100%;
  position: relative;
  overflow-x: hidden;
`;

const ModeSwitchContainer = styled.div`
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 1000;
  display: flex;
  gap: 8px;
`;

const ModeButton = styled.button<{ active?: boolean }>`
  background: ${props => props.active ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.05)'};
  color: ${props => props.active ? 'white' : 'rgba(0, 0, 0, 0.5)'};
  border: none;
  padding: 8px 16px;
  border-radius: 16px;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 130px;
  text-align: center;
  backdrop-filter: blur(4px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  &:hover {
    color: ${props => props.active ? 'white' : 'rgba(0, 0, 0, 0.8)'};
    background: ${props => props.active ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.1)'};
  }
`;

function App() {
  const [mode, setMode] = useState<'semantic' | 'multimodal'>('semantic');

  useEffect(() => {
    document.addEventListener('dblclick', (e) => e.preventDefault());

    document.addEventListener('gesturestart', (e) => {
      if (!(e.target as Element).closest('.semantic-pinch-container')) {
        e.preventDefault();
      }
    });

    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault();
      }
    };
    
    document.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      document.removeEventListener('dblclick', (e) => e.preventDefault());
      document.removeEventListener('gesturestart', (e) => {
        if (!(e.target as Element).closest('.semantic-pinch-container')) {
          e.preventDefault();
        }
      });
      document.removeEventListener('wheel', handleWheel);
    };
  }, []);

  return (
    <>
      <GlobalStyle />
      <AppContainer>
        <ModeSwitchContainer>
          <ModeButton 
            active={mode === 'semantic'} 
            onClick={() => setMode('semantic')}
          >
            Text pinching
          </ModeButton>
          <ModeButton 
            active={mode === 'multimodal'} 
            onClick={() => setMode('multimodal')}
          >
            Multimodal pinching
          </ModeButton>
        </ModeSwitchContainer>
        <AnimatePresence mode="wait">
          {mode === 'semantic' ? <SemanticPinch /> : <MultimodalPinch />}
        </AnimatePresence>
      </AppContainer>
    </>
  );
}

export default App;
