import React, { useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { transformText } from '../utils/openai';
import { usePinchNavigation } from '../hooks/usePinchNavigation';
import { SemanticLevel, SEMANTIC_LEVELS } from '../types/semantic';
import {
  Container,
  ContentBox,
  LevelIndicatorContainer,
  LevelText,
  KeystrokeIndicator,
  ContentContainer,
  ContentWrapper,
  ErrorMessage,
  StatusIndicator,
  FooterHint
} from './SemanticPinch.styles';

export const SemanticPinch: React.FC = () => {
  const [currentLevel, setCurrentLevel] = useState<number>(2);
  const [content, setContent] = useState<string>("The mitochondria is the powerhouse of the cell.");
  const [displayContent, setDisplayContent] = useState(content);
  const [isTransforming, setIsTransforming] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showKeystroke, setShowKeystroke] = useState<'up' | 'down' | null>(null);

  const transformContent = useCallback(async (fromLevel: SemanticLevel, toLevel: SemanticLevel) => {
    setIsTransforming(true);
    setShowCompletion(false);
    setError(null);
    setDisplayContent('');

    try {
      let finalContent = '';
      await transformText(
        content,
        fromLevel,
        toLevel,
        (streamedContent) => {
          finalContent = streamedContent;
          if (streamedContent.trim()) {
            setDisplayContent(streamedContent);
          }
        }
      );
      setContent(finalContent);
      
      setShowCompletion(true);
      setTimeout(() => setShowCompletion(false), 2000);
    } catch (error) {
      console.error('Error transforming content:', error);
      setError('Failed to transform content. Please try again.');
      setDisplayContent(content);
    }
    setIsTransforming(false);
  }, [content]);

  const handleLevelChange = useCallback(async (direction: number) => {
    const newLevel = Math.max(0, Math.min(SEMANTIC_LEVELS.length - 1, currentLevel + direction));
    if (newLevel !== currentLevel) {
      setShowKeystroke(direction < 0 ? 'up' : 'down');
      setTimeout(() => setShowKeystroke(null), 800);
      setCurrentLevel(newLevel);
      const fromLevel = SEMANTIC_LEVELS[currentLevel];
      const toLevel = SEMANTIC_LEVELS[newLevel];
      transformContent(fromLevel, toLevel);
    }
  }, [currentLevel, transformContent]);

  usePinchNavigation({
    onLevelChange: handleLevelChange,
    isTransitioning: isTransforming
  });

  const renderContent = () => {
    if (!displayContent.trim()) {
      return null;
    }

    if (currentLevel === SEMANTIC_LEVELS.indexOf('article')) {
      const parts = displayContent.split('\n\n').filter(part => part.trim());
      return (
        <>
          <h1 
            contentEditable 
            suppressContentEditableWarning
            onBlur={(e) => {
              const newContent = [e.target.textContent, ...parts.slice(1)].join('\n\n');
              setContent(newContent);
              setDisplayContent(newContent);
            }}
          >
            {parts[0]}
          </h1>
          {parts.slice(1).map((part, index) => (
            <p 
              key={index}
              contentEditable 
              suppressContentEditableWarning
              onBlur={(e) => {
                const newParts = [...parts];
                newParts[index + 1] = e.target.textContent || '';
                const newContent = newParts.join('\n\n');
                setContent(newContent);
                setDisplayContent(newContent);
              }}
            >
              {part}
            </p>
          ))}
        </>
      );
    }

    return (
      <p 
        contentEditable 
        suppressContentEditableWarning
        onBlur={(e) => {
          const newContent = e.target.textContent || '';
          setContent(newContent);
          setDisplayContent(newContent);
        }}
        style={{ outline: 'none' }}
      >
        {displayContent}
      </p>
    );
  };

  const getKeystrokeImage = (type: 'up' | 'down') => {
    return type === 'up' ? './images/indicators/zoom-out.png' : './images/indicators/zoom-in.png';
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
              {SEMANTIC_LEVELS[currentLevel].charAt(0).toUpperCase() + SEMANTIC_LEVELS[currentLevel].slice(1)}
            </LevelText>
          </AnimatePresence>
        </LevelIndicatorContainer>

        <AnimatePresence mode="wait">
          {(isTransforming || showCompletion) && (
            <StatusIndicator
              key={isTransforming ? 'loading' : 'complete'}
              className={isTransforming ? 'loading' : 'complete'}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {isTransforming ? 'Generating' : 'Generation complete'}
            </StatusIndicator>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showKeystroke && (
            <KeystrokeIndicator
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <img 
                src={getKeystrokeImage(showKeystroke)}
                alt={`Zoom ${showKeystroke}`}
                onError={(e) => {
                  console.error(`Failed to load image: ${e.currentTarget.src}`);
                  e.currentTarget.style.display = 'none';
                }}
              />
            </KeystrokeIndicator>
          )}
        </AnimatePresence>

        <ContentContainer>
          <ContentWrapper 
            $isEmojiLevel={currentLevel === SEMANTIC_LEVELS.indexOf('emoji')}
            $isWordLevel={currentLevel === SEMANTIC_LEVELS.indexOf('word')}
            $isSentenceLevel={currentLevel === SEMANTIC_LEVELS.indexOf('sentence')}
          >
            {renderContent()}
          </ContentWrapper>

          <AnimatePresence>
            {error && (
              <ErrorMessage
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
              >
                {error}
              </ErrorMessage>
            )}
          </AnimatePresence>
        </ContentContainer>
      </ContentBox>
      <FooterHint>
        Semantic Pinching 🤏.
        <br />
        Pinch in/out on mobile or press up/down arrow keys on computer.
        Code at <a href="https://github.com/chuanenlin/semanticpinching" target="_blank" rel="noopener noreferrer">https://github.com/chuanenlin/semanticpinching</a>.
      </FooterHint>
    </Container>
  );
}; 