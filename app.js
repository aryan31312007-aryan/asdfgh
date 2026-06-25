/* ==========================================================================
   FAKE TO OFFICIAL AGREEMENT - APPLICATION SCRIPT ENGINE
   Controls data, canvas systems, admin edits, audio, animations, and EmailJS
   ========================================================================== */

// --- DEFAULT SITE CONFIGURATION STATE ---
const DEFAULT_CONFIG = {
    // Page 1
    p1_title: "Fake To Official Agreement ❤️",
    p1_subtitle: "A journey from fake smiles to real love.",
    p1_welcome_img: "assets/images/bunny_welcome.png",

    // Page 2: Why I Like You Cards
    p2_title: "Why I Like You ❤️",
    p2_subtitle: "You're not perfect, but you're perfect for me.",
    like_cards: [
        { id: 1, icon: "❤️", title: "Your Smile", desc: "The way your smile brightens my darkest days." },
        { id: 2, icon: "✨", title: "Your Personality", desc: "You are kind, caring and so beautiful inside out." },
        { id: 3, icon: "🌸", title: "The Way You Care", desc: "You always understand me without me saying anything." },
        { id: 4, icon: "🌟", title: "The Way You Understand Me", desc: "You are the most special person in my life." }
    ],

    // Page 3: Feelings Letter
    p3_title: "My Feelings For You ❤️",
    p3_letter: "Every moment with you feels like a dream come true. You are not just someone I love, you are someone I can't live without. You mean the world to me and my heart belongs to you.<br><br><em>You are my today and all of my tomorrows.</em><br><br>I promise to love you, care for you, respect you and always stand by you.",

    // Page 4: Memories Timeline
    p4_title: "Memories With You ❤️",
    p4_subtitle: "Beautiful snapshots of our journey together.",
    memories: [
        { id: 1, image: "", title: "Our First Chat", desc: "That random 'Hi' was the best 'Hi' of my life. ❤️" },
        { id: 2, image: "", title: "Our First Call", desc: "I could talk to you for hours and still not get bored. ❤️" },
        { id: 3, image: "", title: "Our Funniest Moment", desc: "The inside jokes that only you and I understand. 😂" },
        { id: 4, image: "", title: "The Day I Realized I Like You", desc: "The exact moment when everything changed. 🥺❤️" }
    ],

    // Page 5: Changes In Life
    p5_title: "Changes In My Life When You Came ❤️",
    changes: [
        { id: 1, icon: "😊", title: "You Made Me Smile More", desc: "You made everything beautiful." },
        { id: 2, icon: "💪", title: "You Made Me Better", desc: "You motivated and inspired me." },
        { id: 3, icon: "💖", title: "You Gave Me Happiness", desc: "You are the reason for my happiness." },
        { id: 4, icon: "🏡", title: "You Became My Safe Place", desc: "You are my peace." }
    ],

    // Page 6: Promises & Future
    p6_title: "Promise & Future Plans With You ❤️",
    promises: [
        "I will always respect you.",
        "I will always support you.",
        "I will always stay honest with you.",
        "I will never stop choosing you.",
        "I will never let you feel alone."
    ],
    dreams: [
        "Travel the world together.",
        "Watch sunsets together.",
        "Build beautiful memories.",
        "Grow old together."
    ],

    // Page 7: Proposal
    p7_question: "Will You Be My Official Real Girlfriend? ❤️",
    proposal_img: "assets/images/couple_silhouette_proposal.png",

    // Page 8: Congrats
    p8_title: "🎉 CONGRATULATIONS ❤️ 🎉",
    p8_subtitle: "Now Our Relationship Is Properly Official 😌❤️",
    congrats_img: "assets/images/bunny_couple_congrats.png",
    p8_final_message: "Aaj Se Tum Sirf Meri Favourite Person Nahi, Meri Official Girlfriend Bhi Ho ❤️🥺",

    // Page 9: Forever
    p9_text1: "\"This Is Not Just A Website...<br>It's A Piece Of My Heart For You ❤️\"",
    p9_text2: "A New Chapter Begins...<br>You, Me & A Lifetime Of Us ❤️",
    forever_img: "assets/images/couple_together_forever.png",

    // Email Notification Configuration
    email_to: "",
    emailjs_public_key: "",
    emailjs_service_id: "",
    emailjs_template_id: "",

    // Style System config
    color_primary: "#ff4d6d",
    color_bg_start: "#ffe5ec",
    color_bg_end: "#ffb5a7",
    audio_url: "https://assets.mixkit.co/music/preview/mixkit-love-grows-1111.mp3",
    audio_success_url: "https://assets.mixkit.co/music/preview/mixkit-dreaming-big-1112.mp3"
};

// Global config state loaded from LocalStorage
let config = {};

// Audio variables
let loveAudio = null;
let musicPlaying = false;

// Navigation tracking
let currentPage = 1;
const totalPages = 9;

// proposal interactions
let noClickCount = 0;
const noButtonTexts = [
    "Not Acceptable 😌",
    "Think Again 🥺",
    "Maan Jao Yrr ❤️",
    "Pleaseeee 🥹",
    "You Look Cute But Answer Wrong 😭❤️"
];

// --- INITIALIZATION ---
document.addEventListener("DOMContentLoaded", () => {
    loadConfig().then(() => {
        applyStyling();
        initAudio();
        renderPageContent();
        setupCanvas();
        setupNavigation();
        setupProposalActions();
        setupAdminPanel();
        setupScrollAnimations();
        
        // Welcome Screen load animation trigger
        document.querySelector("#page-1").classList.add("active");
    });
});

// --- LOAD / SAVE DATA FROM LOCAL STORAGE & SERVER ---
function loadConfig() {
    // Attempt to load from server config.json
    return fetch('config.json')
        .then(res => {
            if (!res.ok) throw new Error("Server config.json load error");
            return res.json();
        })
        .then(serverData => {
            config = { ...DEFAULT_CONFIG, ...serverData };
            localStorage.setItem("fake_to_official_agreement_cfg", JSON.stringify(config));
            console.log("Loaded configuration successfully from config.json!");
        })
        .catch(err => {
            console.warn("Could not load config.json (expected in static hosting). Reading local storage:", err);
            const saved = localStorage.getItem("fake_to_official_agreement_cfg");
            if (saved) {
                try {
                    config = JSON.parse(saved);
                    config = { ...DEFAULT_CONFIG, ...config };
                } catch (e) {
                    console.error("Error parsing saved configuration", e);
                    config = { ...DEFAULT_CONFIG };
                }
            } else {
                config = { ...DEFAULT_CONFIG };
            }
        });
}

