// ============================
// 0️⃣ Helper: Speak Text
// ============================
function speak(message){
    if("speechSynthesis" in window){
        const utter = new SpeechSynthesisUtterance(message);
        speechSynthesis.speak(utter);
    }
}

// ============================
// 1️⃣ Voice Recognition
// ============================
async function getUserInput(promptMsg="Say your command"){
    if(!('webkitSpeechRecognition' in window)){
        speak("Voice recognition not supported.");
        return "";
    }
    return new Promise(resolve=>{
        const recognition = new webkitSpeechRecognition();
        recognition.lang="en-US";
        recognition.interimResults=false;
        recognition.maxAlternatives=1;
        speak(promptMsg);
        recognition.onresult = e => resolve(e.results[0][0].transcript.trim());
        recognition.onerror = ()=>resolve("");
        recognition.start();
    });
}

// ============================
// 2️⃣ Supported Files & Recursive Scan
// ============================
const supportedFiles = /\.(mp3|m4a|wav|sw|txt|srt|mp4|mov|aac|flac)$/i;

function scanMediaRecursive(root=document){
    const mediaLinks = [...root.querySelectorAll("a")].filter(a=>a.href.match(supportedFiles))
        .map(a=>({url:a.href,text:a.innerText.trim()}));

    const folders = [...root.querySelectorAll("a")].filter(a=>a.href.includes("/tree/"));
    for(const folder of folders){
        mediaLinks.push(...scanMediaRecursive(folder.parentElement));
    }
    return mediaLinks;
}

// ============================
// 3️⃣ Play Audio/Video Snippet
// ============================
function playMediaSnippet(url,duration=10){
    return new Promise(resolve=>{
        let media;
        if(url.match(/\.(mp3|m4a|wav|sw|aac|flac)$/i)){
            media = new Audio(url);
        } else if(url.match(/\.(mp4|mov)$/i)){
            media = document.createElement("video");
            media.src = url;
            media.style.display = "none";
            document.body.appendChild(media);
        }
        media.play();
        setTimeout(()=>{ media.pause(); if(media.tagName==="VIDEO") media.remove(); resolve(); }, duration*1000);
    });
}

// ============================
// 4️⃣ Fetch Transcript & Summarize
// ============================
async function fetchAndSummarize(url){
    try{
        const res = await fetch(url);
        const text = await res.text();
        const lines = text.split("\n").filter(l=>l.trim());
        const summary = lines.slice(0,3).join(" "); // quick summary
        const speakers = [...new Set(lines.filter(l=>l.includes(":")).map(l=>l.split(":")[0]))];
        const words = text.replace(/\W/g," ").toLowerCase().split(/\s+/);
        const freq = {};
        words.forEach(w=>{ if(w.length>4) freq[w]=(freq[w]||0)+1 });
        const topics = Object.entries(freq).sort((a,b)=>b[1]-a[1]).slice(0,5).map(t=>t[0]);
        return {summary,speakers,topics};
    }catch(e){
        return {summary:"Unable to fetch summary.",speakers:[],topics:[]};
    }
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
// 6️⃣ Main Voice-First Media Assistant
// ============================
async function runVoiceMediaAssistant(){
    const branches = ["News","Podcasts","Interviews","RadioShows"];
    speak(`Welcome to Pudteeth AI media assistant. Available branches: ${branches.join(", ")}`);
    const branchInput = await getUserInput("Which branch would you like to explore?");
    if(!branchInput) { speak("No branch selected. Exiting."); return; }

    const mediaFiles = scanMediaRecursive().filter(m=>branchInput && m.url.toLowerCase().includes(branchInput.toLowerCase()));
    speak(`Found ${mediaFiles.length} media items in ${branchInput}.`);

    for(let i=0;i<mediaFiles.length;i++){
        const item = mediaFiles[i];
        speak(`Item ${i+1}: ${item.text}`);
        
        if(item.url.match(/\.(txt|srt)$/i)){
            const {summary,speakers,topics} = await fetchAndSummarize(item.url);
            if(speakers.length>0) speak(`Speakers detected: ${speakers.join(", ")}`);
            if(topics.length>0) speak(`Topics: ${topics.join(", ")}`);
            speak(`Summary: ${summary}`);
            logDLL({timestamp:Date.now(),type:"transcript",url:item.url,text:item.text,summary,speakers,topics});
        }

        if(item.url.match(/\.(mp3|m4a|wav|sw|aac|flac|mp4|mov)$/i)){
            speak("Playing media snippet...");
            await playMediaSnippet(item.url,10);
            logDLL({timestamp:Date.now(),type:"media",url:item.url,text:item.text});
        }

        const command = await getUserInput("Say 'next', 'skip', 'stop', 'repeat', 'summarize', or 'topics'");
        const cmd = command.toLowerCase();
        if(cmd.includes("stop")) { speak("Stopping."); break; }
        else if(cmd.includes("skip")) continue;
        else if(cmd.includes("repeat")) i--;
        else if(cmd.includes("summarize") && item.url.match(/\.(txt|srt)$/i)){
            const {summary} = await fetchAndSummarize(item.url);
            speak(`Full summary: ${summary}`);
        } else if(cmd.includes("topics") && item.url.match(/\.(txt|srt)$/i)){
            const {topics} = await fetchAndSummarize(item.url);
            speak(`Topics: ${topics.join(", ")}`);
        }
    }

    speak(`Finished exploring ${branchInput}. All logs saved in DLL.`);
    console.log("DLL logs:", JSON.parse(localStorage.getItem("ai_DLL")||"[]"));
}

// ============================
// 7️⃣ Run Assistant
// ============================
runVoiceMediaAssistant();
