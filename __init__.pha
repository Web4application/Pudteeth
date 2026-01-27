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
// 3️⃣ Fetch RSS Feed
// ============================
async function fetchRSS(url){
    try{
        const res = await fetch(url);
        const text = await res.text();
        const parser = new DOMParser();
        const xml = parser.parseFromString(text,"text/xml");
        const items = [...xml.querySelectorAll("item")];
        return items.map(i=>({
            title: i.querySelector("title")?.textContent||"",
            link: i.querySelector("link")?.textContent||"",
            description: i.querySelector("description")?.textContent||""
        }));
    }catch(e){return [];}
}

// ============================
// 4️⃣ Summarize Text & Extract Topics
// ============================
function summarizeText(text){
    const lines = text.split("\n").filter(l=>l.trim());
    const summary = lines.slice(0,3).join(" ");
    const words = text.replace(/\W/g," ").toLowerCase().split(/\s+/);
    const freq = {}; words.forEach(w=>{ if(w.length>4) freq[w]=(freq[w]||0)+1 });
    const topics = Object.entries(freq).sort((a,b)=>b[1]-a[1]).slice(0,5).map(t=>t[0]);
    return {summary,topics};
}

// ============================
// 5️⃣ Play media snippet or TTS
// ============================
async function playMedia(url=null,text=null,duration=10){
    if(url){
        let media;
        if(url.match(/\.(mp3|m4a|wav|sw|aac|flac)$/i)) media = new Audio(url);
        else if(url.match(/\.(mp4|mov)$/i)){
            media = document.createElement("video");
            media.src = url; media.style.display="none"; document.body.appendChild(media);
        }
        media.play();
        await new Promise(r=>setTimeout(r,duration*1000));
        media.pause();
        if(media?.tagName==="VIDEO") media.remove();
    } else if(text) {
        speak(text);
        await new Promise(r=>setTimeout(r,5000));
    }
}

// ============================
// 6️⃣ DLL Logging
// ============================
function logDLL(entry){
    const DLL = JSON.parse(localStorage.getItem("ai_DLL")||"[]");
    DLL.push(entry);
    localStorage.setItem("ai_DLL", JSON.stringify(DLL));
}

// ============================
// 7️⃣ Unified 24/7 Media Loop
// ============================
async function runUnifiedAI(){
    const rssFeeds = [
        "https://rss.cnn.com/rss/edition.rss",
        "https://feeds.bbci.co.uk/news/rss.xml",
        "https://www.reutersagency.com/feed/?best-topics=business-finance"
    ];

    const branches = ["Podcasts","Interviews","RadioShows"];
    speak("Pudteeth Unified AI Media Assistant Online!");

    while(true){
        // -------- Live News --------
        for(const feed of rssFeeds){
            speak(`Fetching latest news.`);
            const items = await fetchRSS(feed);
            for(const item of items){
                const {summary,topics} = summarizeText(item.description || item.title);
                speak(`News: ${item.title}`);
                speak(`Summary: ${summary}`);
                if(topics.length>0) speak(`Topics: ${topics.join(", ")}`);
                logDLL({timestamp:Date.now(),type:"news",source:feed,url:item.link,title:item.title,summary,topics});

                const cmd = await getUserInput("Command: 'next','skip','stop','repeat'");
                const lc = cmd.toLowerCase();
                if(lc.includes("stop")) break;
                else if(lc.includes("skip")) continue;
                else if(lc.includes("repeat")){
                    speak(`Repeating: ${item.title}`);
                    speak(`Summary: ${summary}`);
                }
                await new Promise(r=>setTimeout(r,3000));
            }
        }

        // -------- Local Media Branches --------
        for(const branch of branches){
            speak(`Checking ${branch} folder.`);
            const mediaFiles = scanMediaRecursive().filter(f=>f.url.toLowerCase().includes(branch.toLowerCase()));
            for(let i=0;i<mediaFiles.length;i++){
                const item = mediaFiles[i];
                speak(`Now playing: ${item.text}`);

                if(item.url.match(/\.(txt|srt)$/i)){
                    const res = await fetch(item.url);
                    const text = await res.text();
                    const {summary,topics} = summarizeText(text);
                    speak(`Summary: ${summary}`);
                    if(topics.length>0) speak(`Topics: ${topics.join(", ")}`);
                    logDLL({timestamp:Date.now(),type:"transcript",url:item.url,text:item.text,summary,topics});
                }

                if(item.url.match(/\.(mp3|m4a|wav|sw|aac|flac|mp4|mov)$/i)){
                    speak("Playing snippet...");
                    await playMedia(item.url, null, 10);
                    logDLL({timestamp:Date.now(),type:"media",url:item.url,text:item.text});
                }

                const command = await getUserInput("Command: 'next','skip','stop','repeat','summarize','topics'");
                const cmd = command.toLowerCase();
                if(cmd.includes("stop")) break;
                else if(cmd.includes("skip")) continue;
                else if(cmd.includes("repeat")) i--;
                else if(cmd.includes("summarize") && item.url.match(/\.(txt|srt)$/i)){
                    const {summary} = summarizeText(await (await fetch(item.url)).text());
                    speak(`Full summary: ${summary}`);
                } else if(cmd.includes("topics") && item.url.match(/\.(txt|srt)$/i)){
                    const {topics} = summarizeText(await (await fetch(item.url)).text());
                    speak(`Topics: ${topics.join(", ")}`);
                }
            }
        }

        speak("Cycle complete. Next check in 5 minutes.");
        await new Promise(r=>setTimeout(r,300000)); // 5 min wait
    }
}

// ============================
// 8️⃣ Start Unified AI
// ============================
runUnifiedAI();