function saveConfig() {
    localStorage.setItem("fake_to_official_agreement_cfg", JSON.stringify(config));
    applyStyling();
    renderPageContent();

    // If running on local dev server, sync configuration changes to config.json file on disk
    if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
        fetch('/api/save-config', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(config)
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                console.log("Config synced to server config.json successfully.");
            } else {
                console.error("Failed to sync config to disk:", data.error);
            }
        })
        .catch(err => {
            console.error("Error syncing config to disk:", err);
        });
    }
}

function resetConfig() {
    if (confirm("Are you sure you want to restore default values? All custom uploads and texts will be reset.")) {
        config = { ...DEFAULT_CONFIG };
        saveConfig();
        alert("Restored defaults successfully!");
        location.reload();
    }
}

// --- APPLY CUSTOM STYLES DYNAMICALLY ---
function applyStyling() {
    const root = document.documentElement;
    root.style.setProperty("--primary", config.color_primary);
    
    // Hex to RGB conversion for transparent color values
    const hex = config.color_primary.replace('#','');
    const r = parseInt(hex.substring(0,2), 16);
    const g = parseInt(hex.substring(2,4), 16);
    const b = parseInt(hex.substring(4,6), 16);
    root.style.setProperty("--primary-rgb", `${r}, ${g}, ${b}`);
    
    root.style.setProperty("--bg-start", config.color_bg_start);
    root.style.setProperty("--bg-end", config.color_bg_end);

    // Dynamic color variations for hover
    root.style.setProperty("--primary-hover", adjustColorBrightness(config.color_primary, 30));
}

