import React from 'react';

interface VirtualKeyboardProps {
  activeKeyId?: string;
  onSelectKeyId?: (keyId: string) => void;
  pressedKey?: string;
}

export const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({
  activeKeyId,
  onSelectKeyId,
  pressedKey
}) => {
  // Simplified realistic keyboard rows with interactive key mappings
  const functionRow = [
    { label: 'Esc', id: 'esc-key', width: 'w-10' },
    { label: 'F1', id: 'function-keys', width: 'w-9' },
    { label: 'F2', id: 'function-keys', width: 'w-9' },
    { label: 'F3', id: 'function-keys', width: 'w-9' },
    { label: 'F4', id: 'function-keys', width: 'w-9' },
    { label: 'F5', id: 'function-keys', width: 'w-9' },
    { label: 'F6', id: 'function-keys', width: 'w-9' },
    { label: 'F7', id: 'function-keys', width: 'w-9' },
    { label: 'F8', id: 'function-keys', width: 'w-9' },
    { label: 'F9', id: 'function-keys', width: 'w-9' },
    { label: 'F10', id: 'function-keys', width: 'w-9' },
    { label: 'F11', id: 'function-keys', width: 'w-9' },
    { label: 'F12', id: 'function-keys', width: 'w-9' },
    { label: 'Del', id: 'delete-key', width: 'w-10' },
  ];

  const numberRow = [
    { label: '~ `', id: 'special-symbol-keys', width: 'w-9' },
    { label: '! 1', id: 'number-keys', width: 'w-9' },
    { label: '@ 2', id: 'number-keys', width: 'w-9' },
    { label: '# 3', id: 'number-keys', width: 'w-9' },
    { label: '$ 4', id: 'number-keys', width: 'w-9' },
    { label: '% 5', id: 'number-keys', width: 'w-9' },
    { label: '^ 6', id: 'number-keys', width: 'w-9' },
    { label: '& 7', id: 'number-keys', width: 'w-9' },
    { label: '* 8', id: 'number-keys', width: 'w-9' },
    { label: '( 9', id: 'number-keys', width: 'w-9' },
    { label: ') 0', id: 'number-keys', width: 'w-9' },
    { label: '_ -', id: 'special-symbol-keys', width: 'w-9' },
    { label: '+ =', id: 'special-symbol-keys', width: 'w-9' },
    { label: 'Backspace ⌫', id: 'backspace', width: 'flex-1 min-w-[64px]' },
  ];

  const topRow = [
    { label: 'Tab ⇥', id: 'tab-key', width: 'w-14' },
    { label: 'Q', id: 'alphabet-keys', width: 'w-9' },
    { label: 'W', id: 'alphabet-keys', width: 'w-9' },
    { label: 'E', id: 'alphabet-keys', width: 'w-9' },
    { label: 'R', id: 'alphabet-keys', width: 'w-9' },
    { label: 'T', id: 'alphabet-keys', width: 'w-9' },
    { label: 'Y', id: 'alphabet-keys', width: 'w-9' },
    { label: 'U', id: 'alphabet-keys', width: 'w-9' },
    { label: 'I', id: 'alphabet-keys', width: 'w-9' },
    { label: 'O', id: 'alphabet-keys', width: 'w-9' },
    { label: 'P', id: 'alphabet-keys', width: 'w-9' },
    { label: '{ [', id: 'special-symbol-keys', width: 'w-9' },
    { label: '} ]', id: 'special-symbol-keys', width: 'w-9' },
    { label: '| \\', id: 'special-symbol-keys', width: 'w-10' },
  ];

  const homeRow = [
    { label: 'Caps ⇪', id: 'caps-lock-key', width: 'w-16' },
    { label: 'A', id: 'alphabet-keys', width: 'w-9' },
    { label: 'S', id: 'alphabet-keys', width: 'w-9' },
    { label: 'D', id: 'alphabet-keys', width: 'w-9' },
    { label: 'F ·', id: 'alphabet-keys', width: 'w-9', bump: true },
    { label: 'G', id: 'alphabet-keys', width: 'w-9' },
    { label: 'H', id: 'alphabet-keys', width: 'w-9' },
    { label: 'J ·', id: 'alphabet-keys', width: 'w-9', bump: true },
    { label: 'K', id: 'alphabet-keys', width: 'w-9' },
    { label: 'L', id: 'alphabet-keys', width: 'w-9' },
    { label: ': ;', id: 'special-symbol-keys', width: 'w-9' },
    { label: '" \'', id: 'special-symbol-keys', width: 'w-9' },
    { label: 'Enter ↵', id: 'enter-key', width: 'flex-1 min-w-[70px]', accent: true },
  ];

  const bottomRow = [
    { label: 'Shift ⇧', id: 'shift-key', width: 'w-20' },
    { label: 'Z', id: 'alphabet-keys', width: 'w-9' },
    { label: 'X', id: 'alphabet-keys', width: 'w-9' },
    { label: 'C', id: 'alphabet-keys', width: 'w-9' },
    { label: 'V', id: 'alphabet-keys', width: 'w-9' },
    { label: 'B', id: 'alphabet-keys', width: 'w-9' },
    { label: 'N', id: 'alphabet-keys', width: 'w-9' },
    { label: 'M', id: 'alphabet-keys', width: 'w-9' },
    { label: '< ,', id: 'special-symbol-keys', width: 'w-9' },
    { label: '> .', id: 'special-symbol-keys', width: 'w-9' },
    { label: '? /', id: 'special-symbol-keys', width: 'w-9' },
    { label: 'Shift ⇧', id: 'shift-key', width: 'flex-1 min-w-[74px]' },
  ];

  const controlRow = [
    { label: 'Ctrl', id: 'ctrl-key', width: 'w-12' },
    { label: '⊞ Win', id: 'windows-key', width: 'w-11' },
    { label: 'Alt', id: 'alt-key', width: 'w-11' },
    { label: 'Spacebar ␣', id: 'spacebar', width: 'flex-1 min-w-[140px]', accent: true },
    { label: 'Alt', id: 'alt-key', width: 'w-11' },
    { label: 'Ctrl', id: 'ctrl-key', width: 'w-12' },
    { label: '←', id: 'arrow-keys', width: 'w-9' },
    { label: '↑ / ↓', id: 'arrow-keys', width: 'w-9' },
    { label: '→', id: 'arrow-keys', width: 'w-9' },
  ];

  const renderKey = (key: { label: string; id: string; width: string; accent?: boolean; bump?: boolean }, idx: number) => {
    const isSelected = activeKeyId === key.id;
    const isKeyPressed = pressedKey && (
      key.label.toLowerCase().includes(pressedKey.toLowerCase()) || 
      (pressedKey === ' ' && key.id === 'spacebar') ||
      (pressedKey === 'Enter' && key.id === 'enter-key') ||
      (pressedKey === 'Backspace' && key.id === 'backspace')
    );

    return (
      <button
        key={idx}
        type="button"
        onClick={() => onSelectKeyId?.(key.id)}
        className={`h-8 sm:h-9 ${key.width} rounded-md text-[10px] sm:text-xs font-mono font-medium flex flex-col items-center justify-center transition-all duration-150 select-none shadow-2xs relative shrink-0 cursor-pointer ${
          isKeyPressed
            ? 'bg-amber-400 text-slate-950 scale-95 ring-2 ring-amber-300 font-bold'
            : isSelected
            ? 'bg-indigo-600 text-white shadow-indigo-500/20 ring-2 ring-indigo-400 font-bold'
            : key.accent
            ? 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200/80 font-semibold'
            : 'bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 border border-slate-200/90'
        }`}
        title={`Click to read about: ${key.label}`}
      >
        <span className="truncate px-0.5">{key.label}</span>
        {key.bump && (
          <span className="w-1.5 h-0.5 bg-indigo-500 rounded-full mt-0.5" />
        )}
      </button>
    );
  };

  return (
    <div className="w-full bg-slate-100/90 p-3 sm:p-4 rounded-2xl border border-slate-200/90 shadow-xs overflow-x-auto">
      <div className="min-w-[620px] space-y-1.5">
        <div className="flex gap-1.5 justify-between">{functionRow.map(renderKey)}</div>
        <div className="flex gap-1.5">{numberRow.map(renderKey)}</div>
        <div className="flex gap-1.5">{topRow.map(renderKey)}</div>
        <div className="flex gap-1.5">{homeRow.map(renderKey)}</div>
        <div className="flex gap-1.5">{bottomRow.map(renderKey)}</div>
        <div className="flex gap-1.5">{controlRow.map(renderKey)}</div>
      </div>
      <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-500 px-1">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-indigo-500 inline-block animate-pulse"></span>
          Interactive Keyboard: Click any key to inspect its purpose & function
        </span>
        <span className="hidden sm:inline text-slate-400">
          Standard 104-Key US ANSI Physical Layout
        </span>
      </div>
    </div>
  );
};
