document.querySelector(".btn").addEventListener("click", async () => {
    const tabURL = await getCurrentTab();
    openLink(tabURL)
    
});

async function getCurrentTab() {
    let queryOptions = { active: true, currentWindow: true };
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let [tab] = await chrome.tabs.query(queryOptions);
    
    if (tab && tab.url){
        console.log(tab.url)
        return tab.url;
    }
    else {
        console.log('Unable to retrieve URL of current tab')
        return null;
    }
  }


async function openLink(tabURL) {
    if (tabURL && /reddit\.com\/r\/[^/]+\/comments\/[^]+\/$/.test(tabURL)) {
        const jsonLink = tabURL + '.json'

        try {
            const response = await fetch(jsonLink)
            const responseJson = await response.json();
            const videoURL = responseJson[0].data.children[0].data.secure_media.reddit_video.fallback_url
            console.log(videoURL)
            chrome.tabs.create({url: videoURL});

        }
        catch (error){
            alert("Could not get video source")
            console.log(error);
        }
    }
    else {
        alert('The current page is not a reddit post. If the post uses a youtube link, please use a youtube downloader instead')
        console.log ('URL does not contain reddit video')
        
    }

   
}

// The URL matches the pattern: "reddit.com/r/anything/comments/anything/"