function adjustColorBrightness(hex, percent) {
    hex = hex.replace(/^\s*#|\s*$/g, '');
    if(hex.length == 3) hex = hex.replace(/(.)/g, '$1$1');
    let r = parseInt(hex.substr(0, 2), 16),
        g = parseInt(hex.substr(2, 2), 16),
        b = parseInt(hex.substr(4, 2), 16);
    r = Math.min(255, Math.max(0, r + percent));
    g = Math.min(255, Math.max(0, g + percent));
    b = Math.min(255, Math.max(0, b + percent));
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

// --- RENDERING VIEWS ---
function renderPageContent() {
    // Welcome Page (Page 1)
    document.getElementById("p1-title").innerText = config.p1_title;
    document.getElementById("p1-subtitle").innerText = config.p1_subtitle;
    document.getElementById("welcome-bunny-img-preview").src = config.p1_welcome_img;

    // Why I Like You Cards (Page 2)
    document.getElementById("p2-title").innerText = config.p2_title;
    document.getElementById("p2-subtitle").innerText = config.p2_subtitle;
    const cardsGrid = document.getElementById("like-cards-container");
    cardsGrid.innerHTML = "";
    config.like_cards.forEach(card => {
        cardsGrid.innerHTML += `
            <div class="like-card animate-fade-in">
                <div class="like-card-icon">${card.icon}</div>
                <div class="like-card-title">${card.title}</div>
                <div class="like-card-desc">${card.desc}</div>
            </div>
        `;
    });

    // Feelings Letter (Page 3)
    document.getElementById("p3-title").innerText = config.p3_title;
    document.getElementById("p3-letter-content").innerHTML = config.p3_letter;

    // Memories Timeline (Page 4)
    document.getElementById("p4-title").innerText = config.p4_title;
    document.getElementById("p4-subtitle").innerText = config.p4_subtitle;
    const timeline = document.getElementById("memories-timeline");
    timeline.innerHTML = "";
    config.memories.forEach((mem, index) => {
        const imgSrc = mem.image || "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=400";
        timeline.innerHTML += `
            <div class="timeline-item animate-timeline" data-index="${index}">
                <div class="timeline-img-col">
                    <img src="${imgSrc}" alt="${mem.title}">
                </div>
                <div class="timeline-content-col">
                    <h3 class="timeline-title">${mem.title}</h3>
                    <p class="timeline-desc">${mem.desc}</p>
                </div>
            </div>
        `;
    });

    // Changes Timeline (Page 5)
    document.getElementById("p5-title").innerText = config.p5_title;
    const changesTimeline = document.getElementById("changes-timeline");
    changesTimeline.innerHTML = "";
    config.changes.forEach(ch => {
        changesTimeline.innerHTML += `
            <div class="v-timeline-item">
                <div class="v-timeline-dot">${ch.icon}</div>
                <h4 class="v-timeline-title">${ch.title}</h4>
                <p class="v-timeline-desc">${ch.desc}</p>
            </div>
        `;
    });

    // Promises & Dreams (Page 6)
    document.getElementById("p6-title").innerText = config.p6_title;
    const promisesList = document.getElementById("promises-list");
    promisesList.innerHTML = "";
    config.promises.forEach(pr => {
        promisesList.innerHTML += `<li>${pr}</li>`;
    });
    const dreamsList = document.getElementById("dreams-list");
    dreamsList.innerHTML = "";
    config.dreams.forEach(dr => {
        dreamsList.innerHTML += `<li>${dr}</li>`;
    });

    // Proposal Screen (Page 7)
    document.getElementById("p7-question").innerText = config.p7_question;
    document.getElementById("proposal-img-preview").src = config.proposal_img;

    // Congratulations (Page 8)
    document.getElementById("p8-title").innerText = config.p8_title;
    document.getElementById("p8-subtitle").innerText = config.p8_subtitle;
    document.getElementById("congrats-bunny-img-preview").src = config.congrats_img;
    document.getElementById("p8-final-message").innerHTML = config.p8_final_message;

    // Forever Together (Page 9)
    document.getElementById("p9-text-1").innerHTML = config.p9_text1;
    document.getElementById("p9-text-2").innerHTML = config.p9_text2;
    document.getElementById("forever-img-preview").src = config.forever_img;

    // Admin UI fields mapping
    loadAdminInputs();
}

// --- SETUP AUDIO SYSTEM ---
function initAudio() {
    loveAudio = new Audio();
    loveAudio.loop = true;
    if (config && config.audio_url) {
        loveAudio.src = config.audio_url;
    }

    const musicBtn = document.getElementById("music-btn");
    if (musicBtn) {
        // Enable browser interaction policy workaround
        musicBtn.addEventListener("click", toggleMusic);
    }
}

function toggleMusic() {
    const musicBtn = document.getElementById("music-btn");
    if (!loveAudio) return;

    if (musicPlaying) {
        loveAudio.pause();
        musicPlaying = false;
        if (musicBtn) {
            musicBtn.classList.add("muted");
            musicBtn.classList.remove("playing");
        }
    } else {
        loveAudio.play().then(() => {
            musicPlaying = true;
            if (musicBtn) {
                musicBtn.classList.remove("muted");
                musicBtn.classList.add("playing");
            }
        }).catch(err => {
            console.log("Audio play failed, user interaction needed first.", err);
        });
    }
}

// --- PAGE NAVIGATION MANAGEMENT ---
function setupNavigation() {
    const startBtn = document.getElementById("start-btn");
    const p2Next = document.getElementById("p2-next");
    const p3Next = document.getElementById("p3-next");
    const p4Next = document.getElementById("p4-next");
    const p5Next = document.getElementById("p5-next");
    const p6Next = document.getElementById("p6-next");
    const p8Next = document.getElementById("p8-next");
    const p9FinalBtn = document.getElementById("p9-final-btn");

    startBtn.addEventListener("click", () => {
        // Trigger audio playback auto-play request on click
        if (!musicPlaying) {
            loveAudio.src = config.audio_url;
            loveAudio.play().then(() => {
                musicPlaying = true;
                document.getElementById("music-btn").classList.add("playing");
                document.getElementById("music-btn").classList.remove("muted");
            }).catch(e => console.log("Audio start error: ", e));
        }
        navigateToPage(2);
    });

    p2Next.addEventListener("click", () => navigateToPage(3));
    p3Next.addEventListener("click", () => navigateToPage(4));
    p4Next.addEventListener("click", () => navigateToPage(5));
    p5Next.addEventListener("click", () => navigateToPage(6));
    p6Next.addEventListener("click", () => navigateToPage(7));
    p8Next.addEventListener("click", () => {
        navigateToPage(9);
        // Start romantic texts display delay on Page 9
        setTimeout(() => {
            document.getElementById("p9-text-1").classList.add("visible");
        }, 1000);
        setTimeout(() => {
            document.getElementById("p9-text-2").classList.add("visible");
        }, 3500);
    });

    p9FinalBtn.addEventListener("click", () => {
        // Trigger infinite hearts explosion
        triggerInfiniteHearts();
    });
}

function navigateToPage(pageIndex) {
    const currentActive = document.querySelector(".page.active");
    if (currentActive) {
        currentActive.classList.remove("active");
        setTimeout(() => {
            currentActive.style.display = "none";
            
            const nextTarget = document.getElementById(`page-${pageIndex}`);
            nextTarget.style.display = "flex";
            // Force redraw/reflow
            nextTarget.offsetHeight; 
            nextTarget.classList.add("active");
            currentPage = pageIndex;
            
            // Apply special scene adjustments
            updateSceneSettings(pageIndex);
        }, 500); // match transition slow (800ms) split delay
    } else {
        const nextTarget = document.getElementById(`page-${pageIndex}`);
        nextTarget.style.display = "flex";
        nextTarget.classList.add("active");
        currentPage = pageIndex;
    }
}

function updateSceneSettings(pageIndex) {
    // If proposal page, make background dark stars
    if (pageIndex === 7) {
        document.body.style.background = "linear-gradient(135deg, #100619, #05020c)";
        activeParticleMode = "stars_and_candles";
    } else if (pageIndex === 8) {
        document.body.style.background = "linear-gradient(135deg, #ffe5ec, #ffccd5)";
        activeParticleMode = "fireworks_and_celebration";
    } else if (pageIndex === 9) {
        document.body.style.background = "linear-gradient(135deg, #090212, #140826)";
        activeParticleMode = "starry_sky_tree";
    } else {
        // Restore standard gradient background
        applyStyling();
        activeParticleMode = "romantic_drift";
    }
}

// --- INTERACTIVE PROPOSAL ACTIONS (YES/NO BUTTONS) ---
function setupProposalActions() {
    const yesBtn = document.getElementById("yes-btn");
    const noBtn = document.getElementById("no-btn");
    const noClickBadge = document.getElementById("no-click-badge");
    const noClickCountText = document.getElementById("no-click-count");
    const noResponseHint = document.getElementById("no-response-hint");

    let noClickTextIndex = 0;

    noBtn.addEventListener("click", () => {
        noClickCount++;
        
        // Update NO response counter badge
        noClickBadge.style.display = "block";
        noClickCountText.innerText = noClickCount;
        
        // Cycle Funny Texts
        noResponseHint.innerText = noButtonTexts[noClickTextIndex];
        noBtn.innerText = noButtonTexts[noClickTextIndex];
        noClickTextIndex = (noClickTextIndex + 1) % noButtonTexts.length;

        // Move NO button away dynamically
        const cardRect = document.querySelector(".proposal-card").getBoundingClientRect();
        const btnRect = noBtn.getBoundingClientRect();
        
        // Random relative position bounds inside proposal card bounds
        const maxOffsetWidth = cardRect.width - btnRect.width - 40;
        const maxOffsetHeight = cardRect.height - btnRect.height - 180;
        
        const randomX = Math.floor(Math.random() * maxOffsetWidth) - (maxOffsetWidth / 2);
        const randomY = Math.floor(Math.random() * maxOffsetHeight) - (maxOffsetHeight / 2) + 40;
        
        noBtn.style.position = "relative";
        noBtn.style.left = `${randomX}px`;
        noBtn.style.top = `${randomY}px`;

        // YES button slowly becomes larger and more attractive
        const scaleFactor = 1 + (noClickCount * 0.25);
        yesBtn.style.transform = `scale(${scaleFactor})`;
        yesBtn.style.fontSize = `${1.1 + (noClickCount * 0.08)}rem`;
        yesBtn.style.padding = `${16 + (noClickCount * 2)}px ${36 + (noClickCount * 4)}px`;
        yesBtn.style.boxShadow = `0 0 ${15 + (noClickCount * 5)}px rgba(255, 77, 109, ${0.4 + (noClickCount * 0.1)})`;
        
        // Trigger Email Notification for NO attempt
        sendProposalNotification("declined");
    });

    // Make NO button run away on hover for mobile-first/desktop surprise
    noBtn.addEventListener("mouseover", () => {
        if (noClickCount > 0) {
            // Only start running on hover after first click to ensure they can click once at least
            noBtn.click();
        }
    });

    yesBtn.addEventListener("click", () => {
        // Play emotional success music
        loveAudio.pause();
        loveAudio.src = config.audio_success_url;
        loveAudio.load();
        loveAudio.play().then(() => {
            musicPlaying = true;
            document.getElementById("music-btn").classList.add("playing");
            document.getElementById("music-btn").classList.remove("muted");
        }).catch(e => console.log("Audio success play fail: ", e));

        // Heart Explosion particle count
        triggerHeartExplosion();

        // Show proposal popup
        const proposalPopup = document.getElementById("proposal-popup");
        proposalPopup.classList.add("active");

        // Send EmailJS Notification for YES
        sendProposalNotification("accepted");
    });

    // Close Popup and move to congratulations page
    document.getElementById("popup-close-btn").addEventListener("click", () => {
        document.getElementById("proposal-popup").classList.remove("active");
        navigateToPage(8);
    });
}

// --- EMAILJS SYSTEM TRIGGER ---
function sendProposalNotification(status) {
    const emailTo = config.email_to;
    const publicKey = config.emailjs_public_key;
    const serviceId = config.emailjs_service_id;
    const templateId = config.emailjs_template_id;

    // Guard checking if credentials are configured
    if (!publicKey || !serviceId || !templateId || !emailTo) {
        console.warn("EmailJS notification skipped: Settings not fully configured in the Admin panel.");
        return;
    }

    // Initialize EmailJS
    emailjs.init({
        publicKey: publicKey,
    });

    const date = new Date();
    const formattedDate = date.toLocaleDateString();
    const formattedTime = date.toLocaleTimeString();

    // Get Device and Browser Metadata
    const userAgent = navigator.userAgent;
    let browserName = "Unknown Browser";
    let deviceName = "Unknown Device";

    if (userAgent.indexOf("Firefox") > -1) browserName = "Mozilla Firefox";
    else if (userAgent.indexOf("Chrome") > -1) browserName = "Google Chrome";
    else if (userAgent.indexOf("Safari") > -1) browserName = "Apple Safari";
    else if (userAgent.indexOf("Edge") > -1) browserName = "Microsoft Edge";

    if (/Mobi|Android|iPhone/i.test(userAgent)) {
        deviceName = "Mobile Device";
        if (/iPhone/i.test(userAgent)) deviceName = "iPhone";
        else if (/Android/i.test(userAgent)) deviceName = "Android Phone";
    } else {
        deviceName = "Desktop / Laptop";
        if (userAgent.indexOf("Windows") > -1) deviceName = "Windows PC";
        else if (userAgent.indexOf("Macintosh") > -1) deviceName = "Apple Mac";
    }

    // Formulate payload variables matching template placeholders
    const payload = {
        to_email: emailTo,
        subject: status === "accepted" ? "❤️ Proposal Accepted!" : "🥺 Proposal Response Update",
        message: status === "accepted" 
            ? "She clicked YES! She accepted your proposal. ❤️" 
            : `She clicked NO. (Total NO button clicks: ${noClickCount})`,
        date: formattedDate,
        time: formattedTime,
        device: deviceName,
        browser: browserName,
        no_clicks: noClickCount
    };

    emailjs.send(serviceId, templateId, payload)
        .then(response => {
            console.log("EmailJS Sent Successfully!", response.status, response.text);
        })
        .catch(err => {
            console.error("EmailJS Send Failed", err);
        });
}

// --- HIDDEN ADMIN PANEL LOGIC ---
function setupAdminPanel() {
    const adminTrigger = document.getElementById("admin-trigger");
    const welcomeBunny = document.getElementById("welcome-bunny-img-preview");
    const adminModal = document.getElementById("admin-modal");
    const closeAdmin = document.getElementById("close-admin-btn");
    const resetAdmin = document.getElementById("reset-admin-btn");

    // Passcode gate protection for settings
    const ADMIN_PASSCODE = "love";

    // Single-click bottom-right tiny cog trigger (always visible, password gated)
    if (adminTrigger && adminModal) {
        adminTrigger.style.display = "flex";
        adminTrigger.addEventListener("click", () => {
            const entered = prompt("Enter Admin Passcode to customize:");
            if (entered === ADMIN_PASSCODE) {
                adminModal.classList.add("active");
            } else if (entered !== null) {
                alert("Incorrect Passcode! 😌");
            }
        });
    }

    // Hidden Combo 2: Click the Welcome bunny 5 times (backdoor password gate)
    if (welcomeBunny && adminModal) {
        let bunnyClickCount = 0;
        welcomeBunny.addEventListener("click", () => {
            if (currentPage === 1) {
                bunnyClickCount++;
                if (bunnyClickCount >= 5) {
                    const entered = prompt("Enter Admin Passcode to customize:");
                    if (entered === ADMIN_PASSCODE) {
                        adminModal.classList.add("active");
                    } else if (entered !== null) {
                        alert("Incorrect Passcode! 😌");
                    }
                    bunnyClickCount = 0; // reset
                }
            }
        });
    }

    if (closeAdmin && adminModal) {
        closeAdmin.addEventListener("click", () => {
            adminModal.classList.remove("active");
        });
    }

    if (resetAdmin) {
        resetAdmin.addEventListener("click", resetConfig);
    }

    // Tab Navigation
    const tabButtons = document.querySelectorAll(".admin-nav-item");
    const tabContents = document.querySelectorAll(".admin-tab-content");

    tabButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            tabButtons.forEach(b => b.classList.remove("active"));
            tabContents.forEach(c => c.classList.remove("active"));

            btn.classList.add("active");
            const targetTab = btn.getAttribute("data-tab");
            document.getElementById(targetTab).classList.add("active");
        });
    });

    // Handle Page Selection dynamic text generator
    const pageSelect = document.getElementById("admin-select-page");
    pageSelect.addEventListener("change", populateDynamicTextFields);
    populateDynamicTextFields(); // first load run

    // Setup Managers Save Listeners
    document.getElementById("save-texts-btn").addEventListener("click", saveDynamicTexts);
    document.getElementById("add-card-btn").addEventListener("click", addWhyLikeCard);
    document.getElementById("add-memory-btn").addEventListener("click", addMemoryTimelineItem);
    document.getElementById("add-change-btn").addEventListener("click", addLifeChangeItem);
    document.getElementById("add-promise-btn").addEventListener("click", addPromiseItem);
    document.getElementById("add-dream-btn").addEventListener("click", addDreamPlanItem);
    
    document.getElementById("save-proposal-btn").addEventListener("click", saveProposalSettings);
    document.getElementById("save-email-btn").addEventListener("click", saveEmailSettings);
    document.getElementById("save-styles-btn").addEventListener("click", saveStyleSettings);

    // Setup Image Upload handlers to save as Base64 in config
    setupImageUploadReaders();

    // Setup Git Push & Firebase Deploy button hooks
    const gitPushBtn = document.getElementById("git-push-btn");
    const firebaseDeployBtn = document.getElementById("firebase-deploy-btn");
    const syncStatusMsg = document.getElementById("sync-status-msg");

    if (gitPushBtn) {
        gitPushBtn.addEventListener("click", () => {
            showSyncStatus("Pushing changes to GitHub... Please wait.", "#ff758f");
            gitPushBtn.disabled = true;
            
            fetch('/api/git-push', { method: 'POST' })
                .then(res => res.json())
                .then(data => {
                    gitPushBtn.disabled = false;
                    if (data.success) {
                        showSyncStatus("Successfully pushed to GitHub! 🎉", "#06d6a0");
                    } else {
                        showSyncStatus("Failed to push. Check terminal console.", "#ff4d6d");
                        console.error("Git Push details:", data);
                    }
                })
                .catch(err => {
                    gitPushBtn.disabled = false;
                    showSyncStatus("Network error pushing to GitHub.", "#ff4d6d");
                    console.error("Git Push error:", err);
                });
        });
    }

    if (firebaseDeployBtn) {
        firebaseDeployBtn.addEventListener("click", () => {
            showSyncStatus("Deploying to Firebase... Please wait.", "#ff758f");
            firebaseDeployBtn.disabled = true;

            fetch('/api/firebase-deploy', { method: 'POST' })
                .then(res => res.json())
                .then(data => {
                    firebaseDeployBtn.disabled = false;
                    if (data.success) {
                        showSyncStatus("Successfully deployed live! 🚀", "#06d6a0");
                    } else {
                        showSyncStatus("Failed to deploy. Are you logged in? Check logs.", "#ff4d6d");
                        console.error("Firebase Deploy details:", data);
                    }
                })
                .catch(err => {
                    firebaseDeployBtn.disabled = false;
                    showSyncStatus("Network error deploying to Firebase.", "#ff4d6d");
                    console.error("Firebase Deploy error:", err);
                });
        });
    }

    function showSyncStatus(msg, color) {
        if (syncStatusMsg) {
            syncStatusMsg.style.display = "block";
            syncStatusMsg.innerText = msg;
            syncStatusMsg.style.color = color;
            setTimeout(() => {
                syncStatusMsg.style.display = "none";
            }, 8000);
        }
    }
}

