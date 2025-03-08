// Dice types configuration
const diceTypes = [
    { id: 'd4', name: 'D4', faces: 4, icon: '<svg viewBox="0 0 100 100"><polygon points="50,10 90,80 10,80" stroke="white" stroke-width="2" /></svg>' },
    { id: 'd6', name: 'D6', faces: 6, icon: '<svg viewBox="0 0 100 100"><rect x="15" y="15" width="70" height="70" stroke="white" stroke-width="2" /></svg>' },
    { id: 'd8', name: 'D8', faces: 8, icon: '<svg viewBox="0 0 100 100"><polygon points="50,10 90,50 50,90 10,50" stroke="white" stroke-width="2" /></svg>' },
    { id: 'd10', name: 'D10', faces: 10, icon: '<svg viewBox="0 0 100 100"><polygon points="50,10 90,30 90,70 50,90 10,70 10,30" stroke="white" stroke-width="2" /></svg>' },
    { id: 'd12', name: 'D12', faces: 12, icon: '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" stroke="white" stroke-width="2" /><text x="50" y="55" text-anchor="middle" font-size="20" fill="white">12</text></svg>' },
    { id: 'd20', name: 'D20', faces: 20, icon: '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" stroke="white" stroke-width="2" /><text x="50" y="55" text-anchor="middle" font-size="20" fill="white">20</text></svg>' },
    { id: 'd100', name: 'D100', faces: 100, icon: '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" stroke="white" stroke-width="2" /><text x="50" y="55" text-anchor="middle" font-size="16" fill="white">100</text></svg>' }
];

// Audio elements
const diceSound = new Audio();
diceSound.src = 'data:audio/mpeg;base64,SUQzBAAAAAABEVRYWFgAAAAtAAADY29tbWVudABCaWdTb3VuZEJhbmsuY29tIC8gQ29uZXB0aW9uU29ub3JlLmNvbQBURU5DAAAAHQAAA1N3aXRjaCBQbHVzIMKpIE5DSCBTb2Z0d2FyZQBUSVQyAAAABgAAAzIyK20AVFBFMQAAAAcAAANNYXRyb3MAVFlFUgAAAAYAAAMyMDEzAFRDT04AAAAcAAADU0ZYIC0gQ2luZW1hdGljIC0gU3BvcnRzAENPTU0AAAAWAAADRW5naW5lZXIAWENkb3RGbHV4AAA=';

const successSound = new Audio();
successSound.src = 'data:audio/mpeg;base64,SUQzBAAAAAABEVRYWFgAAAAtAAADY29tbWVudABCaWdTb3VuZEJhbmsuY29tIC8gQ29uZXB0aW9uU29ub3JlLmNvbQBURU5DAAAAHQAAA1N3aXRjaCBQbHVzIMKpIE5DSCBTb2Z0d2FyZQBUSVQyAAAABgAAAzIyK20AVFBFMQAAAAcAAANNYXRyb3MAVFlFUgAAAAYAAAMyMDEzAFRDT04AAAAcAAADU0ZYIC0gQ2luZW1hdGljIC0gU3BvcnRzAENPTU0AAAAWAAADRW5naW5lZXIAWENkb3RGbHV4AAA=';

// DOM Elements
const diceContainer = document.getElementById('diceContainer');
const rollBtn = document.getElementById('rollBtn');
const resetBtn = document.getElementById('resetBtn');
const rollArea = document.getElementById('rollArea');
const rollPlaceholder = document.getElementById('rollPlaceholder');
const rollInfo = document.getElementById('rollInfo');
const rollDetails = document.getElementById('rollDetails');
const rollTotal = document.getElementById('rollTotal');
const resultTiming = document.getElementById('resultTiming');
const historyList = document.getElementById('historyList');
const historyPlaceholder = document.getElementById('historyPlaceholder');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');
const toastContainer = document.getElementById('toastContainer');
const soundToggle = document.getElementById('soundToggle');
const themeToggle = document.getElementById('themeToggle');
const settingsBtn = document.getElementById('settingsBtn');
const settingsModal = document.getElementById('settingsModal');
const settingsCloseBtn = document.getElementById('settingsCloseBtn');
const soundEffectsToggle = document.getElementById('soundEffectsToggle');
const volumeControl = document.getElementById('volumeControl');
const darkModeToggle = document.getElementById('darkModeToggle');
const animationsToggle = document.getElementById('animationsToggle');
const highContrastToggle = document.getElementById('highContrastToggle');
const helpBtn = document.getElementById('helpBtn');
const expectedValueContainer = document.getElementById('expectedValueContainer');
const expectedValueContent = document.getElementById('expectedValueContent');
const expectedValuePlaceholder = document.getElementById('expectedValuePlaceholder');
const historyContainer = document.getElementById('historyContainer');
const historyToggleBtn = document.getElementById('historyToggleBtn');
const closeHistoryBtn = document.getElementById('closeHistoryBtn');

