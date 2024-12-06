import React, { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { usePinchNavigation } from '../hooks/usePinchNavigation';
import {
  Container,
  ContentBox,
  LevelIndicatorContainer,
  LevelText,
} from './SemanticPinch.styles';
import {
  MediaWrapper,
  TextWrapper,
  ContentContainerOverride,
  ContentWrapperOverride,
  KeystrokeIndicator
} from './MultimodalPinch.styles';

export type MultimodalLevel = 'text' | 'image' | 'video';

export const MULTIMODAL_LEVELS: MultimodalLevel[] = ['text', 'image', 'video'];

export const MultimodalPinch: React.FC = () => {
  const [currentLevel, setCurrentLevel] = useState<number>(1);
  const [showKeystroke, setShowKeystroke] = useState<'up' | 'down' | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [content] = useState({
    text: "A corgi running in a grassy field.",
    image: "/assets/corgi.jpg",
    video: "/assets/corgi.mp4"
  });

  const handleLevelChange = useCallback(async (direction: number) => {
    const newLevel = Math.max(0, Math.min(MULTIMODAL_LEVELS.length - 1, currentLevel + direction));
    if (newLevel !== currentLevel) {
      setShowKeystroke(direction < 0 ? 'up' : 'down');
      setIsTransitioning(true);
      
      await new Promise(resolve => setTimeout(resolve, 600));
      
      setCurrentLevel(newLevel);
      setTimeout(() => {
        setShowKeystroke(null);
        setIsTransitioning(false);
      }, 800);
    }
  }, [currentLevel]);

  usePinchNavigation({
    onLevelChange: handleLevelChange,
    isTransitioning
  });

  const renderContent = () => {
    const level = MULTIMODAL_LEVELS[currentLevel];
    switch (level) {
      case 'text':
        return (
          <TextWrapper>
            <p>{content.text}</p>
          </TextWrapper>
        );
      case 'image':
        return (
          <MediaWrapper>
            <img src={content.image} alt="Corgi" />
          </MediaWrapper>
        );
      case 'video':
        return (
          <MediaWrapper>
            <video autoPlay loop muted playsInline>
              <source src={content.video} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </MediaWrapper>
        );
    }
  };

  return (
    <Container>
      <ContentBox>
        <LevelIndicatorContainer>
          <AnimatePresence mode="wait">
            <LevelText
              key={currentLevel}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {MULTIMODAL_LEVELS[currentLevel].charAt(0).toUpperCase() + MULTIMODAL_LEVELS[currentLevel].slice(1)}
            </LevelText>
          </AnimatePresence>
        </LevelIndicatorContainer>

        <ContentContainerOverride>
          <AnimatePresence mode="wait">
            <ContentWrapperOverride
              key={MULTIMODAL_LEVELS[currentLevel]}
              as={motion.div}
              initial={{ opacity: 0 }}
              animate={{ opacity: isTransitioning ? 0.3 : 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {renderContent()}
            </ContentWrapperOverride>
          </AnimatePresence>
        </ContentContainerOverride>

        <AnimatePresence>
          {showKeystroke && (
            <KeystrokeIndicator
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <img 
                src={`/images/indicators/zoom-${showKeystroke === 'up' ? 'out' : 'in'}.png`}
                alt={`Zoom ${showKeystroke}`}
              />
            </KeystrokeIndicator>
          )}
        </AnimatePresence>
      </ContentBox>
    </Container>
  );
}; 