function loadAdminInputs() {
    // proposal tab input values
    document.getElementById("proposal-question-input").value = config.p7_question;
    document.getElementById("proposal-popup-input").value = config.p8_final_message;

    // email tab input values
    document.getElementById("email-to-notify").value = config.email_to;
    document.getElementById("emailjs-public-key").value = config.emailjs_public_key;
    document.getElementById("emailjs-service-id").value = config.emailjs_service_id;
    document.getElementById("emailjs-template-id").value = config.emailjs_template_id;

    // styles tab values
    document.getElementById("color-primary").value = config.color_primary;
    document.getElementById("color-gradient-start").value = config.color_bg_start;
    document.getElementById("color-gradient-end").value = config.color_bg_end;
    document.getElementById("audio-track-url").value = config.audio_url;

    // Lists manager items reload
    renderAdminCardsList();
    renderAdminMemoriesList();
    renderAdminChangesList();
    renderAdminPromisesDreamsList();
}

// 1. DYNAMIC TEXT EDITORS
function populateDynamicTextFields() {
    const page = document.getElementById("admin-select-page").value;
    const dynamicFields = document.getElementById("dynamic-text-fields");
    dynamicFields.innerHTML = "";

    if (page === "p1") {
        dynamicFields.innerHTML = `
            <div class="admin-form-group">
                <label>Welcome Title:</label>
                <input type="text" id="edit-p1-title" class="admin-input" value="${config.p1_title}">
            </div>
            <div class="admin-form-group">
                <label>Welcome Subtitle:</label>
                <input type="text" id="edit-p1-subtitle" class="admin-input" value="${config.p1_subtitle}">
            </div>
        `;
    } else if (page === "p3") {
        dynamicFields.innerHTML = `
            <div class="admin-form-group">
                <label>Letter Heading Title:</label>
                <input type="text" id="edit-p3-title" class="admin-input" value="${config.p3_title}">
            </div>
            <div class="admin-form-group">
                <label>Romantic Letter Body Content (HTML allowed):</label>
                <textarea id="edit-p3-letter" class="admin-input" rows="6">${config.p3_letter}</textarea>
            </div>
        `;
    } else if (page === "p8") {
        dynamicFields.innerHTML = `
            <div class="admin-form-group">
                <label>Congratulations Header Title:</label>
                <input type="text" id="edit-p8-title" class="admin-input" value="${config.p8_title}">
            </div>
            <div class="admin-form-group">
                <label>Congratulations Subtitle:</label>
                <input type="text" id="edit-p8-subtitle" class="admin-input" value="${config.p8_subtitle}">
            </div>
        `;
    } else if (page === "p9") {
        dynamicFields.innerHTML = `
            <div class="admin-form-group">
                <label>First Screen Quote (HTML allowed):</label>
                <textarea id="edit-p9-text1" class="admin-input" rows="3">${config.p9_text1}</textarea>
            </div>
            <div class="admin-form-group">
                <label>Second Screen Quote (HTML allowed):</label>
                <textarea id="edit-p9-text2" class="admin-input" rows="3">${config.p9_text2}</textarea>
            </div>
        `;
    }
}

