import { SemanticPinch } from './components/SemanticPinch';
import styled, { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    touch-action: manipulation;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    user-select: none;
  }

  html, body {
    touch-action: none;
    overscroll-behavior: none;
    -webkit-text-size-adjust: 100%;
    -webkit-tap-highlight-color: transparent;
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
    overflow-y: scroll;
  }
`;

const AppContainer = styled.div`
  min-height: 100vh;
  width: 100vw;
  touch-action: none;
`;

function App() {
  console.log("App is mounting");
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
