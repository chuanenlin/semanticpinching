import styled from 'styled-components';
import {
  ContentContainer,
  ContentWrapper,
  KeystrokeIndicator as BaseKeystrokeIndicator
} from './SemanticPinch.styles';

export const MediaWrapper = styled.div`
  width: 700px;
  height: 400px;
  border-radius: 32px;
  overflow: hidden;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;

  img, video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 32px;
  }
`;

export const TextWrapper = styled(MediaWrapper)`
  padding: 3rem;

  p {
    font-size: 1.2rem;
    line-height: 1.6;
    color: #1a1a1a;
    margin: 0;
    text-align: center;
    max-width: 600px;
  }
`;

export const ContentContainerOverride = styled(ContentContainer)`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 500px;
  padding: 1rem;
  margin-top: 1rem;
`;

export const ContentWrapperOverride = styled(ContentWrapper)`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
`;

export const KeystrokeIndicator = styled(BaseKeystrokeIndicator)`
  top: 45%;
  left: 50%;
`; 