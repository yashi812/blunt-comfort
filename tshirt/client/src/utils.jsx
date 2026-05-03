export const tee = (fill, g, tf) => {
  const blank = g === 'blank';
  return (
    <svg viewBox="0 0 300 360" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M28 58 L0 132 L58 148 L58 342 L242 342 L242 148 L300 132 L272 58 L210 72 Q150 108 90 72 Z" fill={fill}/>
      <path d="M90 72 Q150 115 210 72" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" fill="none"/>
      <line x1="58" y1="152" x2="58" y2="335" stroke="rgba(255,255,255,0.04)" strokeWidth="1"/>
      <line x1="242" y1="152" x2="242" y2="335" stroke="rgba(255,255,255,0.04)" strokeWidth="1"/>
      {!blank && (
        <>
          <text x="150" y="228" fill={tf} fontFamily="'Syne',sans-serif" fontWeight="800" fontSize="34" textAnchor="middle" letterSpacing="5">{g}</text>
          <text x="150" y="249" fill={tf} fontFamily="'Geist Mono',monospace" fontSize="6.5" textAnchor="middle" letterSpacing="3" opacity="0.4">BLUNT STUDIO</text>
        </>
      )}
    </svg>
  );
};

export const bdg = { new: 'b-new', low: 'b-low', sold: 'b-sold', drop: 'b-drop', col: 'b-col' };
export const bdgL = { new: 'New', low: 'Low Stock', sold: 'Sold Out', drop: 'Drop', col: 'Collab' };
