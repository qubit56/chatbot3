export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/api/chat') {
      if (request.method !== 'POST') return Response.json({error:'POST 요청만 허용됩니다.'},{status:405});
      try {
        const body = await request.json();
        const message = body.message;
        if (typeof message !== 'string' || !message.trim()) return Response.json({error:'질문을 입력하세요.'},{status:400});
        if (!env.AI) return Response.json({error:'Workers AI 바인딩이 없습니다.'},{status:503});
        const result = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
          messages: [
            {role:'system',content:'당신은 한국어로 답하는 친절한 AI 학습 교사입니다. 정확하고 쉽게 단계별로 설명하세요. 모르면 모른다고 말하세요.'},
            {role:'user',content:message.slice(0,2000)}
          ]
        });
        return Response.json({reply:result.response ?? '답변을 생성하지 못했습니다.'});
      } catch (e) {
        console.error('chat error',e);
        return Response.json({error:'AI 응답 처리에 실패했습니다. Cloudflare 로그를 확인하세요.'},{status:500});
      }
    }
    return env.ASSETS.fetch(request);
  }
};