function saveDynamicTexts() {
    const page = document.getElementById("admin-select-page").value;
    if (page === "p1") {
        config.p1_title = document.getElementById("edit-p1-title").value;
        config.p1_subtitle = document.getElementById("edit-p1-subtitle").value;
    } else if (page === "p3") {
        config.p3_title = document.getElementById("edit-p3-title").value;
        config.p3_letter = document.getElementById("edit-p3-letter").value;
    } else if (page === "p8") {
        config.p8_title = document.getElementById("edit-p8-title").value;
        config.p8_subtitle = document.getElementById("edit-p8-subtitle").value;
    } else if (page === "p9") {
        config.p9_text1 = document.getElementById("edit-p9-text1").value;
        config.p9_text2 = document.getElementById("edit-p9-text2").value;
    }

    saveConfig();
    alert("Texts saved successfully!");
}

// 2. WHY I LIKE YOU CARDS LIST MANAGEMENT
function renderAdminCardsList() {
    const list = document.getElementById("admin-cards-list");
    list.innerHTML = "";
    config.like_cards.forEach((card, idx) => {
        list.innerHTML += `
            <div class="admin-sortable-item">
                <div class="admin-item-text">
                    <strong>${card.icon} ${card.title}</strong>
                    <small>${card.desc}</small>
                </div>
                <div class="admin-item-actions">
                    <button class="btn btn-secondary btn-sm" onclick="moveCard(${idx}, -1)">▲</button>
                    <button class="btn btn-secondary btn-sm" onclick="moveCard(${idx}, 1)">▼</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteCard(${card.id})">Delete</button>
                </div>
            </div>
        `;
    });
}

