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
// 2️⃣ RSS Feed Fetching
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
// 3️⃣ Summarize text
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
// 4️⃣ Play audio snippet or TTS
// ============================
async function playItem(url,text=null,duration=10){
    if(url){
        const media = new Audio(url);
        media.play();
        await new Promise(r=>setTimeout(r,duration*1000));
        media.pause();
    } else if(text){
        speak(text);
        await new Promise(r=>setTimeout(r,5000));
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
// 6️⃣ Continuous Live News Loop
// ============================
async function runLiveAI(){
    const feeds = [
        "https://rss.cnn.com/rss/edition.rss",
        "https://feeds.bbci.co.uk/news/rss.xml",
        "https://www.reutersagency.com/feed/?best-topics=business-finance"
    ];

    speak("Pudteeth Live AI Anchor Online");

    while(true){
        for(const feed of feeds){
            speak(`Fetching latest news from feed.`);
            const items = await fetchRSS(feed);
            for(const item of items){
                const {summary,topics} = summarizeText(item.description || item.title);
                speak(`News: ${item.title}`);
                speak(`Summary: ${summary}`);
                if(topics.length>0) speak(`Topics: ${topics.join(", ")}`);
                logDLL({timestamp:Date.now(),type:"news",source:feed,url:item.link,title:item.title,summary,topics});

                // Wait for 3 seconds or voice command
                const cmd = await getUserInput("Say 'next', 'skip', 'stop', or 'repeat'");
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

        speak("Cycle complete. Checking for new news in 5 minutes.");
        await new Promise(r=>setTimeout(r,300000)); // wait 5 mins before next fetch
    }
}

// ============================
// 7️⃣ Run Live AI
// ============================
runLiveAI();