// App State
let appState = {
    selectedDice: {},
    soundEnabled: true,
    volume: 0.5,
    darkMode: true,
    animationsEnabled: true,
    highContrast: false,
    history: []
};

// Load saved state from localStorage
function loadSavedState() {
    const savedState = localStorage.getItem('diceRollerState');
    if (savedState) {
        try {
            const parsedState = JSON.parse(savedState);
            appState = { ...appState, ...parsedState };
            
            // Update UI based on saved state
            soundEffectsToggle.checked = appState.soundEnabled;
            volumeControl.value = appState.volume;
            darkModeToggle.checked = appState.darkMode;
            animationsToggle.checked = appState.animationsEnabled;
            highContrastToggle.checked = appState.highContrast;
            
            // Apply theme
            applyTheme();
            
            // Update sound icon
            updateSoundIcon();
            
            // Load history
            renderHistory();
        } catch (e) {
            console.error('Error loading saved state:', e);
            showToast('前回の設定を読み込めませんでした', '⚠️');
        }
    }
}

// Save current state to localStorage
function saveState() {
    try {
        localStorage.setItem('diceRollerState', JSON.stringify(appState));
    } catch (e) {
        console.error('Error saving state:', e);
    }
}

// Initialize dice cards
function initDiceCards() {
    diceTypes.forEach(dice => {
        const diceCard = document.createElement('div');
        diceCard.className = 'dice-card';
        diceCard.dataset.type = dice.id;
        
        diceCard.innerHTML = `
            <div class="dice-icon">${dice.icon}</div>
            <div class="dice-name">${dice.name}</div>
            <div class="dice-controls">
                <button class="dice-btn dice-decrease tooltip" data-type="${dice.id}">
                    <span class="tooltip-text">減らす</span>
                    -
                </button>
                <input type="number" class="dice-count" id="${dice.id}-count" value="0" min="0" max="20">
                <button class="dice-btn dice-increase tooltip" data-type="${dice.id}">
                    <span class="tooltip-text">増やす</span>
                    +
                </button>
            </div>
        `;
        
        diceContainer.appendChild(diceCard);
        
        // Set initial value from saved state if exists
        if (appState.selectedDice[dice.id]) {
            document.getElementById(`${dice.id}-count`).value = appState.selectedDice[dice.id];
        }
    });
    
    // Add event listeners to dice controls
    document.querySelectorAll('.dice-decrease').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const type = e.target.dataset.type;
            decreaseDiceCount(type);
            addRippleEffect(e);
        });
    });
    
    document.querySelectorAll('.dice-increase').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const type = e.target.dataset.type;
            increaseDiceCount(type);
            addRippleEffect(e);
        });
    });
    
    // Add event listeners to dice count inputs
    document.querySelectorAll('.dice-count').forEach(input => {
        input.addEventListener('change', (e) => {
            const type = e.target.id.split('-')[0];
            const count = parseInt(e.target.value) || 0;
            
            // Ensure count is between 0 and 20
            e.target.value = Math.min(Math.max(count, 0), 20);
            
            // Update state
            appState.selectedDice[type] = parseInt(e.target.value);
            saveState();
            
            // Update UI
            updateRollButtonState();
            
            // Update expected value
            updateExpectedValue();
        });
    });
}

// Decrease dice count
function decreaseDiceCount(type) {
    const countInput = document.getElementById(`${type}-count`);
    let count = parseInt(countInput.value) || 0;
    count = Math.max(count - 1, 0);
    countInput.value = count;
    
    // Update state
    appState.selectedDice[type] = count;
    saveState();
    
    // Update UI
    updateRollButtonState();
    
    // Update expected value
    updateExpectedValue();
}