function addWhyLikeCard() {
    const icon = document.getElementById("card-icon-input").value.trim() || "❤️";
    const title = document.getElementById("card-title-input").value.trim();
    const desc = document.getElementById("card-desc-input").value.trim();

    if (!title || !desc) {
        alert("Please provide both card title and description.");
        return;
    }

    const newCard = {
        id: Date.now(),
        icon: icon,
        title: title,
        desc: desc
    };

    config.like_cards.push(newCard);
    saveConfig();
    
    // clear input fields
    document.getElementById("card-title-input").value = "";
    document.getElementById("card-desc-input").value = "";
    alert("Card added successfully!");
}

window.deleteCard = function(id) {
    if (confirm("Delete this card?")) {
        config.like_cards = config.like_cards.filter(c => c.id !== id);
        saveConfig();
    }
};

window.moveCard = function(index, direction) {
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= config.like_cards.length) return;

    // Swap elements
    const temp = config.like_cards[index];
    config.like_cards[index] = config.like_cards[targetIdx];
    config.like_cards[targetIdx] = temp;

    saveConfig();
};

// 3. TIMELINE MEMORIES MANAGEMENT
function renderAdminMemoriesList() {
    const list = document.getElementById("admin-memories-list");
    list.innerHTML = "";
    config.memories.forEach((mem, idx) => {
        list.innerHTML += `
            <div class="admin-sortable-item">
                <div class="admin-item-text">
                    <strong>📸 ${mem.title}</strong>
                    <small>${mem.desc}</small>
                </div>
                <div class="admin-item-actions">
                    <button class="btn btn-secondary btn-sm" onclick="moveMemory(${idx}, -1)">▲</button>
                    <button class="btn btn-secondary btn-sm" onclick="moveMemory(${idx}, 1)">▼</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteMemory(${mem.id})">Delete</button>
                </div>
            </div>
        `;
    });
}

// Global scope bindings for inline onclick attributes
window.deleteMemory = function(id) {
    if (confirm("Delete this timeline memory?")) {
        config.memories = config.memories.filter(m => m.id !== id);
        saveConfig();
    }
};

window.moveMemory = function(index, direction) {
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= config.memories.length) return;

    const temp = config.memories[index];
    config.memories[index] = config.memories[targetIdx];
    config.memories[targetIdx] = temp;

    saveConfig();
};

let uploadedMemoryBase64 = "";
function setupImageUploadReaders() {
    const memImgInput = document.getElementById("memory-image-input");
    memImgInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                uploadedMemoryBase64 = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    // Proposal images change
    setupSingleImageUploader("proposal-img-upload", "proposal_img");
    setupSingleImageUploader("welcome-img-upload", "p1_welcome_img");
    setupSingleImageUploader("congrats-img-upload", "congrats_img");
    setupSingleImageUploader("forever-img-upload", "forever_img");
}

function setupSingleImageUploader(inputId, configKey) {
    const input = document.getElementById(inputId);
    input.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                config[configKey] = event.target.result;
                saveConfig();
                alert("Image uploaded and updated!");
            };
            reader.readAsDataURL(file);
        }
    });
}

function addMemoryTimelineItem() {
    const title = document.getElementById("memory-title-input").value.trim();
    const desc = document.getElementById("memory-desc-input").value.trim();

    if (!title || !desc) {
        alert("Please fill in the title and description.");
        return;
    }

    const newItem = {
        id: Date.now(),
        image: uploadedMemoryBase64, // could be empty string, fallback to default splash
        title: title,
        desc: desc
    };

    config.memories.push(newItem);
    saveConfig();

    // clean fields
    document.getElementById("memory-title-input").value = "";
    document.getElementById("memory-desc-input").value = "";
    document.getElementById("memory-image-input").value = "";
    uploadedMemoryBase64 = "";
    alert("Timeline memory added!");
}

// 4. CHANGES TIMELINE MANAGEMENT
function renderAdminChangesList() {
    const list = document.getElementById("admin-changes-list");
    list.innerHTML = "";
    config.changes.forEach((ch, idx) => {
        list.innerHTML += `
            <div class="admin-sortable-item">
                <div class="admin-item-text">
                    <strong>${ch.icon} ${ch.title}</strong>
                    <small>${ch.desc}</small>
                </div>
                <div class="admin-item-actions">
                    <button class="btn btn-secondary btn-sm" onclick="moveChange(${idx}, -1)">▲</button>
                    <button class="btn btn-secondary btn-sm" onclick="moveChange(${idx}, 1)">▼</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteChange(${ch.id})">Delete</button>
                </div>
            </div>
        `;
    });
}

window.deleteChange = function(id) {
    if (confirm("Delete this timeline change item?")) {
        config.changes = config.changes.filter(c => c.id !== id);
        saveConfig();
    }
};

window.moveChange = function(index, direction) {
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= config.changes.length) return;

    const temp = config.changes[index];
    config.changes[index] = config.changes[targetIdx];
    config.changes[targetIdx] = temp;

    saveConfig();
};

function addLifeChangeItem() {
    const icon = document.getElementById("change-emoji-input").value.trim() || "💖";
    const title = document.getElementById("change-title-input").value.trim();
    const desc = document.getElementById("change-desc-input").value.trim();

    if (!title || !desc) {
        alert("Please provide change title and desc.");
        return;
    }

    config.changes.push({
        id: Date.now(),
        icon: icon,
        title: title,
        desc: desc
    });
    saveConfig();

    document.getElementById("change-title-input").value = "";
    document.getElementById("change-desc-input").value = "";
    alert("Change item added!");
}

