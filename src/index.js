const VERSION = '2026-11-10-fixed-v2';
const json = (data,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'no-store'}});
export default {
 async fetch(request,env){
  const url=new URL(request.url);
  if(url.pathname==='/api/health') return json({ok:true,version:VERSION,aiBound:!!env.AI,dbBound:!!env.DB});
  if(url.pathname==='/api/chat'){
   if(request.method!=='POST') return json({error:'POST 요청만 허용합니다.',version:VERSION},405);
   try{
    const type=request.headers.get('content-type')||'';
    if(!type.includes('application/json'))return json({error:'Content-Type은 application/json이어야 합니다.'},415);
    const body=await request.json();
    if(!body || typeof body!=='object' || Array.isArray(body))return json({error:'잘못된 요청 형식입니다.'},400);
    const raw=body.message ?? body.question ?? body.prompt;
    const message=typeof raw==='string'?raw.trim():'';
    const nickname=typeof body.nickname==='string'?(body.nickname.trim().slice(0,30)||'학생'):'학생';
    if(!message)return json({error:'질문이 서버에 전달되지 않았습니다. 페이지를 새로고침하고 다시 시도하세요.',receivedKeys:Object.keys(body),version:VERSION},400);
    if(message.length>2000)return json({error:'질문은 2000자 이하로 입력하세요.'},400);
    if(!env.AI)return json({error:'Workers AI 바인딩 AI가 없습니다. Cloudflare 설정을 확인하세요.',version:VERSION},503);
    const result=await env.AI.run('@cf/meta/llama-3.1-8b-instruct',{messages:[{role:'system',content:'당신은 한국어로 답하는 친절한 학습 교사입니다. 학생의 질문에 정확하고 이해하기 쉽게 답변하세요. 모르는 것은 모른다고 하세요.'},{role:'user',content:message}]});
    const reply=typeof result?.response==='string'?result.response.trim():'';
    if(!reply)return json({error:'AI가 빈 답변을 반환했습니다. 다시 시도하세요.'},502);
    let saved=false;
    if(env.DB){try{await env.DB.prepare('INSERT INTO questions (nickname, question, answer) VALUES (?, ?, ?)').bind(nickname,message,reply).run();saved=true;}catch(dbErr){console.error('D1 save failed:',dbErr);}}
    return json({reply,saved,version:VERSION});
   }catch(err){console.error('Chat request failed:',err);return json({error:'AI 처리 중 서버 오류가 발생했습니다. Cloudflare 실시간 로그를 확인하세요.',version:VERSION},500);}
  }
  if(env.ASSETS)return env.ASSETS.fetch(request);
  return new Response('정적 파일 바인딩 ASSETS가 없습니다.',{status:500});
 }
};