// Increase dice count
function increaseDiceCount(type) {
    const countInput = document.getElementById(`${type}-count`);
    let count = parseInt(countInput.value) || 0;
    count = Math.min(count + 1, 20);
    countInput.value = count;
    
    // Update state
    appState.selectedDice[type] = count;
    saveState();
    
    // Update UI
    updateRollButtonState();
    
    // Update expected value
    updateExpectedValue();
}

// Update roll button state
function updateRollButtonState() {
    const hasDice = Object.values(appState.selectedDice).some(count => count > 0);
    rollBtn.disabled = !hasDice;
    rollBtn.style.opacity = hasDice ? '1' : '0.5';
}

// Roll dice
function rollDice() {
    // Check if any dice are selected
    const hasDice = Object.values(appState.selectedDice).some(count => count > 0);
    if (!hasDice) {
        showToast('ダイスを選択してください', '⚠️');
        return;
    }
    
    // Clear previous results
    rollArea.innerHTML = '';
    rollPlaceholder.style.display = 'none';
    
    // Play sound
    if (appState.soundEnabled) {
        diceSound.volume = appState.volume;
        diceSound.currentTime = 0;
        diceSound.play();
    }
    
    // Prepare results data
    const results = [];
    let totalSum = 0;
    
    // Add timestamp
    const now = new Date();
    const timeString = now.toLocaleTimeString();
    resultTiming.textContent = `${timeString}`;
    
    // Loop through selected dice
    for (const [type, count] of Object.entries(appState.selectedDice)) {
        if (count > 0) {
            const diceType = diceTypes.find(d => d.id === type);
            
            for (let i = 0; i < count; i++) {
                // Generate random result
                const result = Math.floor(Math.random() * diceType.faces) + 1;
                totalSum += result;
                
                // Add to results array
                results.push({
                    type: type,
                    faces: diceType.faces,
                    result: result
                });
                
                // Create dice result element with 3D effect
                const diceResult = document.createElement('div');
                diceResult.className = 'dice-result';
                
                const dice3d = document.createElement('div');
                dice3d.className = `dice-3d rolling`;
                
                const diceFace = document.createElement('div');
                diceFace.className = `dice-face ${type}`;
                diceFace.textContent = result;
                
                const diceLabel = document.createElement('div');
                diceLabel.className = 'dice-label';
                diceLabel.textContent = diceType.name;
                
                dice3d.appendChild(diceFace);
                diceResult.appendChild(dice3d);
                diceResult.appendChild(diceLabel);
                rollArea.appendChild(diceResult);
                
                // Add animation end event
                dice3d.addEventListener('animationend', () => {
                    dice3d.classList.remove('rolling');
                    if (result === diceType.faces && appState.animationsEnabled) {
                        createConfetti(diceResult);
                    }
                });
            }
        }
    }
    
    // Show roll details and total
    rollInfo.style.display = 'block';
    
    // Format roll details
    rollDetails.innerHTML = '';
    let detailsHTML = '';
    
    // Group by dice type
    const groupedResults = {};
    results.forEach(result => {
        if (!groupedResults[result.type]) {
            groupedResults[result.type] = [];
        }
        groupedResults[result.type].push(result.result);
    });
    
    // Create detail spans
    for (const [type, values] of Object.entries(groupedResults)) {
        const diceType = diceTypes.find(d => d.id === type);
        const sum = values.reduce((a, b) => a + b, 0);
        const detail = document.createElement('span');
        detail.className = 'roll-detail';
        detail.textContent = `${diceType.name} (${values.join(', ')}) = ${sum}`;
        rollDetails.appendChild(detail);
    }
    
    // Show total
    rollTotal.textContent = `合計: ${totalSum}`;
    
    // Add to history
    const historyItem = {
        time: timeString,
        date: now.toLocaleDateString(),
        results: results,
        total: totalSum,
        selectedDice: { ...appState.selectedDice }
    };
    
    appState.history.unshift(historyItem);
    
    // Limit history to 50 items
    if (appState.history.length > 50) {
        appState.history.pop();
    }
    
    // Save state
    saveState();
    
    // Update history UI
    renderHistory();
    
    // Play success sound
    if (appState.soundEnabled) {
        setTimeout(() => {
            successSound.volume = appState.volume;
            successSound.currentTime = 0;
            successSound.play();
        }, 1500);
    }
}

