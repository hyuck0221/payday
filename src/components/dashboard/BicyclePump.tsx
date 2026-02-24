import { useCallback } from 'react';
import { motion, useSpring } from 'framer-motion';

interface Props {
  onPump: () => void;
}

export function BicyclePump({ onPump }: Props) {
  // 손잡이 y 오프셋 (0 = 위, 26 = 아래로 눌림)
  const handleY = useSpring(0, { stiffness: 700, damping: 35 });

  const onPress = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleY.set(26);
    onPump();
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
  }, [handleY, onPump]);

  const onRelease = useCallback(() => {
    handleY.set(0);
  }, [handleY]);

  return (
    <div
      className="cursor-pointer select-none"
      style={{ touchAction: 'none' }}
      title="손잡이를 눌러보세요!"
      onPointerDown={onPress}
      onPointerUp={onRelease}
      onPointerCancel={onRelease}
    >
      {/*
        SVG 구조:
        - 실린더 + 베이스: 고정 (static)
        - 손잡이(T-바) + 피스톤 로드: 애니메이션
        - 호스: 베이스에서 오른쪽 게이지 바 높이로 커브
        overflow="visible" → SVG 경계 밖으로 호스가 삐져나와도 렌더링
      */}
      <svg
        width="56"
        height="145"
        viewBox="0 0 56 145"
        style={{ overflow: 'visible' }}
        aria-hidden="true"
      >
        {/* ── 고정 파트 ── */}

        {/* 실린더 외벽 */}
        <rect x="18" y="56" width="20" height="72" rx="5" fill="#94a3b8" />
        {/* 실린더 내벽 (밝은 색) */}
        <rect x="21" y="59" width="14" height="66" rx="3" fill="#e2e8f0" />
        {/* 하이라이트 */}
        <rect x="21" y="59" width="4" height="66" rx="2" fill="white" opacity="0.35" />

        {/* 베이스 */}
        <rect x="7" y="126" width="42" height="16" rx="5" fill="#334155" />
        <rect x="7" y="126" width="42" height="6"  rx="5" fill="#475569" />

        {/* 호스: 베이스 우측 → 오른쪽 위(게이지 바 높이)로 커브 */}
        <path
          d="M 49 134 C 75 134 80 72 95 72"
          stroke="#475569"
          strokeWidth="5"
          strokeLinecap="round"
          fill="none"
        />
        {/* 호스 연결부 */}
        <circle cx="49" cy="134" r="5" fill="#334155" />
        {/* 호스 끝단 노즐 */}
        <rect x="91" y="68" width="10" height="8" rx="3" fill="#334155" />

        {/* ── 애니메이션 파트 (손잡이 + 피스톤 로드) ── */}
        <motion.g style={{ y: handleY }}>
          {/* T-바 수평 손잡이 */}
          <rect x="2"  y="3"  width="52" height="14" rx="7" fill="#1e293b" />
          {/* 그립 텍스처 */}
          <rect x="8"  y="6"  width="3" height="8" rx="1.5" fill="#374151" />
          <rect x="13" y="6"  width="3" height="8" rx="1.5" fill="#374151" />
          <rect x="40" y="6"  width="3" height="8" rx="1.5" fill="#374151" />
          <rect x="45" y="6"  width="3" height="8" rx="1.5" fill="#374151" />
          {/* 중앙 커넥터 */}
          <rect x="22" y="2"  width="12" height="18" rx="4" fill="#0f172a" />
          {/* 피스톤 로드 */}
          <rect x="24" y="20" width="8"  height="46" rx="3" fill="#475569" />
          {/* 피스톤 캡 */}
          <rect x="19" y="60" width="18" height="8"  rx="3" fill="#64748b" />
        </motion.g>
      </svg>
    </div>
  );
}
