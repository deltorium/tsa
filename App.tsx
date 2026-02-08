import { useState, useCallback } from 'react';
import { InterrogationRoom } from './components/InterrogationRoom';
import { Phone } from './components/Phone';
import { EndingPanel } from './components/EndingPanel';
import { TOTAL_SUSPICIOUS } from './data/gameData';

type ActiveTab = 'room' | 'phone';
type GamePhase = 'playing' | 'ending';

export function App() {
  const [dialoguePhase, setDialoguePhase] = useState(0);
  const [confession, setConfession] = useState(false);
  const [foundSuspicious, setFoundSuspicious] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<ActiveTab>('room');
  const [gamePhase, setGamePhase] = useState<GamePhase>('playing');

  const handleSuspiciousFound = useCallback((msgId: string) => {
    setFoundSuspicious((prev) => {
      if (prev.includes(msgId)) return prev;
      return [...prev, msgId];
    });
  }, []);

  const handleConfession = useCallback(() => {
    setConfession(true);
  }, []);

  const allSuspiciousFound = foundSuspicious.length >= TOTAL_SUSPICIOUS;
  const canEnd = confession && allSuspiciousFound;

  const handleRestart = () => {
    setDialoguePhase(0);
    setConfession(false);
    setFoundSuspicious([]);
    setActiveTab('room');
    setGamePhase('playing');
  };

  return (
    <div className="h-screen w-screen bg-gray-900 flex flex-col overflow-hidden">
      {/* Top bar */}
      <div className="bg-gray-900 border-b border-gray-700 px-3 py-2 flex items-center justify-between z-40 flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          <span className="text-red-400 text-xs font-bold uppercase tracking-wider">REC</span>
          <span className="text-gray-500 text-xs">• Допрос Тимофей-тян</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-yellow-500 text-xs">
            ⚠️ {foundSuspicious.length}/{TOTAL_SUSPICIOUS}
          </span>
          {confession && (
            <>
              <span className="text-gray-600">|</span>
              <span className="text-green-400 text-xs">✅ Призналась</span>
            </>
          )}
        </div>
      </div>

      {/* Mobile tab switcher */}
      <div className="md:hidden flex border-b border-gray-700 flex-shrink-0">
        <button
          onClick={() => setActiveTab('room')}
          className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
            activeTab === 'room'
              ? 'bg-gray-800 text-yellow-400 border-b-2 border-yellow-400'
              : 'bg-gray-900 text-gray-500'
          }`}
        >
          🏢 Допрос
        </button>
        <button
          onClick={() => setActiveTab('phone')}
          className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
            activeTab === 'phone'
              ? 'bg-gray-800 text-blue-400 border-b-2 border-blue-400'
              : 'bg-gray-900 text-gray-500'
          }`}
        >
          📱 Телефон
        </button>
      </div>

      {/* Main game area */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Interrogation Room */}
        <div
          className={`${
            activeTab === 'room' ? 'flex' : 'hidden'
          } md:flex flex-col flex-1 min-h-0`}
        >
          <InterrogationRoom
            dialoguePhase={dialoguePhase}
            setDialoguePhase={setDialoguePhase}
            onConfession={handleConfession}
          />
        </div>

        {/* Divider */}
        <div className="hidden md:block w-px bg-gray-700 flex-shrink-0" />

        {/* Phone */}
        <div
          className={`${
            activeTab === 'phone' ? 'flex' : 'hidden'
          } md:flex flex-col md:w-[380px] lg:w-[420px] p-2 min-h-0 flex-shrink-0`}
        >
          <div className="flex-1 min-h-0 overflow-hidden">
            <Phone
              onSuspiciousFound={handleSuspiciousFound}
              foundSuspicious={foundSuspicious}
            />
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="bg-gray-900 border-t border-gray-700 px-3 py-2 flex items-center justify-between z-40 flex-shrink-0">
        <div className="flex items-center gap-2 text-xs">
          {!confession ? (
            <span className="text-gray-500">
              Допрос: этап {dialoguePhase + 1}/3
            </span>
          ) : !allSuspiciousFound ? (
            <span className="text-yellow-400 animate-pulse">
              ⚠️ Найдите подозрительные сообщения ({foundSuspicious.length}/{TOTAL_SUSPICIOUS})
            </span>
          ) : (
            <span className="text-green-400">✅ Все улики собраны!</span>
          )}
        </div>
        {canEnd && gamePhase === 'playing' && (
          <button
            onClick={() => setGamePhase('ending')}
            className="bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-5 rounded-full text-sm transition-all duration-200 hover:scale-105 shadow-lg shadow-red-900/50 animate-pulse-slow"
          >
            ⚖️ ВЫНЕСТИ ВЕРДИКТ
          </button>
        )}
      </div>

      {/* Ending overlay */}
      {gamePhase === 'ending' && <EndingPanel onRestart={handleRestart} />}
    </div>
  );
}
