// 짤 추천 순수 로직: 문장에서 감정 태그 찾기, 내 짤 점수 매기기, GIPHY 검색어 만들기
import type { Meme } from './memes'

// 기본 감정 태그. words가 문장에 들어 있으면 그 태그로 본다. en은 GIPHY 검색어(한국어 검색이 약해서)
export const EMOTIONS = [
  { tag: '기쁨', en: 'happy dance', words: ['기쁨', '좋아', '행복', '신나', '신남', '기뻐', '최고', 'ㅋㅋ', '웃겨', '짱', '럭키'] },
  { tag: '슬픔', en: 'sad crying', words: ['슬픔', '슬퍼', '우울', '눈물', 'ㅠ', 'ㅜ', '울고', '속상', '서운', '외로'] },
  { tag: '화남', en: 'angry', words: ['화남', '화나', '화가', '빡', '짜증', '열받', '분노', '어이없', '킹받'] },
  { tag: '피곤', en: 'tired exhausted', words: ['피곤', '졸려', '졸림', '지쳐', '힘들', '출근', '월요일', '야근', '잠와', '현생'] },
  { tag: '놀람', en: 'shocked surprised', words: ['놀람', '헐', '대박', '깜짝', '놀라', '실화', '미쳤', '충격', '레전드'] },
  { tag: '당황', en: 'confused', words: ['당황', '뭐지', '어떡', '멘붕', '띠용', '몰라', '모르겠', '흠'] },
  { tag: '감사', en: 'thank you', words: ['감사', '고마', '고맙', '땡큐', '감동'] },
  { tag: '축하', en: 'congratulations celebrate', words: ['축하', '합격', '생일', '성공', '이겼', '우승', '승진'] },
  { tag: '응원', en: 'you can do it', words: ['응원', '화이팅', '파이팅', '힘내', '할 수 있', '할수있', '가보자'] },
  { tag: '퇴근', en: 'weekend party', words: ['퇴근', '주말', '금요일', '불금', '칼퇴', '휴가', '집에', '방학'] },
] as const

export const EMOTION_TAGS: string[] = EMOTIONS.map((e) => e.tag)

const norm = (s: string) => s.toLowerCase().replace(/\s+/g, ' ').trim()

/** 문장에 들어 있는 감정 태그 */
export function detectTags(text: string): string[] {
  const t = norm(text)
  if (!t) return []
  return EMOTIONS.filter((e) => e.words.some((w) => t.includes(w))).map((e) => e.tag)
}

/** 내 짤 점수: 태그 일치 3점, 키워드가 문장에 있으면 2점, 제목이 문장에 있으면 1점. 입력이 없으면 전부 0점(전체 보기) */
export function scoreMeme(meme: Meme, tags: string[], text: string): number {
  const t = norm(text)
  let score = meme.tags.filter((tag) => tags.includes(tag)).length * 3
  if (t) {
    score += meme.keywords.filter((k) => t.includes(norm(k))).length * 2
    if (meme.title && t.includes(norm(meme.title))) score += 1
  }
  return score
}

// 같은 점수끼리는 섞어서 "다시 추천"마다 순서가 바뀌게 한다
function shuffle<T>(list: T[]): T[] {
  const a = [...list]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/** 맞는 내 짤을 점수순으로. 입력(문장·태그)이 하나도 없으면 전체를 섞어서 */
export function rankMemes(memes: Meme[], tags: string[], text: string): Meme[] {
  const hasInput = tags.length > 0 || norm(text) !== ''
  if (!hasInput) return shuffle(memes)
  return shuffle(memes)
    .map((m) => ({ m, s: scoreMeme(m, tags, text) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .map((x) => x.m)
}

/** GIPHY 검색어: 첫 감정 태그(직접 고른 칩이 앞)의 영어 키워드 하나 — 섞으면 결과가 흐려진다. 없으면 입력 문장 그대로 */
export function giphyQuery(tags: string[], text: string): string {
  const first = tags.map((t) => EMOTIONS.find((e) => e.tag === t)).find(Boolean)
  return first?.en ?? (norm(text) || 'reaction')
}