// Create confetti effect
function createConfetti(element) {
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
    
    for (let i = 0; i < 30; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.width = Math.random() * 10 + 5 + 'px';
        confetti.style.height = Math.random() * 10 + 5 + 'px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDuration = Math.random() * 3 + 2 + 's';
        
        element.appendChild(confetti);
        
        // Remove confetti after animation
        setTimeout(() => {
            confetti.remove();
        }, 5000);
    }
}

// Add ripple effect
function addRippleEffect(e) {
    const button = e.currentTarget;
    
    if (!appState.animationsEnabled) return;
    
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
    ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
    
    button.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 800);
}

// Reset all dice
function resetDice() {
    // Reset all dice counts
    diceTypes.forEach(dice => {
        document.getElementById(`${dice.id}-count`).value = 0;
        appState.selectedDice[dice.id] = 0;
    });
    
    // Clear results
    rollArea.innerHTML = '';
    rollPlaceholder.style.display = 'block';
    rollInfo.style.display = 'none';
    
    // Update UI
    updateRollButtonState();
    
    // Update expected value
    updateExpectedValue();
    
    // Save state
    saveState();
    
    // Show toast
    showToast('ダイスがリセットされました', '🔄');
}

// Render history
function renderHistory() {
    if (appState.history.length === 0) {
        historyList.innerHTML = '<div id="historyPlaceholder">ダイスをロールすると、ここに履歴が表示されます</div>';
        return;
    }
    
    historyList.innerHTML = '';
    
    appState.history.forEach((item, index) => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        
        const historyTime = document.createElement('div');
        historyTime.className = 'history-item-time';
        historyTime.textContent = `${item.date} ${item.time}`;
        
        const historyDetails = document.createElement('div');
        historyDetails.className = 'history-item-details';
        
        // Group by dice type
        const groupedResults = {};
        item.results.forEach(result => {
            if (!groupedResults[result.type]) {
                groupedResults[result.type] = [];
            }
            groupedResults[result.type].push(result.result);
        });
        
        // Create detail spans
        for (const [type, values] of Object.entries(groupedResults)) {
            const diceType = diceTypes.find(d => d.id === type);
            const detail = document.createElement('span');
            detail.className = 'roll-detail';
            detail.textContent = `${diceType.name}×${values.length}`;
            historyDetails.appendChild(detail);
        }
        
        const historyResult = document.createElement('div');
        historyResult.className = 'history-item-result';
        historyResult.textContent = `結果: ${item.total}`;
        
        historyItem.appendChild(historyTime);
        historyItem.appendChild(historyDetails);
        historyItem.appendChild(historyResult);
        
        // Add click event to reroll
        historyItem.addEventListener('click', () => {
            // Set dice counts from history
            for (const [type, count] of Object.entries(item.selectedDice)) {
                document.getElementById(`${type}-count`).value = count;
                appState.selectedDice[type] = count;
            }
            
            // Update UI
            updateRollButtonState();
            
            // Save state
            saveState();
            
            // Show toast
            showToast('過去のロール設定を読み込みました', '🔄');
            
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        
        historyList.appendChild(historyItem);
    });
}

// Clear history
function clearHistory() {
    appState.history = [];
    saveState();
    renderHistory();
    showToast('履歴がクリアされました', '🗑️');
}

// Show toast notification
function showToast(message, icon = '🎲') {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
        <div class="toast-icon">${icon}</div>
        <div class="toast-message">${message}</div>
    `;
    
    toastContainer.appendChild(toast);
    
    // Show the toast
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // Remove the toast after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

// Toggle sound
function toggleSound() {
    appState.soundEnabled = !appState.soundEnabled;
    saveState();
    updateSoundIcon();
    showToast(`サウンドが${appState.soundEnabled ? 'オン' : 'オフ'}になりました`, appState.soundEnabled ? '🔊' : '🔇');
}

// Update sound icon
function updateSoundIcon() {
    soundToggle.textContent = appState.soundEnabled ? '🔊' : '🔇';
}

// Toggle dark mode
function toggleDarkMode() {
    appState.darkMode = !appState.darkMode;
    saveState();
    applyTheme();
    showToast(`${appState.darkMode ? 'ダーク' : 'ライト'}モードに切り替えました`, appState.darkMode ? '🌙' : '☀️');
}

// Apply theme based on current state
function applyTheme() {
    const root = document.documentElement;
    
    if (appState.darkMode) {
        // Dark theme
        root.style.setProperty('--background', '#121212');
        root.style.setProperty('--surface', '#1e1e1e');
        root.style.setProperty('--on-background', '#ffffff');
        root.style.setProperty('--on-surface', '#ffffff');
        themeToggle.textContent = '🌙';
    } else {
        // Light theme
        root.style.setProperty('--background', '#f5f5f5');
        root.style.setProperty('--surface', '#ffffff');
        root.style.setProperty('--on-background', '#000000');
        root.style.setProperty('--on-surface', '#000000');
        themeToggle.textContent = '☀️';
    }
    
    if (appState.highContrast) {
        // High contrast theme
        root.style.setProperty('--primary-color', '#ff0000');
        root.style.setProperty('--primary-dark', '#c50000');
        root.style.setProperty('--primary-light', '#ff5252');
    } else {
        // Normal contrast
        root.style.setProperty('--primary-color', '#6200ee');
        root.style.setProperty('--primary-dark', '#3700b3');
        root.style.setProperty('--primary-light', '#bb86fc');
    }
}

// Open settings modal
function openSettings() {
    settingsModal.classList.add('active');
}

// Close settings modal
function closeSettings() {
    settingsModal.classList.remove('active');
}

// Save settings
function saveSettings() {
    appState.soundEnabled = soundEffectsToggle.checked;
    appState.volume = parseFloat(volumeControl.value);
    appState.darkMode = darkModeToggle.checked;
    appState.animationsEnabled = animationsToggle.checked;
    appState.highContrast = highContrastToggle.checked;
    
    // Apply settings
    updateSoundIcon();
    applyTheme();
    
    // Save state
    saveState();
    
    // Show toast
    showToast('設定が保存されました', '⚙️');
}

// Show help
function showHelp() {
    // Create modal HTML
    const helpModalHTML = `
    <div class="modal-overlay active" id="helpModal">
        <div class="modal">
            <div class="modal-header">
                <div class="modal-title">ヘルプ</div>
                <button class="modal-close" id="helpCloseBtn">&times;</button>
            </div>
            <div class="modal-body">
                <h3>TRPGダイスローラーの使い方</h3>
                <p>このアプリは、テーブルトークRPG（TRPG）セッションで使用するダイスをデジタルに振るためのツールです。</p>
                
                <h4>基本機能</h4>
                <ul>
                    <li>各ダイスの横にある「+」「-」ボタンでダイスの数を調整できます</li>
                    <li>「ダイスを振る」ボタンでダイスをロールします</li>
                    <li>「リセット」ボタンですべてのダイスを0にリセットします</li>
                    <li>ロール結果は画面中央に表示され、各ダイスの出目と合計が確認できます</li>
                    <li>過去のロール履歴は下部に保存され、クリックすると同じ設定で再度ロールできます</li>
                </ul>
                
                <h4>設定</h4>
                <ul>
                    <li>サウンド：ダイスを振るときの効果音のオン/オフを切り替えます</li>
                    <li>ダークモード：画面の明るさを切り替えます</li>
                    <li>アニメーション：ダイスロール時のアニメーション効果を切り替えます</li>
                    <li>高コントラストモード：色のコントラストを高めて視認性を向上させます</li>
                </ul>
            </div>
        </div>
    </div>
    `;
    
    // Append to body
    document.body.insertAdjacentHTML('beforeend', helpModalHTML);
    
    // Add event listener to close button
    document.getElementById('helpCloseBtn').addEventListener('click', () => {
        document.getElementById('helpModal').remove();
    });
    
    // Add event listener to close when clicking outside
    document.getElementById('helpModal').addEventListener('click', (e) => {
        if (e.target.id === 'helpModal') {
            document.getElementById('helpModal').remove();
        }
    });
}

// 履歴表示切り替え
// 履歴を表示する
function showHistory() {
    historyContainer.style.display = 'block';
    renderHistory(); // 履歴を最新の状態に更新
    historyToggleBtn.style.display = 'none';
}

// 履歴を非表示にする
function hideHistory() {
    historyContainer.style.display = 'none';
    historyToggleBtn.style.display = 'block';
}

// Event listeners
rollBtn.addEventListener('click', (e) => {
    rollDice();
    addRippleEffect(e);
});

resetBtn.addEventListener('click', (e) => {
    resetDice();
    addRippleEffect(e);
});

clearHistoryBtn.addEventListener('click', clearHistory);
soundToggle.addEventListener('click', toggleSound);
themeToggle.addEventListener('click', toggleDarkMode);
settingsBtn.addEventListener('click', (e) => {
    e.preventDefault();
    openSettings();
});

settingsCloseBtn.addEventListener('click', closeSettings);

// Close settings when clicking outside the modal
settingsModal.addEventListener('click', (e) => {
    if (e.target === settingsModal) {
        closeSettings();
    }
});

// Settings change events
soundEffectsToggle.addEventListener('change', saveSettings);
volumeControl.addEventListener('change', saveSettings);
darkModeToggle.addEventListener('change', saveSettings);
animationsToggle.addEventListener('change', saveSettings);
highContrastToggle.addEventListener('change', saveSettings);

historyToggleBtn.addEventListener('click', showHistory);
closeHistoryBtn.addEventListener('click', hideHistory);

helpBtn.addEventListener('click', (e) => {
    e.preventDefault();
    showHelp();
});

// 期待値計算関数
// 期待値を計算する関数
function calculateExpectedValue() {
    let totalExpectedValue = 0;
    let minValue = 0;
    let maxValue = 0;
    let totalCombinations = 1;
    let diceCount = 0;
    
    // 各ダイスの期待値を計算
    for (const [type, count] of Object.entries(appState.selectedDice)) {
        if (count > 0) {
            const diceType = diceTypes.find(d => d.id === type);
            
            // 単一ダイスの期待値 = (最小値 + 最大値) / 2
            const singleDiceExpectedValue = (1 + diceType.faces) / 2;
            
            // ダイスの数を掛ける
            const diceTypeExpectedValue = singleDiceExpectedValue * count;
            
            totalExpectedValue += diceTypeExpectedValue;
            minValue += 1 * count; // 各ダイスの最小値は1
            maxValue += diceType.faces * count; // 各ダイスの最大値
            diceCount += count;
            
            // 組み合わせ数の計算（各ダイスの面数の違いがある場合のため、簡略化）
            totalCombinations *= Math.pow(diceType.faces, count);
        }
    }
    
    // 標準偏差の計算（簡略化、正確な算出には各ダイスごとの標準偏差を考慮する必要があり）
    // ダイスのバラツキを表す指標として使用
    const variance = (Math.pow(maxValue - minValue, 2) / 12) * Math.sqrt(diceCount);
    const standardDeviation = Math.sqrt(variance);
    
    return {
        expectedValue: totalExpectedValue,
        minValue: minValue,
        maxValue: maxValue,
        standardDeviation: standardDeviation,
        totalCombinations: totalCombinations,
        diceCount: diceCount
    };
}

// 期待値情報を更新する関数
function updateExpectedValue() {
    // ダイスが選択されているかチェック
    const hasDice = Object.values(appState.selectedDice).some(count => count > 0);
    
    if (!hasDice) {
        // ダイスが選択されていない場合はプレースホルダーを表示
        expectedValueContent.innerHTML = '<div id="expectedValuePlaceholder">ダイスを選ぶと期待値情報が表示されます</div>';
        return;
    }
    
    // 期待値を計算
    const expectedValueData = calculateExpectedValue();
    
    // 小数点以下、1位までに丸める
    const formattedExpectedValue = expectedValueData.expectedValue.toFixed(1);
    const formattedStdDev = expectedValueData.standardDeviation.toFixed(1);
    
    // HTMLを生成
    expectedValueContent.innerHTML = `
        <div class="expected-value-item">
            <div class="expected-value-label">期待値</div>
            <div class="expected-value-number">${formattedExpectedValue}</div>
            <div class="expected-value-details">最小: ${expectedValueData.minValue} / 最大: ${expectedValueData.maxValue}</div>
        </div>
        <div class="expected-value-item">
            <div class="expected-value-label">標準偏差</div>
            <div class="expected-value-number">±${formattedStdDev}</div>
            <div class="expected-value-details">約 ${Math.round((expectedValueData.expectedValue - expectedValueData.standardDeviation) * 10) / 10} ～ ${Math.round((expectedValueData.expectedValue + expectedValueData.standardDeviation) * 10) / 10} の範囲に約68%の確率で収まります</div>
        </div>
    `;
}

// Initialize the app
function initApp() {
    loadSavedState();
    initDiceCards();
    updateRollButtonState();
    updateExpectedValue();
    
    // 初期状態では履歴を非表示に
    historyContainer.style.display = 'none';
    historyToggleBtn.style.display = 'block';
}

// Start the app when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);
