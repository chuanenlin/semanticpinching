import { SemanticPinch } from './components/SemanticPinch';
import styled, { createGlobalStyle } from 'styled-components';
import { useEffect } from 'react';

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

function App() {
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
        <SemanticPinch />
      </AppContainer>
    </>
  );
}

export default App;
