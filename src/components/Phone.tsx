import { useState } from 'react';
import { chatThreads, type ChatThread, TIMOFEY_AVATAR } from '../data/gameData';

interface PhoneProps {
  onSuspiciousFound: (msgId: string) => void;
  foundSuspicious: string[];
}

function Avatar({ chat, size = 'md' }: { chat: ChatThread; size?: 'sm' | 'md' }) {
  const sizeClass = size === 'md' ? 'w-11 h-11' : 'w-9 h-9';
  const textSize = size === 'md' ? 'text-xl' : 'text-lg';

  if (chat.avatarUrl) {
    return (
      <img
        src={chat.avatarUrl}
        alt={chat.contactName}
        className={`${sizeClass} rounded-full object-cover flex-shrink-0`}
      />
    );
  }
  return (
    <div className={`${sizeClass} rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center ${textSize} flex-shrink-0`}>
      {chat.avatarEmoji || '👤'}
    </div>
  );
}

export function Phone({ onSuspiciousFound, foundSuspicious }: PhoneProps) {
  const [selectedChat, setSelectedChat] = useState<ChatThread | null>(null);
  const [highlightedMsg, setHighlightedMsg] = useState<string | null>(null);

  const handleMsgClick = (chatId: string, msgId: number, isSuspicious?: boolean) => {
    const key = `${chatId}_${msgId}`;
    if (isSuspicious) {
      if (!foundSuspicious.includes(key)) {
        onSuspiciousFound(key);
      }
      setHighlightedMsg(key);
      setTimeout(() => setHighlightedMsg(null), 1500);
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-gray-900 rounded-[2rem] border-4 border-gray-700 shadow-2xl overflow-hidden relative">
      {/* Phone notch */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-gray-900 rounded-b-2xl z-20" />

      {/* Status bar */}
      <div className="bg-gray-800 px-4 pt-7 pb-2 flex justify-between items-center text-white text-xs z-10">
        <span>14:32</span>
        <span className="flex gap-1 items-center">
          <span>📶</span>
          <span>🔋 87%</span>
        </span>
      </div>

      {selectedChat ? (
        /* Chat view */
        <div className="flex flex-col flex-1 bg-[#0e1621] overflow-hidden">
          {/* Chat header */}
          <div className="bg-[#17212b] px-3 py-2 flex items-center gap-2 border-b border-gray-700">
            <button
              onClick={() => setSelectedChat(null)}
              className="text-blue-400 text-lg hover:text-blue-300 transition-colors"
            >
              ←
            </button>
            <Avatar chat={selectedChat} size="sm" />
            <div>
              <div className="text-white text-sm font-medium">{selectedChat.contactName}</div>
              <div className="text-gray-400 text-xs">был(а) недавно</div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-thin">
            {selectedChat.messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-gray-500 text-sm italic">Сообщений пока нет</div>
              </div>
            ) : (
              selectedChat.messages.map((msg) => {
                const msgKey = `${selectedChat.id}_${msg.id}`;
                const isFound = foundSuspicious.includes(msgKey);
                const isHighlighted = highlightedMsg === msgKey;

                return (
                  <div
                    key={msg.id}
                    className={`flex ${msg.isTimofey ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      onClick={() => handleMsgClick(selectedChat.id, msg.id, msg.isSuspicious)}
                      className={`max-w-[85%] px-3 py-1.5 rounded-xl text-sm transition-all duration-300 ${
                        msg.isTimofey
                          ? 'bg-[#2b5278] text-white rounded-br-sm'
                          : 'bg-[#182533] text-white rounded-bl-sm'
                      } ${msg.isSuspicious ? 'cursor-pointer hover:ring-2 hover:ring-yellow-500/50' : ''} ${
                        isHighlighted ? 'ring-2 ring-yellow-400 animate-shake' : ''
                      } ${isFound && msg.isSuspicious ? 'border-l-2 border-yellow-500' : ''}`}
                    >
                      {!msg.isTimofey && (
                        <div className="text-blue-400 text-xs font-medium mb-0.5">{msg.from}</div>
                      )}
                      {msg.isTimofey && (
                        <div className="text-pink-400 text-xs font-medium mb-0.5 flex items-center gap-1">
                          <img src={TIMOFEY_AVATAR} alt="ТТ" className="w-3 h-3 rounded-full object-cover" />
                          Тимофей-тян
                        </div>
                      )}
                      <div>{msg.text}</div>
                      {isFound && msg.isSuspicious && (
                        <div className="text-yellow-400 text-[10px] mt-1 flex items-center gap-1">
                          ⚠️ Подозрительно
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Input bar */}
          <div className="bg-[#17212b] px-3 py-2 flex items-center gap-2 border-t border-gray-700">
            <div className="flex-1 bg-[#242f3d] rounded-full px-4 py-1.5 text-gray-500 text-sm">
              Сообщение...
            </div>
            <span className="text-blue-400">🎤</span>
          </div>
        </div>
      ) : (
        /* Chat list */
        <div className="flex-1 bg-[#0e1621] overflow-y-auto">
          {/* Search */}
          <div className="px-3 py-2 bg-[#17212b]">
            <div className="bg-[#242f3d] rounded-lg px-3 py-1.5 text-gray-500 text-sm flex items-center gap-2">
              🔍 Поиск
            </div>
          </div>

          {/* Chat list */}
          <div className="divide-y divide-gray-800">
            {chatThreads.map((chat) => (
              <button
                key={chat.id}
                onClick={() => setSelectedChat(chat)}
                className="w-full px-3 py-2.5 flex items-center gap-3 hover:bg-[#202b36] transition-colors text-left"
              >
                <Avatar chat={chat} />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <span className="text-white text-sm font-medium truncate">
                      {chat.contactName}
                    </span>
                  </div>
                  <div className="text-gray-400 text-xs truncate">
                    {chat.lastMessage || <span className="italic">Пусто</span>}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Home button indicator */}
      <div className="bg-gray-900 py-1.5 flex justify-center">
        <div className="w-24 h-1 bg-gray-600 rounded-full" />
      </div>
    </div>
  );
}
