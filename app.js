/**
 * JARVIS OS - Cross-Platform Admin Panel & Real-time Sync Engine
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initial State
    let isSimulating = true;
    let syncPacketsPerSec = 148;
    let activeNodesCount = 3;
    let queuedTasksCount = 3;
    let eventStreamIndex = 100;

    // Mobile Device Nodes Data
    const mobileNodes = [
        {
            id: 'node-m1',
            name: "Alex's iPhone 15 Pro",
            platform: 'iOS 17.4',
            status: 'online',
            syncState: 'In Sync',
            battery: '88%',
            lastSeen: 'Just now',
            ip: '192.168.1.104',
            icon: 'fa-apple'
        },
        {
            id: 'node-m2',
            name: "Work Pixel 8 Pro",
            platform: 'Android 14',
            status: 'syncing',
            syncState: 'Syncing Tasks',
            battery: '64%',
            lastSeen: '2s ago',
            ip: '192.168.1.112',
            icon: 'fa-android'
        },
        {
            id: 'node-m3',
            name: "Jarvis Mobile Node #3",
            platform: 'Android 13',
            status: 'online',
            syncState: 'Idle / Listening',
            battery: '95%',
            lastSeen: '5s ago',
            ip: '10.0.4.88',
            icon: 'fa-mobile-screen'
        }
    ];

    // Simulated Live Sync Log Stream
    const syncLogs = [
        { type: 'mobile', tag: '[MOBILE→WEB]', text: 'Synced User Task: "Reminder - Review SRS Spec at 11 AM"', time: getFormattedTime() },
        { type: 'web', tag: '[WEB→MOBILE]', text: 'Admin updated LLM Context Prompt -> Pushed to 3 nodes', time: getFormattedTime(1) },
        { type: 'ai', tag: '[JARVIS AI]', text: 'Autonomous workflow executed: Weather alert cached for mobile client', time: getFormattedTime(2) },
        { type: 'mobile', tag: '[MOBILE→WEB]', text: 'Device Alex\'s iPhone battery telemetry updated (88%)', time: getFormattedTime(3) }
    ];

    // Element References
    const navItems = document.querySelectorAll('.nav-item');
    const tabPanes = document.querySelectorAll('.tab-pane');
    const pageTitle = document.getElementById('current-page-title');
    const pageSubtitle = document.getElementById('current-page-subtitle');
    const dashboardSyncFeed = document.getElementById('dashboard-sync-feed');
    const quickDeviceList = document.getElementById('quick-device-list');
    const fullSyncStream = document.getElementById('full-sync-stream');
    const fullNodesGrid = document.getElementById('full-nodes-grid');
    const terminalOutput = document.getElementById('jarvis-terminal-output');
    const terminalInput = document.getElementById('terminal-input');
    const terminalSendBtn = document.getElementById('terminal-send-btn');
    const btnToggleSim = document.getElementById('btn-toggle-sim');
    const simBtnText = document.getElementById('sim-btn-text');
    const btnPairDevice = document.getElementById('btn-pair-device');
    const pairModal = document.getElementById('pair-modal');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const modalCancelBtn = document.getElementById('modal-cancel-btn');
    const modalConfirmBtn = document.getElementById('modal-confirm-btn');

    // Page Tab Subtitles
    const tabMeta = {
        'section-voice-talk': { title: '1. Voice Talk & Answer', subtitle: 'Interactive J.A.R.V.I.S speech HUD with real-time Question & Answer displays' },
        'section-live-output': { title: '2. Live Output & System Data', subtitle: 'Unified telemetry logs, mobile devices, AI terminal, JSON Studio, and API explorer' }
    };

    // -------------------------------------------------------------
    // Main 2-Section Navigation Handler
    // -------------------------------------------------------------
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetTab = item.getAttribute('data-tab');

            navItems.forEach(n => n.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));

            item.classList.add('active');
            const targetPane = document.getElementById(`tab-${targetTab}`);
            if (targetPane) targetPane.classList.add('active');

            if (tabMeta[targetTab]) {
                pageTitle.textContent = tabMeta[targetTab].title;
                pageSubtitle.textContent = tabMeta[targetTab].subtitle;
            }
        });
    });

    // Section 2 Subnav Handler
    const subnavBtns = document.querySelectorAll('.subnav-btn');
    const subpanes = document.querySelectorAll('.subpane');

    subnavBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetSubpane = btn.getAttribute('data-subpane');

            subnavBtns.forEach(b => b.classList.remove('active'));
            subpanes.forEach(p => p.classList.remove('active'));

            btn.classList.add('active');
            const target = document.getElementById(targetSubpane);
            if (target) target.classList.add('active');

            // Force Re-render to ensure outputs are 100% populated
            renderDashboardSyncFeed();
            renderFullSyncStream();
            renderFullNodesGrid();
        });
    });

    document.getElementById('view-all-nodes-btn')?.addEventListener('click', () => {
        document.querySelector('.nav-item[data-tab="mobile-nodes"]')?.click();
    });

    // -------------------------------------------------------------
    // Render Functions
    // -------------------------------------------------------------
    function renderDashboardSyncFeed() {
        if (!dashboardSyncFeed) return;
        dashboardSyncFeed.innerHTML = syncLogs.slice(0, 5).map(log => `
            <div class="sync-item">
                <div class="sync-type-icon ${log.type}">
                    <i class="fa-solid ${getLogIcon(log.type)}"></i>
                </div>
                <div class="sync-item-details">
                    <div class="sync-title">${log.text}</div>
                    <div class="sync-sub">${log.tag} • Latency < 45ms</div>
                </div>
                <div class="sync-time">${log.time}</div>
            </div>
        `).join('');
    }

    function renderFullSyncStream() {
        if (!fullSyncStream) return;
        fullSyncStream.innerHTML = syncLogs.map(log => `
            <div class="stream-row ${log.type}">
                <span class="stream-ts">[${log.time}]</span>
                <span class="stream-tag ${log.type}">${log.tag}</span>
                <span class="stream-msg">${log.text}</span>
            </div>
        `).join('');
    }

    function renderQuickDeviceList() {
        if (!quickDeviceList) return;
        quickDeviceList.innerHTML = mobileNodes.map(node => `
            <div class="device-card-mini">
                <div class="device-avatar">
                    <i class="fa-brands ${node.icon}"></i>
                </div>
                <div class="device-details">
                    <div class="device-name">${node.name}</div>
                    <div class="device-meta">${node.platform} • IP: ${node.ip}</div>
                </div>
                <span class="device-status-chip ${node.status}">${node.syncState}</span>
            </div>
        `).join('');
    }

    function renderFullNodesGrid() {
        if (!fullNodesGrid) return;
        fullNodesGrid.innerHTML = mobileNodes.map(node => `
            <div class="node-card">
                <div class="node-card-header">
                    <div class="node-icon-title">
                        <div class="node-big-icon">
                            <i class="fa-brands ${node.icon}"></i>
                        </div>
                        <div class="node-details">
                            <h4>${node.name}</h4>
                            <p>${node.platform} • ${node.ip}</p>
                        </div>
                    </div>
                    <span class="device-status-chip ${node.status}">${node.status.toUpperCase()}</span>
                </div>
                <div class="node-card-stats">
                    <div class="stat-item">
                        <span>Sync State</span>
                        <strong>${node.syncState}</strong>
                    </div>
                    <div class="stat-item">
                        <span>Battery</span>
                        <strong>${node.battery}</strong>
                    </div>
                    <div class="stat-item">
                        <span>Last Active</span>
                        <strong>${node.lastSeen}</strong>
                    </div>
                    <div class="stat-item">
                        <span>Protocol</span>
                        <strong>WSS / E2EE</strong>
                    </div>
                </div>
                <div class="node-actions">
                    <button class="btn btn-secondary btn-full ping-btn" data-name="${node.name}">
                        <i class="fa-solid fa-signal"></i> Ping Node
                    </button>
                    <button class="btn btn-secondary disconnect-btn" data-id="${node.id}">
                        <i class="fa-solid fa-power-off"></i>
                    </button>
                </div>
            </div>
        `).join('');

        // Attach Ping listeners
        document.querySelectorAll('.ping-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const name = e.currentTarget.getAttribute('data-name');
                appendTerminalLine(`[PING] Direct ping packet sent to node: ${name}`, 'cmd-sync');
                addSyncLog('web', '[WEB→MOBILE]', `Direct ping payload transmitted to ${name}`);
            });
        });
    }

    function renderSRSContent() {
        const target = document.getElementById('srs-render-target');
        if (!target) return;
        target.innerHTML = `
            <article class="srs-article">
                <h1 id="srs-sec-1">1. Introduction & Purpose</h1>
                <p>This Software Requirements Specification (SRS) governs the architecture, data formats, and real-time state synchronization for the <strong>Jarvis Cross-Platform AI Ecosystem</strong>.</p>
                <p>The system connects high-performance Web Admin Control panels with mobile client nodes (Android/iOS) over persistent encrypted WebSockets.</p>

                <h2 id="srs-sec-2">2. Overall System Description</h2>
                <p>Jarvis provides an autonomous personal and enterprise assistant experience. Key architectural pillars:</p>
                <ul>
                    <li><strong>Bi-Directional State Synchronization</strong>: Instant mirror of tasks, notifications, and AI intent results.</li>
                    <li><strong>Offline CRDT Conflict Resolution</strong>: Queues offline mobile actions and reconciles seamlessly upon connection.</li>
                    <li><strong>AES-256 E2EE Payload Encryption</strong>: Secure sync communication protecting user data privacy.</li>
                </ul>

                <h2 id="srs-sec-3">3. Functional Requirements</h2>
                <h3>3.1 State Synchronization (SYNC-01)</h3>
                <p>Target delivery latency across mobile and web interfaces must remain strictly under <code>150ms</code>.</p>
                
                <h3>3.2 Mobile Remote Control (ADM-01)</h3>
                <p>Administrators can issue direct command instructions, push notifications, and LLM model parameter updates to connected nodes.</p>

                <h2 id="srs-sec-4">4. Non-Functional Requirements</h2>
                <p>Support up to 10,000 concurrent mobile nodes per orchestrator instance with 99.99% availability.</p>

                <h2 id="srs-sec-5">5. Data Model Schema</h2>
                <p>Entities include <code>USER</code>, <code>DEVICE_NODE</code>, <code>TASK_SESSION</code>, and <code>SYNC_EVENT</code> synced via JSON payloads.</p>
            </article>
        `;
    }

    // -------------------------------------------------------------
    // Helper Functions
    // -------------------------------------------------------------
    function getLogIcon(type) {
        if (type === 'mobile') return 'fa-mobile-screen';
        if (type === 'web') return 'fa-desktop';
        return 'fa-robot';
    }

    function getFormattedTime(offsetSec = 0) {
        const d = new Date(Date.now() - offsetSec * 1000);
        return d.toTimeString().split(' ')[0] + '.' + String(d.getMilliseconds()).padStart(3, '0');
    }

    function addSyncLog(type, tag, text) {
        syncLogs.unshift({ type, tag, text, time: getFormattedTime() });
        if (syncLogs.length > 50) syncLogs.pop();
        renderDashboardSyncFeed();
        renderFullSyncStream();
    }

    // -------------------------------------------------------------
    // Stark HUD Web Audio SFX & Voice Engine
    // -------------------------------------------------------------
    let audioCtx = null;

    function playStarkSound(type = 'beep') {
        try {
            if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            if (audioCtx.state === 'suspended') audioCtx.resume();

            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);

            const now = audioCtx.currentTime;
            if (type === 'wake') {
                osc.type = 'sine';
                osc.frequency.setValueAtTime(440, now);
                osc.frequency.exponentialRampToValueAtTime(880, now + 0.15);
                gain.gain.setValueAtTime(0.15, now);
                gain.gain.linearRampToValueAtTime(0.01, now + 0.3);
                osc.start(now);
                osc.stop(now + 0.3);
            } else if (type === 'speaking') {
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(520, now);
                osc.frequency.exponentialRampToValueAtTime(650, now + 0.1);
                gain.gain.setValueAtTime(0.1, now);
                gain.gain.linearRampToValueAtTime(0.01, now + 0.2);
                osc.start(now);
                osc.stop(now + 0.2);
            }
        } catch (e) {
            console.log('Audio Context muted');
        }
    }

    // Speech Recognition & Synthesis
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    let recognition = null;
    let isListening = false;

    const btnHudMicTalk = document.getElementById('btn-hud-mic-talk');
    const btnHudQuickSync = document.getElementById('btn-hud-quick-sync');
    const jarvisInteractiveHud = document.getElementById('jarvis-interactive-hud');
    const hudSubtitleOutput = document.getElementById('hud-subtitle-output');
    const hudStatusText = document.getElementById('hud-status-text');

    function speakJarvis(text) {
        if (!('speechSynthesis' in window)) return;

        window.speechSynthesis.cancel();
        hudVisualizer?.classList.add('active');
        jarvisInteractiveHud?.classList.add('speaking');
        playStarkSound('speaking');

        if (hudSubtitleOutput) hudSubtitleOutput.textContent = `"${text}"`;

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        utterance.pitch = 0.95;

        // Try selecting British / Sophisticated Male Voice if available
        const voices = window.speechSynthesis.getVoices();
        const jarvisVoice = voices.find(v => 
            (v.name.includes('British') || v.name.includes('UK') || v.name.includes('Daniel') || v.name.includes('George') || v.name.includes('Google UK English Male')) && v.lang.startsWith('en')
        ) || voices.find(v => v.lang.startsWith('en'));

        if (jarvisVoice) utterance.voice = jarvisVoice;

        utterance.onend = () => {
            hudVisualizer?.classList.remove('active');
            jarvisInteractiveHud?.classList.remove('speaking');
        };

        window.speechSynthesis.speak(utterance);
    }

    function typeWriterTerminalLine(text, className = 'system-line') {
        if (hudSubtitleOutput && text.startsWith('[J.A.R.V.I.S]:')) {
            hudSubtitleOutput.textContent = `"${text.replace('[J.A.R.V.I.S]: ', '')}"`;
        }

        if (!terminalOutput) return;
        const line = document.createElement('div');
        line.className = `terminal-line ${className}`;
        terminalOutput.appendChild(line);

        let idx = 0;
        const speed = 25;

        function type() {
            if (idx < text.length) {
                line.textContent += text.charAt(idx);
                idx++;
                terminalOutput.scrollTop = terminalOutput.scrollHeight;
                setTimeout(type, speed);
            }
        }
        type();
    }

    function updateMicUI(listening) {
        if (listening) {
            btnJarvisWake?.classList.add('active-listening');
            jarvisInteractiveHud?.classList.add('listening');
            if (wakeBtnText) wakeBtnText.textContent = 'LISTENING...';
            if (hudStatusText) hudStatusText.textContent = 'LISTENING TO SPEECH INPUT...';
            playStarkSound('wake');
        } else {
            btnJarvisWake?.classList.remove('active-listening');
            jarvisInteractiveHud?.classList.remove('listening');
            if (wakeBtnText) wakeBtnText.textContent = 'TALK TO J.A.R.V.I.S.';
            if (hudStatusText) hudStatusText.textContent = 'ONLINE & LISTENING • TAP HUD OR SPEAK';
        }
    }

    if (SpeechRecognition) {
        recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
            isListening = true;
            updateMicUI(true);
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            updateMicUI(false);
            if (terminalInput) terminalInput.value = transcript;
            appendTerminalLine(`[YOU]: "${transcript}"`, 'cmd-user');
            processJarvisVoiceCommand(transcript);
        };

        recognition.onerror = (event) => {
            updateMicUI(false);
            appendTerminalLine(`[HUD ERROR]: Microphone ${event.error}`, 'cmd-sync');
        };

        recognition.onend = () => {
            isListening = false;
            updateMicUI(false);
        };
    }

    function triggerJarvisListening() {
        playStarkSound('wake');
        if (!SpeechRecognition || !recognition) {
            const promptInput = prompt("Speech API disabled in this browser. Enter voice command:");
            if (promptInput) processJarvisVoiceCommand(promptInput);
            return;
        }

        if (isListening) {
            recognition.stop();
        } else {
            document.querySelector('.nav-item[data-tab="terminal"]')?.click();
            try {
                recognition.start();
            } catch (err) {
                console.error(err);
            }
        }
    }

    btnJarvisWake?.addEventListener('click', triggerJarvisListening);
    arcReactorMain?.addEventListener('click', triggerJarvisListening);
    arcReactorTrigger?.addEventListener('click', triggerJarvisListening);
    btnHudMicTalk?.addEventListener('click', triggerJarvisListening);
    jarvisInteractiveHud?.addEventListener('click', triggerJarvisListening);

    btnHudQuickSync?.addEventListener('click', () => {
        executeCommand('sync --force');
        processJarvisVoiceCommand('force sync mobile nodes');
    });

    // -------------------------------------------------------------
    // Jarvis AI Engine & API Gateway Integration
    // -------------------------------------------------------------
    async function fetchJarvisAIResponse(userQuery) {
        const lower = userQuery.toLowerCase().trim();

        // System Shortcuts
        if (lower === 'help') {
            return "Available commands: 'status' (diagnostics), 'sync' (force sync mobile nodes), 'device list' (connected phones), 'srs' (open SRS spec), 'json' (open JSON studio), or ask me any general question!";
        }
        if (lower.includes('srs') || lower.includes('specification')) {
            document.querySelector('.nav-item[data-tab="srs-viewer"]')?.click();
            return "Displaying the Software Requirements Specification on the main holographic display.";
        }
        if (lower.includes('json') || lower.includes('schema')) {
            document.querySelector('.nav-item[data-tab="json-studio"]')?.click();
            return "Opening the live JSON Studio & Schema Lab for schema editing and validation.";
        }

        // Call Server API Gateway (Powered by Google Gemini & Claude API)
        try {
            const res = await fetch('/api/v1/mobile/voice-query', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ device_id: 'web-admin-node', query_text: userQuery })
            });
            const data = await res.json();
            if (data && data.jarvis_response) {
                return data.jarvis_response;
            }
        } catch (e) {
            console.log('Server API Gateway offline - using Jarvis fallback response');
        }

        // Local Fallback Response
        return `Good day, Sir. Processing your question: "${userQuery}". All mobile nodes and web state are synchronized.`;
    }

    async function handleUserQuestion(questionText) {
        if (!questionText || !questionText.trim()) return;

        const cleanQ = questionText.trim();

        // 1. Update Holographic Question Display
        const hudQuestionOutput = document.getElementById('hud-question-output');
        const hudSubtitleOutput = document.getElementById('hud-subtitle-output');
        
        if (hudQuestionOutput) hudQuestionOutput.textContent = `"${cleanQ}"`;
        if (hudSubtitleOutput) hudSubtitleOutput.textContent = `"Processing answer via AI..."`;

        // 2. Print User Question in Terminal
        appendTerminalLine(`[QUESTION]: "${cleanQ}"`, 'cmd-user');

        // 3. Fetch Answer
        const answerText = await fetchJarvisAIResponse(cleanQ);

        // 4. Update HUD Subtitles, Terminal & Feed Logs
        if (hudSubtitleOutput) hudSubtitleOutput.textContent = `"${answerText}"`;
        typeWriterTerminalLine(`[J.A.R.V.I.S]: ${answerText}`, 'system-line');
        addSyncLog('ai', '[J.A.R.V.I.S RESPONSE]', `Answered: "${cleanQ}"`);

        // Force output feeds to re-render immediately
        renderDashboardSyncFeed();
        renderFullSyncStream();

        speakJarvis(answerText);
    }

    function processJarvisVoiceCommand(query) {
        handleUserQuestion(query);
    }

    // -------------------------------------------------------------
    // Interactive Terminal Execution
    // -------------------------------------------------------------
    function appendTerminalLine(text, className = 'cmd-output') {
        if (!terminalOutput) return;
        const line = document.createElement('div');
        line.className = `terminal-line ${className}`;
        line.textContent = text;
        terminalOutput.appendChild(line);
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }

    function executeCommandInternal(cmd) {
        appendTerminalLine(`[SYSTEM COMMAND]: ${cmd}`, 'cmd-sync');
    }

    function executeCommand(cmd) {
        if (!cmd.trim()) return;
        handleUserQuestion(cmd);
    }

    terminalSendBtn?.addEventListener('click', () => {
        executeCommand(terminalInput.value);
        terminalInput.value = '';
    });

    terminalInput?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            executeCommand(terminalInput.value);
            terminalInput.value = '';
        }
    });

    document.querySelectorAll('.suggest-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            const cmd = chip.getAttribute('data-cmd');
            if (cmd) executeCommand(cmd);
        });
    });

    // -------------------------------------------------------------
    // Simulated Real-Time Sync Loop
    // -------------------------------------------------------------
    const simulatedEvents = [
        { type: 'mobile', tag: '[MOBILE→WEB]', text: 'User completed mobile task: "Updated Grocery List"' },
        { type: 'ai', tag: '[JARVIS AI]', text: 'Background context update: Calendar event synced to admin view' },
        { type: 'mobile', tag: '[MOBILE→WEB]', text: 'GPS location trigger: Arrived at Home Node' },
        { type: 'web', tag: '[WEB→MOBILE]', text: 'Admin web settings applied -> Synced to iOS client' }
    ];

    setInterval(() => {
        if (!isSimulating) return;

        // Randomly pick a sync event
        const randomEvt = simulatedEvents[Math.floor(Math.random() * simulatedEvents.length)];
        addSyncLog(randomEvt.type, randomEvt.tag, randomEvt.text);

        // Fluctuate Latency & Packets
        const latencyVal = document.getElementById('latency-val');
        if (latencyVal) {
            const newLatency = Math.floor(35 + Math.random() * 20);
            latencyVal.textContent = `${newLatency}ms`;
        }

        const ppsVal = document.getElementById('val-sync-pps');
        if (ppsVal) {
            ppsVal.textContent = Math.floor(130 + Math.random() * 35);
        }
    }, 4500);

    // Pause/Resume Simulation Toggle
    btnToggleSim?.addEventListener('click', () => {
        isSimulating = !isSimulating;
        if (isSimulating) {
            simBtnText.textContent = 'Pause Sync Sim';
            btnToggleSim.querySelector('i').className = 'fa-solid fa-pause';
        } else {
            simBtnText.textContent = 'Resume Sync Sim';
            btnToggleSim.querySelector('i').className = 'fa-solid fa-play';
        }
    });

    // -------------------------------------------------------------
    // Pairing Modal Handlers
    // -------------------------------------------------------------
    btnPairDevice?.addEventListener('click', () => pairModal?.classList.add('active'));
    modalCloseBtn?.addEventListener('click', () => pairModal?.classList.remove('active'));
    modalCancelBtn?.addEventListener('click', () => pairModal?.classList.remove('active'));

    modalConfirmBtn?.addEventListener('click', () => {
        const nameInput = document.getElementById('manual-device-name');
        const newName = nameInput.value.trim() || `New Mobile Node #${mobileNodes.length + 1}`;
        
        mobileNodes.push({
            id: `node-m${mobileNodes.length + 1}`,
            name: newName,
            platform: 'Android 14',
            status: 'online',
            syncState: 'Just Paired',
            battery: '100%',
            lastSeen: 'Just now',
            ip: '192.168.1.' + Math.floor(120 + Math.random() * 80),
            icon: 'fa-mobile-screen'
        });

        renderQuickDeviceList();
        renderFullNodesGrid();
        document.getElementById('active-nodes-badge').textContent = mobileNodes.length;
        document.getElementById('val-active-sessions').textContent = mobileNodes.length * 4;

        addSyncLog('web', '[WEB→MOBILE]', `Successfully paired new mobile node: "${newName}"`);
        appendTerminalLine(`[PAIR OK] Device "${newName}" authenticated and registered to sync bus.`, 'system-line');

        nameInput.value = '';
        pairModal?.classList.remove('active');
    });

    // SRS Export Button
    document.getElementById('btn-export-srs')?.addEventListener('click', () => {
        alert('Downloading Software Requirements Specification (srs_document.md)...');
    });

    // -------------------------------------------------------------
    // JSON Studio & Schema Lab Engine
    // -------------------------------------------------------------
    const jsonTemplates = {
        master_project: {
            "$schema": "http://json-schema.org/draft-07/schema#",
            "project_metadata": {
                "name": "JARVIS Cross-Platform AI Assistant",
                "codename": "Stark OS Mark-LXXXV",
                "version": "2.4.0",
                "description": "Cross-platform AI assistant ecosystem connecting mobile clients (iOS/Android) with real-time state synchronization, J.A.R.V.I.S. HUD voice interface, and Web Admin Panel.",
                "created_at": "2026-07-31T11:11:00Z",
                "license": "MIT"
            },
            "environment_configuration": {
                "port": 8080,
                "sync_server_url": "wss://localhost:8080/ws",
                "llm_engines": [
                    { "provider": "Google Gemini API", "env_variable": "GOOGLE_GEMINI_API_KEY", "status": "CONFIGURED_AND_AUTHENTICATED" },
                    { "provider": "Anthropic Claude API", "env_variable": "CLAUDE_API_KEY", "status": "CONFIGURED_AND_AUTHENTICATED" }
                ],
                "encryption": { "algorithm": "AES-256-GCM", "end_to_end": true, "auth_type": "OAuth 2.0 + JWT" }
            },
            "srs_specification": {
                "document_title": "Software Requirements Specification for Jarvis Ecosystem",
                "target_latency_ms": 150,
                "subsystems": [
                    { "name": "Jarvis Mobile Client", "platforms": ["Android 10+", "iOS 15+"] },
                    { "name": "Jarvis Real-Time Sync Engine", "protocol": "WebSocket / gRPC", "latency_ms": 42 },
                    { "name": "Jarvis Web Admin Panel", "features": ["Control Dashboard", "Live Sync Stream", "Mobile Node Manager", "Holographic Voice HUD", "JSON Studio"] }
                ]
            },
            "registered_mobile_nodes": mobileNodes
        },
        system_state: {
            app_name: "Jarvis AI Assistant",
            version: "2.4.0",
            status: "OPERATIONAL",
            security: {
                encryption: "AES-256-GCM",
                e2ee: true,
                auth_type: "OAuth 2.0 + JWT"
            },
            sync_engine: {
                protocol: "WebSocket / WSS",
                average_latency_ms: 42,
                packets_per_sec: 148,
                active_nodes: 3
            },
            ai_core: {
                provider: "Google Gemini API",
                model: "gemini-3.6-flash",
                voice_engine: "Stark Speech Synthesizer"
            }
        },
        mobile_telemetry: {
            nodes: [
                { id: "node-m1", name: "Alex's iPhone 15 Pro", os: "iOS 17.4", battery: "88%", state: "IN_SYNC" },
                { id: "node-m2", name: "Work Pixel 8 Pro", os: "Android 14", battery: "64%", state: "SYNCING" },
                { id: "node-m3", name: "Jarvis Mobile Node #3", os: "Android 13", battery: "95%", state: "IDLE" }
            ]
        },
        srs_summary: {
            project: "Jarvis Cross-Platform Ecosystem",
            document_type: "Software Requirements Specification (SRS)",
            subsystems: ["Mobile Client", "Sync Engine Bus", "Web Admin Panel"],
            target_latency_ms: 150,
            roles: ["Super Administrator", "System Operator", "Mobile Client User"]
        },
        api_config: {
            env: "production",
            port: 8080,
            gemini_api_configured: true,
            sync_bus_url: "wss://localhost:8080/ws",
            max_concurrent_nodes: 10000
        }
    };

    const jsonTextarea = document.getElementById('json-code-textarea');
    const jsonTreeContainer = document.getElementById('json-tree-container');
    const jsonTemplateSelect = document.getElementById('json-template-select');
    const jsonValidationStatus = document.getElementById('json-validation-status');
    const btnFormatJson = document.getElementById('btn-format-json');
    const btnMinifyJson = document.getElementById('btn-minify-json');
    const btnValidateJson = document.getElementById('btn-validate-json');
    const btnDownloadJson = document.getElementById('btn-download-json');
    const btnModeCode = document.getElementById('view-mode-code');
    const btnModeTree = document.getElementById('view-mode-tree');

    function loadJsonTemplate(key) {
        if (!jsonTextarea) return;
        const data = jsonTemplates[key] || jsonTemplates.system_state;
        jsonTextarea.value = JSON.stringify(data, null, 2);
        validateJsonInput();
    }

    function validateJsonInput() {
        if (!jsonTextarea || !jsonValidationStatus) return true;
        try {
            const parsed = JSON.parse(jsonTextarea.value);
            jsonValidationStatus.className = 'json-status-box';
            jsonValidationStatus.innerHTML = '<i class="fa-solid fa-circle-check emerald-text"></i> Valid JSON Payload';
            return parsed;
        } catch (err) {
            jsonValidationStatus.className = 'json-status-box invalid';
            jsonValidationStatus.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> Syntax Error: ${err.message}`;
            return false;
        }
    }

    function renderJsonTree(obj, container) {
        container.innerHTML = '';
        function buildTree(item) {
            const ul = document.createElement('div');
            ul.className = 'tree-node';

            if (typeof item === 'object' && item !== null) {
                for (const key in item) {
                    const val = item[key];
                    const line = document.createElement('div');
                    
                    if (typeof val === 'object' && val !== null) {
                        line.innerHTML = `<span class="tree-key">"${key}"</span>: {`;
                        ul.appendChild(line);
                        ul.appendChild(buildTree(val));
                        const closing = document.createElement('div');
                        closing.innerHTML = '}';
                        ul.appendChild(closing);
                    } else {
                        let valHTML = `<span class="tree-string">"${val}"</span>`;
                        if (typeof val === 'number') valHTML = `<span class="tree-number">${val}</span>`;
                        if (typeof val === 'boolean') valHTML = `<span class="tree-boolean">${val}</span>`;
                        line.innerHTML = `<span class="tree-key">"${key}"</span>: ${valHTML}`;
                        ul.appendChild(line);
                    }
                }
            }
            return ul;
        }
        container.appendChild(buildTree(obj));
    }

    jsonTemplateSelect?.addEventListener('change', (e) => loadJsonTemplate(e.target.value));

    btnFormatJson?.addEventListener('click', () => {
        const parsed = validateJsonInput();
        if (parsed && jsonTextarea) {
            jsonTextarea.value = JSON.stringify(parsed, null, 2);
        }
    });

    btnMinifyJson?.addEventListener('click', () => {
        const parsed = validateJsonInput();
        if (parsed && jsonTextarea) {
            jsonTextarea.value = JSON.stringify(parsed);
        }
    });

    btnValidateJson?.addEventListener('click', () => {
        const parsed = validateJsonInput();
        if (parsed) alert('JSON Syntax is 100% valid!');
    });

    btnDownloadJson?.addEventListener('click', () => {
        const parsed = validateJsonInput();
        if (!parsed) return;

        const blob = new Blob([JSON.stringify(parsed, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `jarvis_schema_${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    });

    btnModeCode?.addEventListener('click', () => {
        btnModeCode.classList.add('active');
        btnModeTree?.classList.remove('active');
        if (jsonTextarea) jsonTextarea.style.display = 'block';
        if (jsonTreeContainer) jsonTreeContainer.style.display = 'none';
    });

    btnModeTree?.addEventListener('click', () => {
        const parsed = validateJsonInput();
        if (!parsed) {
            alert('Fix JSON syntax errors first before switching to Tree View!');
            return;
        }
        btnModeTree.classList.add('active');
        btnModeCode?.classList.remove('active');
        if (jsonTextarea) jsonTextarea.style.display = 'none';
        if (jsonTreeContainer) {
            jsonTreeContainer.style.display = 'block';
            renderJsonTree(parsed, jsonTreeContainer);
        }
    });

    jsonTextarea?.addEventListener('input', validateJsonInput);

    // -------------------------------------------------------------
    // Mobile API Live Tester Handlers
    // -------------------------------------------------------------
    const apiResponseOutput = document.getElementById('mobile-api-response-output');
    const testApiButtons = document.querySelectorAll('.btn-test-api');

    const samplePayloads = {
        '/api/v1/mobile/pair': {
            device_name: "Test Mobile Device (Android 14)",
            platform: "Android 14",
            pairing_pin: "JRV-8942-SYNC"
        },
        '/api/v1/mobile/sync': {
            device_id: "node-m1",
            mutations: [
                { title: "Mobile Calendar Event", status: "PENDING" }
            ],
            last_sync_timestamp: new Date().toISOString()
        },
        '/api/v1/mobile/voice-query': {
            device_id: "node-m1",
            query_text: "Jarvis, what is the status of our mobile nodes?"
        }
    };

    testApiButtons.forEach(btn => {
        btn.addEventListener('click', async () => {
            const url = btn.getAttribute('data-url');
            const method = btn.getAttribute('data-method');

            if (apiResponseOutput) {
                apiResponseOutput.textContent = `// Sending ${method} request to http://localhost:8080${url}...`;
            }

            try {
                const options = {
                    method: method,
                    headers: { 'Content-Type': 'application/json' }
                };

                if (method === 'POST' && samplePayloads[url]) {
                    options.body = JSON.stringify(samplePayloads[url]);
                }

                const res = await fetch(url, options);
                const data = await res.json();

                if (apiResponseOutput) {
                    apiResponseOutput.textContent = `// HTTP ${res.status} OK\n` + JSON.stringify(data, null, 2);
                }

                addSyncLog('mobile', '[MOBILE API]', `Mobile endpoint ${method} ${url} executed successfully`);
            } catch (err) {
                if (apiResponseOutput) {
                    apiResponseOutput.textContent = `// Response Mock (Static Mode):\n` + JSON.stringify({
                        status: 200,
                        endpoint: url,
                        sample_response: samplePayloads[url] || { success: true, message: "Mobile API endpoint ready" }
                    }, null, 2);
                }
            }
        });
    });

    // Load initial JSON template
    loadJsonTemplate('master_project');
});
