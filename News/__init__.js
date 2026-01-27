// ============================
// 0️⃣ Helper: Speak Text
// ============================
function speak(msg){
    if("speechSynthesis" in window){
        const u = new SpeechSynthesisUtterance(msg);
        speechSynthesis.speak(u);
    }
}

// ============================
// 1️⃣ Voice Recognition
// ============================
async function getUserInput(promptMsg="Say command"){
    if(!('webkitSpeechRecognition' in window)) return "";
    return new Promise(resolve=>{
        const r = new webkitSpeechRecognition();
        r.lang="en-US";
        r.interimResults=false;
        r.maxAlternatives=1;
        speak(promptMsg);
        r.onresult = e=>resolve(e.results[0][0].transcript.trim());
        r.onerror = ()=>resolve("");
        r.start();
    });
}

// ============================
// 2️⃣ Supported files & Recursive scan
// ============================
const supportedFiles = /\.(mp3|m4a|wav|sw|aac|flac|txt|srt|mp4|mov)$/i;
function scanMediaRecursive(root=document){
    const files = [...root.querySelectorAll("a")]
        .filter(a=>a.href.match(supportedFiles))
        .map(a=>({url:a.href,text:a.innerText.trim()}));
    const folders = [...root.querySelectorAll("a")].filter(a=>a.href.includes("/tree/"));
    for(const f of folders) files.push(...scanMediaRecursive(f.parentElement));
    return files;
}

// ============================
// 3️⃣ Fetch & summarize transcripts
// ============================
async function fetchAndSummarize(url){
    try{
        const res = await fetch(url);
        const text = await res.text();
        const lines = text.split("\n").filter(l=>l.trim());
        const summary = lines.slice(0,3).join(" ");
        const speakers = [...new Set(lines.filter(l=>l.includes(":")).map(l=>l.split(":")[0]))];
        const words = text.replace(/\W/g," ").toLowerCase().split(/\s+/);
        const freq = {}; words.forEach(w=>{ if(w.length>4) freq[w]=(freq[w]||0)+1 });
        const topics = Object.entries(freq).sort((a,b)=>b[1]-a[1]).slice(0,5).map(t=>t[0]);
        return {summary,speakers,topics};
    }catch(e){return {summary:"Unable to fetch.",speakers:[],topics:[]};}
}

// ============================
// 4️⃣ Play media snippet
// ============================
function playMedia(url,duration=10){
    return new Promise(resolve=>{
        let media;
        if(url.match(/\.(mp3|m4a|wav|sw|aac|flac)$/i)) media = new Audio(url);
        else if(url.match(/\.(mp4|mov)$/i)){
            media = document.createElement("video");
            media.src = url; media.style.display="none"; document.body.appendChild(media);
        }
        media.play();
        setTimeout(()=>{ media.pause(); if(media.tagName==="VIDEO") media.remove(); resolve(); },duration*1000);
    });
}

// ============================
// 5️⃣ DLL Logging
// ============================
function logDLL(entry){
    const DLL = JSON.parse(localStorage.getItem("ai_DLL")||"[]");
    DLL.push(entry);
    localStorage.setItem("ai_DLL", JSON.stringify(DLL));
}

// ============================
// 6️⃣ Continuous 24/7 loop
// ============================
async function runContinuousAI(){
    const branches = ["News","Podcasts","Interviews","RadioShows"];
    speak(`Pudteeth AI 24/7 media assistant online. Branches: ${branches.join(", ")}`);
    
    while(true){
        for(const branch of branches){
            speak(`Checking ${branch}...`);
            const mediaFiles = scanMediaRecursive().filter(f=>f.url.toLowerCase().includes(branch.toLowerCase()));
            for(let i=0;i<mediaFiles.length;i++){
                const item = mediaFiles[i];
                speak(`Now playing: ${item.text}`);
                if(item.url.match(/\.(txt|srt)$/i)){
                    const {summary,speakers,topics} = await fetchAndSummarize(item.url);
                    if(speakers.length>0) speak(`Speakers: ${speakers.join(", ")}`);
                    if(topics.length>0) speak(`Topics: ${topics.join(", ")}`);
                    speak(`Summary: ${summary}`);
                    logDLL({timestamp:Date.now(),type:"transcript",url:item.url,text:item.text,summary,speakers,topics});
                }
                if(item.url.match(/\.(mp3|m4a|wav|sw|aac|flac|mp4|mov)$/i)){
                    speak("Playing snippet...");
                    await playMedia(item.url,10);
                    logDLL({timestamp:Date.now(),type:"media",url:item.url,text:item.text});
                }

                const command = await getUserInput("Command: 'next', 'skip', 'stop', 'repeat', 'summarize', 'topics'");
                const cmd = command.toLowerCase();
                if(cmd.includes("stop")) { speak("Stopping current branch."); break; }
                else if(cmd.includes("skip")) continue;
                else if(cmd.includes("repeat")) i--;
                else if(cmd.includes("summarize") && item.url.match(/\.(txt|srt)$/i)){
                    const {summary} = await fetchAndSummarize(item.url); speak(`Full summary: ${summary}`);
                } else if(cmd.includes("topics") && item.url.match(/\.(txt|srt)$/i)){
                    const {topics} = await fetchAndSummarize(item.url); speak(`Topics: ${topics.join(", ")}`);
                }
            }
        }
        speak("Cycle complete. Checking for new media in 2 minutes...");
        await new Promise(r=>setTimeout(r,120000)); // 2 min wait before next fetch
    }
}

// ============================
// 7️⃣ Start Assistant
// ============================
runContinuousAI();
