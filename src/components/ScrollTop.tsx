import { Button } from './Button';
import { ArrowUpIcon } from './icons';
import { scrollToTarget } from '../lib/scroll';

export function ScrollTop({ visible, label }: { visible: boolean; label: string }) {
  return (
    <Button
      className={`scroll-top${visible ? ' visible' : ''}`}
      aria-label={label}
      onClick={() => { scrollToTarget(0); }}
    >
      <ArrowUpIcon />
    </Button>
  );
}
