import { createRoot } from 'react-dom/client';
import { useState } from 'react';
import { findGame } from '@/src/games';
import './style.css';

const game = findGame(new URLSearchParams(location.search).get('gameId'));

function GamePage() {
  const [notice, setNotice] = useState('');
  const returnToTask = async () => {
    const result = await browser.runtime.sendMessage({ type: 'return_to_task' }) as { focused: boolean };
    setNotice(result.focused ? '已回到原任务标签页。' : '原任务标签页已关闭或无法聚焦，请手动返回。');
  };
  if (!game) return <main><h1>游戏不可用</h1><button onClick={() => void returnToTask()}>返回任务</button></main>;
  return <main><p className="eyebrow">本地占位游戏页</p><h1>{game.name}</h1><p>{game.durationLabel} · {game.tags.join('、')}</p><section><h2>此页面仅验证启动与返回流程</h2><p>尚未接入任何第三方游戏或素材。{game.exitHint}</p></section><button onClick={() => void returnToTask()}>回到 AI 任务</button>{notice && <p role="status">{notice}</p>}</main>;
}

createRoot(document.getElementById('root')!).render(<GamePage />);
