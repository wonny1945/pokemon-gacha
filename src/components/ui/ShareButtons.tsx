'use client'
import { Linkedin, Instagram, Share2 } from 'lucide-react';
import { useState } from 'react';
import { cn } from "@/lib/utils";
import ThreadsIcon from '@/components/ui/ThreadsIcon';
import XIcon from './XIcon';

interface IShareButtonsProps {
  pokemonName: string;
  cardRarity: string;
}

export default function ShareButtons({ pokemonName, cardRarity }: IShareButtonsProps) {
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [hoveredPlatform, setHoveredPlatform] = useState<string | null>(null);

  // 등급별 한글 매핑
  const rarityText = {
    common: { text: '일반', icon: '⭐' },
    rare: { text: '희귀', icon: '✨' },
    legendary: { text: '전설', icon: '👑' },
  };

  const createShareText = () => {
    const grade = rarityText[cardRarity as keyof typeof rarityText] || '일반';
    
    return `포켓몬 가챠에서 ${pokemonName}(${grade.text}${grade.icon})을 뽑았어요!\n\n 당신도 아래 주소에서 행운의 포켓몬 뽑기를 시험해보세요!\n`;
  };

  const handleShare = (platform: string) => {
    const shareText = createShareText();
    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

    switch (platform) {
      case 'twitter':
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
          '_blank'
        );
        break;
      case 'linkedin':
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText + '\n' + shareUrl)}`,
          '_blank'
        );
        break;
      case 'instagram':
        // 클립보드에 복사
        navigator.clipboard.writeText(`${shareText}\n${shareUrl}`).then(() => {
          alert('텍스트가 클립보드에 복사되었습니다! Instagram에서 붙여넣기 해주세요.');
          window.open('https://instagram.com', '_blank');
        });
        break;
      case 'threads':
        navigator.clipboard.writeText(`${shareText}\n${shareUrl}`).then(() => {
          alert('텍스트가 클립보드에 복사되었습니다! Threads에서 붙여넣기 해주세요.');
          window.open('https://threads.net', '_blank');
        });
        break;
    }
  };

  return (
    <div className="relative flex flex-col items-center">
      {/* 호버 시 나타나는 미리보기 */}
      <div 
        className={cn(
          "absolute bottom-full mb-4 w-full max-w-md",
          "transform transition-all duration-300 ease-in-out",
          isPreviewVisible 
            ? "opacity-100 translate-y-0" 
            : "opacity-0 translate-y-2 pointer-events-none"
        )}
      >
        <div className="bg-gray-900/95 backdrop-blur-sm text-white p-4 rounded-lg shadow-lg text-sm">
          <p className="font-medium text-gray-200 mb-2">
            {hoveredPlatform ? `${hoveredPlatform}에 공유될 메시지` : '공유될 메시지 미리보기'}
          </p>
          <p className="text-gray-100 break-words">{createShareText()}</p>
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
            <div className="border-8 border-transparent border-t-gray-900/95" />
          </div>
        </div>
      </div>

      {/* 공유 버튼들 */}
      <div 
        className="flex gap-4 justify-center"
        onMouseEnter={() => setIsPreviewVisible(true)}
        onMouseLeave={() => {
          setIsPreviewVisible(false);
          setHoveredPlatform(null);
        }}
      >
        <button
          onClick={() => handleShare('twitter')}
          onMouseEnter={() => setHoveredPlatform('X(Twitter)')}
          onMouseLeave={() => setHoveredPlatform(null)}
          className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center hover:bg-opacity-90 transition-all duration-200 hover:scale-110 hover:shadow-lg"
          aria-label="Share on X(Twitter)"
        >
          <XIcon size={24} />
        </button>
        
        <button
          onClick={() => handleShare('linkedin')}
          onMouseEnter={() => setHoveredPlatform('LinkedIn')}
          onMouseLeave={() => setHoveredPlatform(null)}
          className="w-12 h-12 rounded-full bg-[#0A66C2] text-white flex items-center justify-center hover:bg-opacity-90 transition-all duration-200 hover:scale-110 hover:shadow-lg"
          aria-label="Share on LinkedIn"
        >
          <Linkedin size={24} />
        </button>
        
        <button
          onClick={() => handleShare('instagram')}
          onMouseEnter={() => setHoveredPlatform('Instagram')}
          onMouseLeave={() => setHoveredPlatform(null)}
          className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#FD1D1D] via-[#E1306C] to-[#C13584] text-white flex items-center justify-center hover:bg-opacity-90 transition-all duration-200 hover:scale-110 hover:shadow-lg"
          aria-label="Share on Instagram"
        >
          <Instagram size={24} />
        </button>
        
        <button
          onClick={() => handleShare('threads')}
          onMouseEnter={() => setHoveredPlatform('Threads')}
          onMouseLeave={() => setHoveredPlatform(null)}
          className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center hover:bg-opacity-90 transition-all duration-200 hover:scale-110 hover:shadow-lg"
          aria-label="Share on Threads"
        >
          <ThreadsIcon className="w-6 h-6" />
        </button>
        
        <button
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: '포켓몬 가챠 결과',
                text: createShareText(),
                url: window.location.href,
              }).catch(console.error);
            } else {
              navigator.clipboard.writeText(`${createShareText()}\n${window.location.href}`).then(() => {
                alert('링크가 클립보드에 복사되었습니다!');
              });
            }
          }}
          onMouseEnter={() => setHoveredPlatform('공유하기')}
          onMouseLeave={() => setHoveredPlatform(null)}
          className="w-12 h-12 rounded-full bg-gray-600 text-white flex items-center justify-center hover:bg-opacity-90 transition-all duration-200 hover:scale-110 hover:shadow-lg"
          aria-label="Share"
        >
          <Share2 size={24} />
        </button>
      </div>
    </div>
  );
} 