// 5. PROMISES & PLANS MANAGEMENT
function renderAdminPromisesDreamsList() {
    const promisesBox = document.getElementById("admin-promises-list");
    promisesBox.innerHTML = "";
    config.promises.forEach((pr, idx) => {
        promisesBox.innerHTML += `
            <div class="admin-simple-item">
                <span>${pr}</span>
                <button class="btn btn-danger btn-sm" onclick="deletePromise(${idx})">×</button>
            </div>
        `;
    });

    const dreamsBox = document.getElementById("admin-dreams-list");
    dreamsBox.innerHTML = "";
    config.dreams.forEach((dr, idx) => {
        dreamsBox.innerHTML += `
            <div class="admin-simple-item">
                <span>${dr}</span>
                <button class="btn btn-danger btn-sm" onclick="deleteDream(${idx})">×</button>
            </div>
        `;
    });
}

window.deletePromise = function(index) {
    config.promises.splice(index, 1);
    saveConfig();
};

window.deleteDream = function(index) {
    config.dreams.splice(index, 1);
    saveConfig();
};

function addPromiseItem() {
    const text = document.getElementById("promise-input").value.trim();
    if (text) {
        config.promises.push(text);
        saveConfig();
        document.getElementById("promise-input").value = "";
    }
}

function addDreamPlanItem() {
    const text = document.getElementById("dream-input").value.trim();
    if (text) {
        config.dreams.push(text);
        saveConfig();
        document.getElementById("dream-input").value = "";
    }
}

// 6. PROPOSAL SETTINGS
function saveProposalSettings() {
    config.p7_question = document.getElementById("proposal-question-input").value;
    config.p8_final_message = document.getElementById("proposal-popup-input").value;
    saveConfig();
    alert("Proposal Details Saved!");
}

// 7. EMAIL SETTINGS
function saveEmailSettings() {
    config.email_to = document.getElementById("email-to-notify").value.trim();
    config.emailjs_public_key = document.getElementById("emailjs-public-key").value.trim();
    config.emailjs_service_id = document.getElementById("emailjs-service-id").value.trim();
    config.emailjs_template_id = document.getElementById("emailjs-template-id").value.trim();
    saveConfig();
    alert("Email Notification settings saved!");
}

// 8. THEME & COLORS
function saveStyleSettings() {
    config.color_primary = document.getElementById("color-primary").value;
    config.color_bg_start = document.getElementById("color-gradient-start").value;
    config.color_bg_end = document.getElementById("color-gradient-end").value;
    
    const audioUrl = document.getElementById("audio-track-url").value.trim();
    if (audioUrl && audioUrl !== config.audio_url) {
        config.audio_url = audioUrl;
        loveAudio.src = audioUrl;
        loveAudio.load();
        if (musicPlaying) loveAudio.play().catch(e => console.log("Reload audio fail: ", e));
    }
    
    saveConfig();
    alert("Styling settings saved and applied!");
}

// --- SCROLL ANIMATION EVENT MONITOR ---
function setupScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
            }
        });
    }, { threshold: 0.15 });

    // Periodically search for newly populated items to attach animation listeners
    setInterval(() => {
        document.querySelectorAll(".timeline-item").forEach(item => {
            observer.observe(item);
        });
    }, 1000);
}

// --- CANVAS PARTICLE SYSTEM ENGINE ---
let canvas, ctx;
let particles = [];
let activeParticleMode = "romantic_drift"; // drift | stars_and_candles | fireworks_and_celebration | starry_sky_tree

function setupCanvas() {
    canvas = document.getElementById("particle-canvas");
    ctx = canvas.getContext("2d");

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Initial fill
    spawnInitialParticles();

    // Start render loop
    requestAnimationFrame(renderLoop);
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function spawnInitialParticles() {
    particles = [];
    // Spawn initial drifting hearts & sparkles
    for (let i = 0; i < 35; i++) {
        particles.push(createRomanticParticle(true));
    }
}

function createRomanticParticle(randomY = false) {
    return {
        x: Math.random() * canvas.width,
        y: randomY ? Math.random() * canvas.height : canvas.height + 20,
        size: Math.random() * 8 + 4,
        speedX: Math.random() * 1.2 - 0.6,
        speedY: -(Math.random() * 1.5 + 0.6),
        type: Math.random() > 0.4 ? "heart" : "sparkle",
        color: getRandomRomanticColor(),
        alpha: Math.random() * 0.5 + 0.3,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: Math.random() * 0.02 - 0.01
    };
}

function getRandomRomanticColor() {
    const colors = [
        "rgba(255, 77, 109, ",
        "rgba(255, 117, 143, ",
        "rgba(255, 179, 198, ",
        "rgba(255, 204, 213, ",
        "rgba(229, 179, 141, " // Rose Gold hue
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}

function drawHeart(x, y, size, alpha, color, rotation = 0) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.beginPath();
    ctx.fillStyle = color + alpha + ")";
    
    // Heart Shape formulation path
    ctx.moveTo(0, -size / 2);
    ctx.bezierCurveTo(size / 2, -size, size * 1.2, -size / 3, 0, size);
    ctx.bezierCurveTo(-size * 1.2, -size / 3, -size / 2, -size, 0, -size / 2);
    
    ctx.fill();
    ctx.restore();
}

function drawSparkle(x, y, size, alpha, color) {
    ctx.save();
    ctx.translate(x, y);
    ctx.beginPath();
    ctx.fillStyle = color + alpha + ")";
    
    // 4 point star sparkle
    ctx.moveTo(0, -size);
    ctx.lineTo(size * 0.2, -size * 0.2);
    ctx.lineTo(size, 0);
    ctx.lineTo(size * 0.2, size * 0.2);
    ctx.lineTo(0, size);
    ctx.lineTo(-size * 0.2, size * 0.2);
    ctx.lineTo(-size, 0);
    ctx.lineTo(-size * 0.2, -size * 0.2);
    
    ctx.fill();
    ctx.restore();
}

function triggerHeartExplosion() {
    // Spawn 120 heart particles from the center
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    for (let i = 0; i < 120; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 8 + 3;
        particles.push({
            x: centerX,
            y: centerY,
            size: Math.random() * 12 + 6,
            speedX: Math.cos(angle) * speed,
            speedY: Math.sin(angle) * speed,
            type: "heart",
            color: "rgba(255, 26, 83, ", // Hot deep red-pink
            alpha: 1.0,
            rotation: Math.random() * Math.PI,
            rotSpeed: Math.random() * 0.1 - 0.05,
            decay: Math.random() * 0.015 + 0.008
        });
    }

    // Add confetti bursts
    triggerConfettiExplosion();
}

function triggerConfettiExplosion() {
    for (let i = 0; i < 80; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: -10,
            size: Math.random() * 8 + 6,
            speedX: Math.random() * 4 - 2,
            speedY: Math.random() * 5 + 3,
            type: "confetti",
            color: getRandomConfettiColor(),
            alpha: 1.0,
            rotation: Math.random() * Math.PI,
            rotSpeed: Math.random() * 0.15 - 0.07,
            decay: 0
        });
    }
}

