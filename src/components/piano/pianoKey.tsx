type PianoKeyProps = {
  isBlack: boolean;
  isActive: boolean;
  isRoot: boolean;
  leftPercent?: number;
  onPress: () => void;
};

export default function (p: PianoKeyProps) {
  const className = [
    'piano-key',
    p.isBlack ? 'piano-key-black' : 'piano-key-white',
    p.isActive ? 'is-active' : '',
    p.isRoot ? 'is-root' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const style = p.isBlack && p.leftPercent !== undefined ? { left: `${p.leftPercent}%` } : undefined;

  return <div className={className} style={style} onClick={p.onPress} />;
}
