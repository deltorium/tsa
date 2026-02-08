import { useState, useEffect, useCallback } from 'react';

interface EndingPanelProps {
  onRestart: () => void;
}

export function EndingPanel({ onRestart }: EndingPanelProps) {
  const [choice, setChoice] = useState<'none' | 'forgive' | 'file'>('none');
  const [fileRevealed, setFileRevealed] = useState(false);
  const [flashRed, setFlashRed] = useState(false);
  const [glitchActive, setGlitchActive] = useState(false);

  const startDestruction = useCallback(() => {
    setFileRevealed(true);
    setTimeout(() => {
      setFlashRed(true);
      setGlitchActive(true);
    }, 2000);
  }, []);

  useEffect(() => {
    if (choice === 'file') {
      startDestruction();
    }
  }, [choice, startDestruction]);

  useEffect(() => {
    if (!flashRed) return;
    const interval = setInterval(() => {
      setFlashRed((prev) => !prev);
    }, 300);
    return () => clearInterval(interval);
  }, [flashRed]);

  if (choice === 'none') {
    return (
      <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
        <div className="bg-gradient-to-b from-gray-800 to-gray-900 border-2 border-pink-600 rounded-2xl p-6 max-w-md w-full space-y-6 animate-fade-in text-center">
          <div className="text-4xl">💔</div>
          <h2 className="text-xl font-bold text-pink-400">
            Тимофей-тян призналась...
          </h2>
          <p className="text-gray-300 text-sm">
            Она переспала кое с кем. Что вы хотите сделать?
          </p>

          <div className="space-y-3">
            <button
              onClick={() => setChoice('forgive')}
              className="w-full bg-pink-600 hover:bg-pink-500 text-white font-bold py-3 px-6 rounded-full transition-all duration-200 hover:scale-105 text-sm"
            >
              💕 Простить и продолжить отношения
            </button>
            <button
              onClick={() => setChoice('file')}
              className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-full transition-all duration-200 hover:scale-105 text-sm border border-gray-500"
            >
              📂 Открыть секретный файл
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (choice === 'forgive') {
    return (
      <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
        <div className="bg-gradient-to-b from-pink-900 to-gray-900 border-2 border-pink-500 rounded-2xl p-8 max-w-md text-center space-y-4 animate-fade-in">
          <div className="text-6xl">💖</div>
          <div className="w-20 h-20 rounded-full overflow-hidden mx-auto border-2 border-pink-400">
            <img
              src="https://i.postimg.cc/bJ984VmH/images-(5).jpg"
              alt="Тимофей-тян"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="bg-black/40 rounded-lg p-4">
            <div className="text-pink-400 text-xs font-medium mb-1">Тимофей-тян:</div>
            <p className="text-white text-lg leading-relaxed">
              Спасибо милый! Я тебя никогда не предам! 💕
            </p>
          </div>
          <div className="text-gray-500 text-xs italic mt-2">
            ...или предаст?
          </div>
          <button
            onClick={onRestart}
            className="mt-4 bg-pink-600 hover:bg-pink-500 text-white font-bold py-3 px-8 rounded-full transition-all duration-200 hover:scale-105"
          >
            Играть снова
          </button>
        </div>
      </div>
    );
  }

  // File ending
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-colors duration-300 ${
        flashRed ? 'bg-red-900/95' : 'bg-black/95'
      }`}
    >
      {/* Glitch overlay */}
      {glitchActive && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-full h-4 bg-red-500/20"
              style={{
                top: `${Math.random() * 100}%`,
                animation: `glitch-line ${0.1 + Math.random() * 0.3}s ease-in-out infinite alternate`,
                animationDelay: `${Math.random() * 0.5}s`,
              }}
            />
          ))}
        </div>
      )}

      <div
        className={`max-w-md w-full space-y-4 animate-fade-in ${
          glitchActive ? 'animate-shake' : ''
        }`}
      >
        {/* File header */}
        <div className="bg-gray-800 border border-gray-600 rounded-lg overflow-hidden">
          <div className="bg-gray-700 px-4 py-2 flex items-center gap-2 text-gray-300 text-sm">
            <span>📂</span>
            <span>secret_file.txt</span>
            <span className="ml-auto text-red-400 text-xs">
              {glitchActive ? '⚠️ ОШИБКА' : ''}
            </span>
          </div>
          <div className="p-4">
            {fileRevealed ? (
              <div className="space-y-3">
                <p
                  className={`text-sm leading-relaxed transition-colors duration-300 ${
                    flashRed ? 'text-red-300' : 'text-white'
                  }`}
                >
                  Ха! Вы правда думали что моего бота так легко расколоть?!
                </p>
                {glitchActive && (
                  <>
                    <p className="text-red-400 text-sm font-bold animate-pulse">
                      ⚠️ *процедура самоуничтожения запущена*
                    </p>
                    <p className="text-red-300 text-sm">Пока-пока, неудачник!.. 😘</p>
                  </>
                )}
                <div className="border-t border-gray-600 pt-3 mt-3">
                  <p className="text-gray-400 text-xs italic text-right">
                    Подпись: "Ваш квакшечка♥️"...
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center py-8">
                <div className="text-gray-500 text-sm animate-pulse">Загрузка файла...</div>
              </div>
            )}
          </div>
        </div>

        {glitchActive && (
          <div className="text-center space-y-3 mt-4">
            <div className="text-red-500 text-xs font-mono animate-pulse">
              SYSTEM ERROR: SELF-DESTRUCT INITIATED
            </div>
            <button
              onClick={onRestart}
              className="bg-red-700 hover:bg-red-600 text-white font-bold py-3 px-8 rounded-full transition-all duration-200 hover:scale-105 animate-pulse"
            >
              🔄 Начать заново
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
