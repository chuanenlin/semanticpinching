import React from 'react';
import { SemanticPinch } from './components/SemanticPinch';
import styled, { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background: #f5f5f5;
  }
`;

const AppContainer = styled.div`
  min-height: 100vh;
  width: 100vw;
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
