import { KeyDefinition } from '../types';

export const KEYBOARD_OVERVIEW = {
  totalKeysStandard: '104 keys (US ANSI layout) or 105 keys (UK/International ISO layout)',
  laptopCompactKeys: '84 to 87 keys (tenkeyless without dedicated numpad)',
  coreSections: [
    'Alphanumeric Section (letters, numbers, space, punctuation)',
    'Function Row (F1 through F12 + Escape)',
    'Navigation Cluster (Arrow keys, Home, End, Page Up, Page Down, Delete)',
    'Modifier Keys (Ctrl, Alt, Shift, Windows / Super)',
    'Numeric Keypad (Right-hand 17-key arithmetic calculator layout)'
  ]
};

export const KEYBOARD_KEYS_EXPLANATIONS: KeyDefinition[] = [
  {
    id: 'total-keys',
    name: 'Total Keys on a Standard PC Keyboard',
    category: 'control',
    keyLabel: '104 / 105 Keys',
    description: 'A standard full-size desktop computer keyboard has 104 keys (standard US layout) or 105 keys (international ISO layout). Modern compact keyboards may have 84 to 87 keys by removing the numeric pad.',
    commonUse: 'Divided into 5 distinct zones: Typewriter keys, Function keys, Cursor navigation keys, System modifier keys, and the Numeric keypad.',
    shortcutTip: 'Standard desktop layouts give your fingers dedicated ergonomic zones for maximum typing speed.'
  },
  {
    id: 'alphabet-keys',
    name: 'Alphabet Keys (A to Z)',
    category: 'alphabet',
    keyLabel: 'A — Z',
    description: 'There are 26 alphabet keys arranged in the famous QWERTY layout. They are arranged across three rows: Top Row (Q to P), Home Row (A to L), and Bottom Row (Z to M).',
    commonUse: 'Used for writing words, sentences, stories, emails, and code. Home row keys (A S D F and J K L ;) are where your fingers always rest.',
    shortcutTip: 'The F and J keys have small tactile raised bumps to help you find your finger position without looking down at the keyboard!'
  },
  {
    id: 'number-keys',
    name: 'Number Keys (0 to 9)',
    category: 'number',
    keyLabel: '1 — 0',
    description: 'Located in a straight horizontal row directly above the top alphabet row, containing numerals 1, 2, 3, 4, 5, 6, 7, 8, 9, and 0.',
    commonUse: 'Used to enter quantities, phone numbers, years, and prices. When pressed with the Shift key, each number key produces important punctuation symbols like !, @, #, $, %, etc.',
    shortcutTip: 'Use your left hand for numbers 1 to 5 and your right hand for numbers 6 to 0.'
  },
  {
    id: 'function-keys',
    name: 'Function Keys (F1 through F12)',
    category: 'function',
    keyLabel: 'F1 — F12',
    description: 'A dedicated top row of 12 keys labeled F1 through F12. These perform special shortcut commands programmed by your operating system or active application.',
    commonUse: 'F1 opens help manuals, F5 refreshes a webpage, F11 toggles full-screen mode, and F12 opens web developer inspect tools.',
    shortcutTip: 'On laptops, hold the "Fn" key if your function keys are shared with volume or screen brightness controls.'
  },
  {
    id: 'enter-key',
    name: 'Enter / Return Key',
    category: 'control',
    keyLabel: 'Enter ↵',
    description: 'One of the most important keys on the keyboard. It tells the computer to submit an instruction, execute a command, or move the text cursor down to start a brand-new line.',
    commonUse: 'Submitting web search queries, sending chat messages, and creating new paragraphs in word processors.',
    shortcutTip: 'Operate the Enter key using the little pinky finger of your right hand while keeping other fingers near the home row.'
  },
  {
    id: 'spacebar',
    name: 'Spacebar',
    category: 'control',
    keyLabel: 'Spacebar ␣',
    description: 'The longest horizontal key located at the very bottom center of the keyboard. Pressing it inserts a blank horizontal space between letters and words.',
    commonUse: 'Separating words as you type sentences, or pausing video playback on websites like YouTube.',
    shortcutTip: 'Always press the spacebar with either your left or right thumb. Never use your index finger for the spacebar.'
  },
  {
    id: 'backspace',
    name: 'Backspace Key',
    category: 'control',
    keyLabel: 'Backspace ⌫',
    description: 'Located at the top right of the main typewriter section. It deletes the single character immediately to the LEFT (behind) your blinking cursor.',
    commonUse: 'Quickly fixing typos, deleting incorrect letters, or going back to the previous folder in file explorers.',
    shortcutTip: 'Hold Ctrl + Backspace to erase an entire word at once instead of letter-by-letter!'
  },
  {
    id: 'delete-key',
    name: 'Delete (Del) Key',
    category: 'navigation',
    keyLabel: 'Delete',
    description: 'Unlike Backspace which erases backward, the Delete key erases the character positioned directly in FRONT (to the right) of your cursor, or removes highlighted files.',
    commonUse: 'Deleting files into the Recycle Bin, removing forward characters, or cleaning up tables and spreadsheet cells.',
    shortcutTip: 'Press Shift + Delete in Windows to permanently delete a file without sending it to the Recycle Bin.'
  },
  {
    id: 'esc-key',
    name: 'Escape (Esc) Key',
    category: 'control',
    keyLabel: 'Esc',
    description: 'Located at the top-leftmost corner of the keyboard. It cancels the current task, closes popups/dialog boxes, or exits full-screen viewing mode.',
    commonUse: 'Stopping an accidental webpage load, closing modals, canceling a mistaken drag-and-drop, or pausing computer games.',
    shortcutTip: 'Press Ctrl + Shift + Esc directly to immediately open the Windows Task Manager.'
  },
  {
    id: 'tab-key',
    name: 'Tab Key (Tab ⇥)',
    category: 'control',
    keyLabel: 'Tab ⇥',
    description: 'Stands for "Tabulator". It advances your text cursor several spaces forward (usually 4 or 8 spaces), creates an indent, or jumps between input fields on a form.',
    commonUse: 'Moving to the next field in a web form (like jumping from Gmail to Password) without touching your mouse.',
    shortcutTip: 'Press Alt + Tab to rapidly switch between open software applications!'
  },
  {
    id: 'shift-key',
    name: 'Shift Keys (Left & Right)',
    category: 'control',
    keyLabel: 'Shift ⇧',
    description: 'Keyboards have two Shift keys (one on the left, one on the right). Holding Shift while pressing a letter types a CAPITAL letter, or activates the top symbol on a number key.',
    commonUse: 'Typing uppercase letters (Shift + a = A) and special punctuation like ! (Shift + 1) or ? (Shift + /).',
    shortcutTip: 'Typing rule: If the letter you want is on your left hand, hold the right Shift key; if the letter is on your right hand, hold the left Shift key!'
  },
  {
    id: 'caps-lock-key',
    name: 'Caps Lock Key',
    category: 'control',
    keyLabel: 'Caps Lock ⇪',
    description: 'A toggle lock key located right above the left Shift key. When turned ON, all letters you type automatically become CAPITAL LETTERS until you press it again.',
    commonUse: 'Writing acronyms, headings, legal terms, or typing long UPPERCASE text strings without holding down Shift.',
    shortcutTip: 'Look for the tiny LED light indicator on your keyboard or screen to know if Caps Lock is currently activated.'
  },
  {
    id: 'ctrl-key',
    name: 'Control (Ctrl) Key',
    category: 'control',
    keyLabel: 'Ctrl',
    description: 'A powerful modifier key located at the bottom-left and bottom-right edges. It is held down in combination with other keys to perform computer shortcuts.',
    commonUse: 'Ctrl + C (Copy), Ctrl + V (Paste), Ctrl + X (Cut), Ctrl + Z (Undo), Ctrl + S (Save file), and Ctrl + A (Select All).',
    shortcutTip: 'Ctrl shortcuts save hours of manual mouse clicking in every program.'
  },
  {
    id: 'alt-key',
    name: 'Alternate (Alt) Key',
    category: 'control',
    keyLabel: 'Alt',
    description: 'Located directly to the left and right of the spacebar. It alternates the normal function of keys to access program menus and special characters.',
    commonUse: 'Alt + F4 closes the active window, Alt + Enter shows file properties, and Alt + Tab switches tasks.',
    shortcutTip: 'On keyboards with Alt Gr (right side), it accesses third-level currency symbols like € or ¥.'
  },
  {
    id: 'windows-key',
    name: 'Windows Key / Super Key',
    category: 'control',
    keyLabel: '⊞ Win',
    description: 'Displays the Microsoft Windows logo. Pressing it pops up the Start menu. In combination with other keys, it manages windows and system features.',
    commonUse: 'Opening Start menu, Win + D (show desktop), Win + E (open File Explorer), Win + L (lock computer screen).',
    shortcutTip: 'Press Win + Period (.) to open the built-in Windows Emoji & Symbol keyboard!'
  },
  {
    id: 'arrow-keys',
    name: 'Arrow Keys (Cursor Keys)',
    category: 'navigation',
    keyLabel: '↑ ↓ ← →',
    description: 'A group of four inverted-T keys: Up Arrow, Down Arrow, Left Arrow, and Right Arrow. They navigate the cursor or scroll through content.',
    commonUse: 'Fine-tuning cursor position between letters in text, scrolling web articles, and steering vehicles or characters in games.',
    shortcutTip: 'Hold Ctrl while pressing Left/Right Arrow to jump whole words instead of single letters!'
  },
  {
    id: 'home-key',
    name: 'Home Key',
    category: 'navigation',
    keyLabel: 'Home',
    description: 'Located in the navigation cluster above the arrow keys. Instantly jumps your cursor to the very beginning of the current text line or top of a webpage.',
    commonUse: 'Quick navigation without dragging the scrollbar or repeatedly tapping the left arrow.',
    shortcutTip: 'Press Ctrl + Home to leap straight to the absolute first line of an entire multi-page document.'
  },
  {
    id: 'end-key',
    name: 'End Key',
    category: 'navigation',
    keyLabel: 'End',
    description: 'The opposite partner of the Home key. It instantly teleports the text cursor to the very end of the current sentence line or bottom of a web document.',
    commonUse: 'Adding punctuation to the end of a line, or jumping quickly to article footers.',
    shortcutTip: 'Press Ctrl + End to jump directly to the final line or paragraph of any document.'
  },
  {
    id: 'page-up-key',
    name: 'Page Up (PgUp) Key',
    category: 'navigation',
    keyLabel: 'PgUp ⇞',
    description: 'Scrolls the viewing screen or document upward by exactly one full visible page screen height at a time.',
    commonUse: 'Reading long PDF books, articles, or spreadsheets quickly without using the mouse scroll wheel.',
    shortcutTip: 'Great for rapid document review when skimming through textbooks or reports.'
  },
  {
    id: 'page-down-key',
    name: 'Page Down (PgDn) Key',
    category: 'navigation',
    keyLabel: 'PgDn ⇟',
    description: 'Scrolls the viewing screen or document downward by exactly one full visible page screen height.',
    commonUse: 'Reading down long terms of service, eBooks, contracts, and websites effortlessly.',
    shortcutTip: 'Combine with the spacebar (which also scrolls down in web browsers) for reading comfort.'
  },
  {
    id: 'number-pad',
    name: 'Numeric Keypad (Numpad)',
    category: 'numpad',
    keyLabel: 'Numpad [0-9 + - * /]',
    description: 'A 17-key grid located on the far right of full-size keyboards that mimics an accounting calculator with numbers 0-9, arithmetic signs, and dedicated Enter.',
    commonUse: 'High-speed numerical data entry for accountants, bank clerks, cashiers, math students, and data scientists.',
    shortcutTip: 'Remember to press the "Num Lock" key to toggle the numpad between numbers and secondary arrow navigation.'
  },
  {
    id: 'special-symbol-keys',
    name: 'Special & Symbol Keys',
    category: 'symbol',
    keyLabel: '! @ # $ % & * ( ) _ + { } [ ] : " < > ?',
    description: 'All punctuation marks and mathematical/programming characters. Located on the number row and right-side typewriter cluster.',
    commonUse: 'Email addresses (@), financial amounts ($ / € / ₹), percentages (%), hashtags (#), code brackets ({ }, [ ]), and sentences (. , ; : ! ?).',
    shortcutTip: 'Most symbol keys have two characters printed on them. Press alone for the bottom symbol, or hold Shift for the top symbol!'
  }
];
