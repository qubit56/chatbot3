export async function onRequestPost({ request, env }) {
  try {
    const { question, nickname = '익명', history = [] } = await request.json();
    if (typeof question !== 'string' || !question.trim() || question.length > 2000) return Response.json({error:'질문은 1~2000자로 입력하세요.'},{status:400});
    if (!env.AI) return Response.json({error:'Workers AI 바인딩 AI를 설정하세요.'},{status:503});
    const safeHistory = Array.isArray(history) ? history.slice(-8).filter(x=>['user','assistant'].includes(x?.role)&&typeof x.content==='string').map(x=>({role:x.role,content:x.content.slice(0,2000)})) : [];
    const messages = [{role:'system',content:'당신은 친절하고 정확한 한국어 교육용 AI 튜터입니다. 학생 수준에 맞춰 단계별로 설명하고, 모르면 모른다고 말하세요. 위험하거나 민감한 개인정보를 요청하지 마세요.'},...safeHistory,{role:'user',content:question}];
    const result = await env.AI.run('@cf/meta/llama-3.1-8b-instruct',{messages,max_tokens:700});
    const answer = result.response || '답변을 생성하지 못했습니다.';
    if(env.DB){await env.DB.prepare('INSERT INTO questions (nickname, question, answer) VALUES (?, ?, ?)').bind(String(nickname).slice(0,30),question,answer).run();}
    return Response.json({answer});
  } catch (e) { return Response.json({error:'서버 처리 중 오류가 발생했습니다.'},{status:500}); }
}
