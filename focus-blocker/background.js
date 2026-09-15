chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "updateRules") {
        updateBlockingRules(request.blockedSites, request.isEnabled);
        sendResponse({ status: "ok" });
    }
    return true;
});

function updateBlockingRules(sites, isEnabled) {
    chrome.declarativeNetRequest.getDynamicRules(oldRules => {
        const oldRuleIds = oldRules.map(rule => rule.id);

        if (!isEnabled || !sites || sites.length === 0) {
            chrome.declarativeNetRequest.updateDynamicRules({
                removeRuleIds: oldRuleIds,
                addRules: []
            }, () => {
                const blockedUrl = chrome.runtime.getURL("blocked.html");
                chrome.tabs.query({}, (tabs) => {
                    for (const tab of tabs) {
                        if (tab.url && tab.url.startsWith(blockedUrl)) {
                            chrome.tabs.update(tab.id, { url: "https://www.youtube.com" });
                        }
                    }
                });
            });
            return;
        }

        const newRules = sites.map((site, index) => {
            return {
                id: index + 1,
                priority: 1,
                action: {
                    type: "redirect",
                    redirect: { extensionPath: "/blocked.html" }
                },
                condition: {
                    urlFilter: `||${site}^`,
                    resourceTypes: ["main_frame"]
                }
            };
        });

        chrome.declarativeNetRequest.updateDynamicRules({
            removeRuleIds: oldRuleIds,
            addRules: newRules
        }, () => {
            chrome.tabs.query({}, (tabs) => {
                for (const tab of tabs) {
                    if (tab.url) {
                        for (const site of sites) {
                            if (tab.url.includes(site) && !tab.url.includes("blocked.html")) {
                                chrome.tabs.update(tab.id, { url: chrome.runtime.getURL("blocked.html") });
                                break;
                            }
                        }
                    }
                }
            });
        });
    });
}
