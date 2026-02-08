import { useState } from 'react';
import { dialogueSteps, TIMOFEY_AVATAR } from '../data/gameData';

interface InterrogationRoomProps {
  dialoguePhase: number;
  setDialoguePhase: (phase: number) => void;
  onConfession: () => void;
}

export function InterrogationRoom({ dialoguePhase, setDialoguePhase, onConfession }: InterrogationRoomProps) {
  const [wrongAnswer, setWrongAnswer] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showConfession, setShowConfession] = useState(false);

  const currentStep = dialoguePhase < dialogueSteps.length ? dialogueSteps[dialoguePhase] : null;

  const handleOption = (isCorrect: boolean) => {
    if (isAnimating) return;
    setIsAnimating(true);

    if (isCorrect) {
      setWrongAnswer(false);
      setTimeout(() => {
        if (dialoguePhase >= dialogueSteps.length - 1) {
          setShowConfession(true);
          onConfession();
        } else {
          setDialoguePhase(dialoguePhase + 1);
        }
        setIsAnimating(false);
      }, 800);
    } else {
      setWrongAnswer(true);
      setTimeout(() => {
        setDialoguePhase(0);
        setWrongAnswer(false);
        setIsAnimating(false);
      }, 1500);
    }
  };

  return (
    <div className="flex flex-col h-full relative overflow-hidden">
      {/* Interrogation room background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-800 via-gray-700 to-gray-900">
        {/* Light cone from above */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-full opacity-20"
          style={{
            background: 'radial-gradient(ellipse at top, rgba(255,220,100,0.6) 0%, transparent 70%)',
          }}
        />
        {/* Wall texture */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'repeating-linear-gradient(90deg, transparent, transparent 50px, rgba(0,0,0,0.1) 50px, rgba(0,0,0,0.1) 51px)',
          }}
        />
      </div>

      {/* Lamp */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 z-10">
        <div className="w-1 h-8 bg-gray-500 mx-auto" />
        <div className="w-20 h-8 bg-gradient-to-b from-gray-600 to-green-800 rounded-b-full shadow-lg shadow-yellow-500/30 flex items-end justify-center">
          <div className="w-2 h-2 bg-yellow-300 rounded-full mb-1 shadow-lg shadow-yellow-400/60 animate-pulse" />
        </div>
      </div>

      {/* Table */}
      <div className="absolute bottom-28 left-0 right-0 h-20 z-10">
        <div className="absolute inset-x-0 top-0 h-4 bg-gradient-to-b from-amber-800 to-amber-900 rounded-t-sm" />
        <div className="absolute inset-x-4 top-4 bottom-0 bg-gradient-to-b from-amber-900 to-amber-950" />
        <div className="absolute inset-x-0 top-0 h-2 bg-amber-700 opacity-50 rounded-t-sm" />
      </div>

      {/* Character - Тимофей-тян image */}
      <div className="absolute bottom-32 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
        <div className="relative">
          <div className={`w-28 h-28 rounded-full overflow-hidden border-3 border-pink-400/60 shadow-lg shadow-pink-500/20 transition-all duration-300 ${wrongAnswer ? 'animate-shake ring-4 ring-red-500' : ''}`}>
            <img
              src={TIMOFEY_AVATAR}
              alt="Тимофей-тян"
              className="w-full h-full object-cover"
            />
          </div>
          {/* Name tag */}
          <div className="mt-2 bg-white/10 backdrop-blur px-3 py-0.5 rounded text-white text-xs border border-white/20 text-center">
            Тимофей-тян
          </div>
        </div>
      </div>

      {/* Dialogue area */}
      <div className="absolute bottom-0 left-0 right-0 z-30 p-3">
        {/* Wrong answer flash */}
        {wrongAnswer && (
          <div className="bg-red-900/80 backdrop-blur-sm border border-red-500 rounded-lg p-3 mb-2 animate-fade-in">
            <div className="text-red-300 text-sm text-center font-medium">
              ❌ Неправильный ответ! Допрос начинается заново...
            </div>
          </div>
        )}

        {/* Confession */}
        {showConfession && (
          <div className="bg-black/80 backdrop-blur-sm border border-pink-500/50 rounded-lg p-3 mb-2 animate-fade-in">
            <div className="text-pink-400 text-xs font-medium mb-1">Тимофей-тян:</div>
            <div className="text-white text-sm leading-relaxed">
              Ладно... Я переспала кое с кем...
            </div>
          </div>
        )}

        {/* Current dialogue */}
        {currentStep && !wrongAnswer && !showConfession && (
          <>
            <div className="bg-black/70 backdrop-blur-sm border border-gray-600 rounded-lg p-3 mb-2 animate-fade-in">
              <div className="text-pink-400 text-xs font-medium mb-1 flex items-center gap-1">
                <img src={TIMOFEY_AVATAR} alt="" className="w-4 h-4 rounded-full object-cover" />
                Тимофей-тян:
              </div>
              <div className="text-white text-sm leading-relaxed">{currentStep.timofeyText}</div>
            </div>

            <div className="space-y-1.5">
              <div className="text-gray-400 text-xs uppercase tracking-wider mb-1.5">
                Выберите ответ:
              </div>
              {currentStep.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleOption(option.isCorrect)}
                  disabled={isAnimating}
                  className="w-full text-left bg-blue-900/50 hover:bg-blue-800/60 border border-blue-700/50 hover:border-blue-500/50 rounded-lg px-3 py-2 text-white text-sm transition-all duration-200 hover:translate-x-1 disabled:opacity-50"
                >
                  <span className="text-blue-400 mr-1.5">▸</span>
                  {option.text}
                </button>
              ))}
            </div>
          </>
        )}

        {/* After confession - waiting for suspicious messages */}
        {showConfession && (
          <div className="mt-2 bg-yellow-900/30 border border-yellow-600/40 rounded-lg p-2 text-center">
            <div className="text-yellow-400 text-xs">
              💡 Найдите все подозрительные сообщения в чатах, нажимая на них
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