function getRandomConfettiColor() {
    const colors = [
        "rgba(255, 77, 109, ",
        "rgba(255, 215, 0, ", // Gold
        "rgba(255, 255, 255, ",
        "rgba(0, 180, 216, ", // Romantic blue accent
        "rgba(141, 153, 174, "
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}

function triggerInfiniteHearts() {
    // Continuous fountain of rising hearts
    let count = 0;
    const interval = setInterval(() => {
        count++;
        for (let i = 0; i < 5; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: canvas.height + 20,
                size: Math.random() * 14 + 6,
                speedX: Math.random() * 2 - 1,
                speedY: -(Math.random() * 4 + 2),
                type: "heart",
                color: "rgba(255, 77, 109, ",
                alpha: 1.0,
                rotation: Math.random() * Math.PI,
                rotSpeed: Math.random() * 0.05 - 0.025
            });
        }
        if (count > 50) clearInterval(interval); // Stops after 50 bursts (still hundreds of hearts)
    }, 100);
}

// Fireworks Launcher
function launchFirework() {
    if (activeParticleMode !== "fireworks_and_celebration") return;

    const startX = Math.random() * canvas.width;
    const startY = canvas.height;
    const targetY = Math.random() * (canvas.height * 0.5) + 50;
    
    // Launching rocket
    particles.push({
        x: startX,
        y: startY,
        targetY: targetY,
        size: 3,
        speedX: Math.random() * 2 - 1,
        speedY: -10,
        type: "rocket",
        color: "rgba(255, 255, 255, ",
        alpha: 1.0
    });
}

function explodeFirework(x, y) {
    const burstColor = getRandomConfettiColor();
    const sparks = 45;
    for (let i = 0; i < sparks; i++) {
        const angle = (i / sparks) * Math.PI * 2 + Math.random() * 0.5;
        const speed = Math.random() * 5 + 2;
        particles.push({
            x: x,
            y: y,
            size: Math.random() * 4 + 2,
            speedX: Math.cos(angle) * speed,
            speedY: Math.sin(angle) * speed,
            type: "spark",
            color: burstColor,
            alpha: 1.0,
            decay: Math.random() * 0.02 + 0.015
        });
    }
}

// Particle Engine Loop
function renderLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Periodic fireworks launcher
    if (activeParticleMode === "fireworks_and_celebration" && Math.random() < 0.03) {
        launchFirework();
    }

    // Spawn new backdrop elements for standard drifting pages
    if (activeParticleMode === "romantic_drift" && particles.filter(p => p.type === "heart" || p.type === "sparkle").length < 35) {
        particles.push(createRomanticParticle(false));
    }

    // Spawn falling stars/leaves for tree silhouette scene
    if (activeParticleMode === "starry_sky_tree" && Math.random() < 0.08) {
        particles.push({
            x: Math.random() * canvas.width,
            y: -10,
            size: Math.random() * 4 + 2,
            speedX: Math.random() * 1.5 - 1.2,
            speedY: Math.random() * 1.5 + 1.0,
            type: "star_drift",
            color: Math.random() > 0.4 ? "rgba(255, 77, 109, " : "rgba(255, 222, 233, ",
            alpha: Math.random() * 0.6 + 0.4
        });
    }

    // Particle logic updates
    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        // Draw and update by type
        if (p.type === "heart") {
            drawHeart(p.x, p.y, p.size, p.alpha, p.color, p.rotation);
            p.x += p.speedX;
            p.y += p.speedY;
            p.rotation += p.rotSpeed;

            // Decay logic (if set, i.e. explosion mode)
            if (p.decay) {
                p.alpha -= p.decay;
                if (p.alpha <= 0) particles.splice(i, 1);
            } else {
                // drift wrap logic
                if (p.y < -20 || p.x < -20 || p.x > canvas.width + 20) {
                    particles.splice(i, 1);
                }
            }
        } 
        else if (p.type === "sparkle") {
            drawSparkle(p.x, p.y, p.size, p.alpha, p.color);
            p.x += p.speedX;
            p.y += p.speedY;
            p.alpha -= 0.003;
            if (p.alpha <= 0 || p.y < -20) {
                particles.splice(i, 1);
            }
        } 
        else if (p.type === "confetti") {
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rotation);
            ctx.fillStyle = p.color + p.alpha + ")";
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
            ctx.restore();

            p.x += p.speedX;
            p.y += p.speedY;
            p.rotation += p.rotSpeed;

            if (p.y > canvas.height + 10) {
                particles.splice(i, 1);
            }
        } 
        else if (p.type === "rocket") {
            // Draw small glowing head
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
            ctx.fill();

            // sparks trail
            if (Math.random() < 0.3) {
                particles.push({
                    x: p.x,
                    y: p.y,
                    size: Math.random() * 2 + 1,
                    speedX: Math.random() * 1 - 0.5,
                    speedY: Math.random() * 2 + 1,
                    type: "sparkle",
                    color: "rgba(255, 175, 50, ",
                    alpha: 0.8
                });
            }

            p.y += p.speedY;
            p.x += p.speedX;

            // Explode target threshold
            if (p.y <= p.targetY) {
                explodeFirework(p.x, p.y);
                particles.splice(i, 1);
            }
        } 
        else if (p.type === "spark") {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = p.color + p.alpha + ")";
            ctx.fill();

            p.x += p.speedX;
            p.y += p.speedY;
            p.speedY += 0.08; // gravity drop
            p.alpha -= p.decay;

            if (p.alpha <= 0) {
                particles.splice(i, 1);
            }
        }
        else if (p.type === "star_drift") {
            drawHeart(p.x, p.y, p.size, p.alpha, p.color, p.y * 0.02);
            p.x += p.speedX;
            p.y += p.speedY;
            
            if (p.y > canvas.height + 10) {
                particles.splice(i, 1);
            }
        }
    }

    requestAnimationFrame(renderLoop);
}
