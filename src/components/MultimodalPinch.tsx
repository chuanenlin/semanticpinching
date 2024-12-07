import React, { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { usePinchNavigation } from '../hooks/usePinchNavigation';
import { generateImage, generateCaption } from '../utils/replicate';
import { transformText } from '../utils/openai';
import {
  Container,
  FooterHint,
  LevelIndicatorContainer,
  LevelText,
} from './SemanticPinch.styles';
import {
  ContentBox,
  TextContent,
  ImageContent,
  KeystrokeIndicator,
  StatusIndicator
} from './MultimodalPinch.styles';

export type MultimodalLevel = 'emoji' | 'text' | 'image';
export const MULTIMODAL_LEVELS: MultimodalLevel[] = ['emoji', 'text', 'image'];

export const MultimodalPinch: React.FC = () => {
  const [currentLevel, setCurrentLevel] = useState<number>(1); // Start at text level
  const [showKeystroke, setShowKeystroke] = useState<'up' | 'down' | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [content, setContent] = useState({
    emoji: "",
    text: "An avocado chair",
    image: ""
  });

  const handleLevelChange = useCallback(async (direction: number) => {
    const newLevel = Math.max(0, Math.min(MULTIMODAL_LEVELS.length - 1, currentLevel + direction));
    if (newLevel !== currentLevel && !isLoading) {
      setShowKeystroke(direction < 0 ? 'up' : 'down');
      setIsTransitioning(true);
      setIsLoading(true);
      setShowCompletion(false);
      setError(null);

      try {
        const fromLevel = MULTIMODAL_LEVELS[currentLevel];
        const toLevel = MULTIMODAL_LEVELS[newLevel];

        if (toLevel === 'image') { // text -> image
          const imageUrl = await generateImage(content.text);
          setContent(prev => ({ ...prev, image: imageUrl }));
        } else if (fromLevel === 'image') { // image -> text
          if (!content.image) {
            throw new Error('No image URL available');
          }
          const caption = await generateCaption(content.image);
          setContent(prev => ({ ...prev, text: caption }));
        } else if (toLevel === 'text') { // emoji -> text
          await transformText(
            content.emoji,
            'emoji',
            'sentence',
            (streamedContent) => {
              if (streamedContent.trim()) {
                setContent(prev => ({ ...prev, text: streamedContent }));
              }
            }
          );
        } else if (toLevel === 'emoji') { // text -> emoji
          await transformText(
            content.text,
            'sentence',
            'emoji',
            (streamedContent) => {
              if (streamedContent.trim()) {
                setContent(prev => ({ ...prev, emoji: streamedContent }));
              }
            }
          );
        }
        
        setCurrentLevel(newLevel);
        setShowCompletion(true);
        setTimeout(() => setShowCompletion(false), 2000);
      } catch (err) {
        console.error('Transformation error:', err);
        setError('Failed to transform content. Please try again.');
        setIsTransitioning(false);
        setIsLoading(false);
        return;
      }

      setTimeout(() => {
        setShowKeystroke(null);
        setIsTransitioning(false);
        setIsLoading(false);
      }, 800);
    }
  }, [currentLevel, content, isLoading]);

  usePinchNavigation({
    onLevelChange: handleLevelChange,
    isTransitioning: isTransitioning || isLoading
  });

  const renderContent = () => {
    const level = MULTIMODAL_LEVELS[currentLevel];
    switch (level) {
      case 'emoji':
        return (
          <TextContent isEmoji>
            {content.emoji}
          </TextContent>
        );
      case 'text':
        return (
          <TextContent>
            {content.text}
          </TextContent>
        );
      case 'image':
        return (
          <ImageContent>
            <img 
              src={content.image} 
              alt={content.text} 
              onLoad={(e) => {
                (e.target as HTMLImageElement).classList.add('loaded');
              }}
            />
          </ImageContent>
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

        <AnimatePresence>
          {(isLoading || showCompletion) && (
            <StatusIndicator
              key={isLoading ? 'loading' : 'complete'}
              className={isLoading ? 'loading' : 'complete'}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {isLoading ? 'Generating' : 'Generation complete'}
            </StatusIndicator>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {renderContent()}
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
                src={`/images/indicators/zoom-${showKeystroke === 'up' ? 'out' : 'in'}.png`}
                alt={`Zoom ${showKeystroke}`}
              />
            </KeystrokeIndicator>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              style={{
                color: '#e74c3c',
                textAlign: 'center',
                marginTop: '1rem',
                fontSize: '0.9rem'
              }}
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>
      </ContentBox>

      <FooterHint>
        Semantic Pinching 🤏
        <br />
        On mobile/tablet, pinch in/out. On computer, use up/down arrow keys.
        Code at <a href="https://github.com/chuanenlin/semanticpinching" target="_blank" rel="noopener noreferrer">https://github.com/chuanenlin/semanticpinching</a>.
      </FooterHint>
    </Container>
  );
}
