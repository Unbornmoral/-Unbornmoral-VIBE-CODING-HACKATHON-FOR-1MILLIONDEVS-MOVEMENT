// Smart Income & Expense Tracker JS

document.addEventListener('DOMContentLoaded', function() {
    let transactions = [];

    // DOM elements
    const incomeTotal = document.getElementById('income-total');
    const expenseTotal = document.getElementById('expense-total');
    const profitTotal = document.getElementById('profit-total');
    const transactionList = document.getElementById('transaction-list');
    const photoInput = document.getElementById('photo-input');
    const voiceBtn = document.getElementById('voice-btn');

    // Mock AI extraction for photo (simulate with random data)
    photoInput.addEventListener('change', function(e) {
        if (e.target.files.length > 0) {
            // Simulate AI extraction
            const amount = (Math.random() * 100).toFixed(2);
            const type = Math.random() > 0.5 ? 'income' : 'expense';
            const desc = 'Photo input';
            addTransaction({ amount: parseFloat(amount), type, desc });
        }
    });

    // Voice input using Web Speech API
    voiceBtn.addEventListener('click', function() {
        if (!('webkitSpeechRecognition' in window)) {
            alert('Voice input not supported in this browser.');
            return;
        }
        voiceBtn.textContent = 'Listening...';
        const recognition = new webkitSpeechRecognition();
        recognition.lang = 'en-US';
        recognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript;
            // Simple parsing: look for "income" or "expense" and a number
            let type = 'expense';
            if (/income|sale|sold|received/i.test(transcript)) type = 'income';
            const amountMatch = transcript.match(/\d+(\.\d{1,2})?/);
            const amount = amountMatch ? parseFloat(amountMatch[0]) : (Math.random() * 100).toFixed(2);
            addTransaction({ amount: parseFloat(amount), type, desc: transcript });
            voiceBtn.textContent = 'Add by Voice';
        };
        recognition.onerror = function() {
            voiceBtn.textContent = 'Add by Voice';
            alert('Could not recognize speech. Try again.');
        };
        recognition.start();
    });

    // Static price list for common commodities (USD, can be expanded)
    const staticPrices = {
        burger: [4.99, 5.49, 6.25],
        pizza: [8.99, 10.99, 12.99],
        fries: [2.49, 2.99, 3.49],
        coffee: [1.99, 2.49, 3.25],
        juice: [2.99, 3.49, 4.00],
        cake: [3.99, 4.99, 5.99],
        salad: [5.99, 6.99, 7.99],
        chicken: [6.99, 8.49, 9.99],
        fish: [7.99, 9.49, 11.00],
        rice: [1.99, 2.49, 2.99],
        bread: [2.49, 3.00, 3.50],
        steak: [12.99, 15.99, 18.99],
        egg: [0.99, 1.49, 1.99],
        apple: [0.79, 0.99, 1.29],
        banana: [0.39, 0.59, 0.79],
        beer: [3.99, 4.99, 5.99],
        wine: [9.99, 14.99, 19.99],
        car: [20000, 25000, 30000],
        fuel: [3.50, 4.00, 4.50],
        book: [9.99, 14.99, 19.99],
        clothes: [19.99, 29.99, 49.99],
        phone: [299, 499, 799],
        laptop: [499, 799, 1299],
        rent: [800, 1200, 2000],
        electric: [40, 60, 100],
        water: [20, 30, 50],
        gift: [10, 25, 50],
        salary: [1000, 2000, 3000],
        sale: [10, 20, 30],
        milk: [1.49, 2.09, 2.99],
        cheese: [2.99, 4.99, 7.99],
        orange: [0.89, 1.09, 1.29],
        grapes: [2.99, 3.99, 4.99],
        chocolate: [1.49, 2.49, 3.49],
        soap: [0.99, 1.49, 2.49],
        shampoo: [3.99, 5.99, 7.99],
        toothpaste: [1.99, 2.99, 3.99],
        pen: [0.49, 0.99, 1.49],
        pencil: [0.29, 0.59, 0.99],
        notebook: [1.99, 2.99, 4.99],
        shoes: [29.99, 49.99, 89.99],
        bag: [14.99, 29.99, 59.99],
        watch: [19.99, 49.99, 99.99],
        headphones: [9.99, 19.99, 49.99],
        tv: [199.99, 299.99, 499.99],
        bread: [2.49, 3.00, 3.50],
        butter: [1.99, 2.49, 3.49],
        sugar: [1.49, 2.49, 3.49],
        salt: [0.99, 1.49, 2.49],
        oil: [3.99, 5.99, 7.99],
        chicken_breast: [4.99, 6.99, 8.99],
        beef: [7.99, 10.99, 14.99],
        fish_fillet: [6.99, 9.99, 13.99],
        potato: [0.99, 1.49, 2.49],
        tomato: [1.29, 1.99, 2.99],
        onion: [0.89, 1.29, 1.99],
        lettuce: [1.49, 2.49, 3.49],
        cucumber: [0.99, 1.49, 2.49],
        carrot: [0.79, 1.29, 1.99],
        broccoli: [1.99, 2.99, 3.99],
        spinach: [1.49, 2.49, 3.49],
        corn: [1.29, 1.99, 2.99],
        peas: [1.49, 2.49, 3.49],
        beans: [1.99, 2.99, 4.99],
        yogurt: [0.99, 1.49, 2.49],
        ice_cream: [2.99, 4.99, 6.99],
        chips: [1.49, 2.49, 3.49],
        soda: [0.99, 1.49, 2.49],
        water_bottle: [0.49, 0.99, 1.49],
        tea: [1.99, 2.99, 3.99],
        honey: [3.99, 5.99, 7.99],
        jam: [2.49, 3.49, 4.99],
        peanut_butter: [2.99, 4.49, 5.99],
        cereal: [2.99, 4.99, 6.99],
        oats: [1.99, 2.99, 3.99],
        pasta: [1.49, 2.49, 3.49],
        noodles: [1.29, 1.99, 2.99],
        sauce: [1.99, 2.99, 3.99],
        ketchup: [1.49, 2.49, 3.49],
        mayonnaise: [1.99, 2.99, 3.99],
        mustard: [1.49, 2.49, 3.49],
        vinegar: [1.29, 1.99, 2.99],
        olive_oil: [4.99, 6.99, 9.99],
        sunflower_oil: [3.99, 5.99, 7.99],
        coconut_oil: [4.99, 6.99, 8.99]
    };

    // Helper to get static prices by description
    function getStaticPrices(desc) {
        desc = desc.toLowerCase();
        for (const key in staticPrices) {
            if (desc.includes(key)) {
                return staticPrices[key];
            }
        }
        return null;
    }

    // Manual transaction input form logic (now supports multiple prices)
    const manualForm = document.getElementById('manual-form');
    const manualDesc = document.getElementById('manual-desc');
    const manualPrices = document.getElementById('manual-prices');
    const manualType = document.getElementById('manual-type');

    manualDesc.addEventListener('blur', function() {
        // Auto-suggest prices if found in static list
        const prices = getStaticPrices(manualDesc.value);
        if (prices) {
            manualPrices.value = prices.join(', ');
        }
    });

    manualForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const desc = manualDesc.value.trim();
        let prices = manualPrices.value.split(',').map(p => parseFloat(p.trim())).filter(p => !isNaN(p));
        const type = manualType.value;
        if ((!prices.length || manualPrices.value.trim() === '') && desc) {
            const staticP = getStaticPrices(desc);
            if (staticP) prices = staticP;
        }
        if (prices.length > 0 && desc) {
            addTransaction({ prices, type, desc });
            manualForm.reset();
            playAddSound();
        }
    });

    function addTransaction({ prices, type, desc, amount }) {
        // Support both old (amount) and new (prices) format for backward compatibility
        if (prices && Array.isArray(prices)) {
            transactions.push({ prices, type, desc });
        } else {
            transactions.push({ amount, type, desc });
        }
        updateDashboard();
        renderTransactions();
        localStorage.setItem('transactions', JSON.stringify(transactions));
    }

    function updateDashboard() {
        // Sum all selected prices or amounts
        let income = 0, expense = 0;
        transactions.forEach(t => {
            let amt = 0;
            if (t.prices && Array.isArray(t.prices)) {
                amt = t.selectedPrice !== undefined ? t.prices[t.selectedPrice] : t.prices[0];
            } else {
                amt = t.amount;
            }
            if (t.type === 'income') income += amt;
            if (t.type === 'expense') expense += amt;
        });
        incomeTotal.textContent = `$${income.toFixed(2)}`;
        expenseTotal.textContent = `$${expense.toFixed(2)}`;
        profitTotal.textContent = `$${(income - expense).toFixed(2)}`;
    }

    function getEmoji(desc) {
        // Simple keyword-to-emoji mapping
        const map = [
            { re: /burger|hamburger|cheeseburger/i, emoji: '🍔' },
            { re: /pizza/i, emoji: '🍕' },
            { re: /fries|chips/i, emoji: '🍟' },
            { re: /coffee|latte|espresso/i, emoji: '☕' },
            { re: /drink|juice|soda|cola/i, emoji: '🥤' },
            { re: /cake|dessert/i, emoji: '🍰' },
            { re: /salad/i, emoji: '🥗' },
            { re: /chicken/i, emoji: '🍗' },
            { re: /fish|seafood/i, emoji: '🐟' },
            { re: /rice/i, emoji: '🍚' },
            { re: /bread|sandwich/i, emoji: '🥪' },
            { re: /meat|steak/i, emoji: '🥩' },
            { re: /egg/i, emoji: '🥚' },
            { re: /fruit|apple|banana|orange|grape|berry/i, emoji: '🍎' },
            { re: /ice cream/i, emoji: '🍦' },
            { re: /beer/i, emoji: '🍺' },
            { re: /wine/i, emoji: '🍷' },
            { re: /car/i, emoji: '🚗' },
            { re: /fuel|gas/i, emoji: '⛽' },
            { re: /book/i, emoji: '📚' },
            { re: /clothes|shirt|dress|jeans/i, emoji: '👕' },
            { re: /phone|mobile/i, emoji: '📱' },
            { re: /laptop|computer/i, emoji: '💻' },
            { re: /rent|house|home/i, emoji: '🏠' },
            { re: /electric|power|light/i, emoji: '💡' },
            { re: /water/i, emoji: '💧' },
            { re: /gift/i, emoji: '🎁' },
            { re: /salary|pay/i, emoji: '💵' },
            { re: /sale|sold/i, emoji: '🛒' },
            { re: /default/i, emoji: '📝' }
        ];
        for (const item of map) {
            if (item.re.test(desc)) return item.emoji;
        }
        return '📝'; // default emoji
    }

    // Audio cue for adding a transaction
    function playAddSound() {
        const audio = new Audio('https://cdn.pixabay.com/audio/2022/03/15/audio_115b9bfae2.mp3');
        audio.volume = 0.2;
        audio.play();
    }

    // Audio cue for deleting a transaction
    function playDeleteSound() {
        const audio = new Audio('https://cdn.pixabay.com/audio/2022/03/15/audio_115b9bfae2.mp3');
        audio.volume = 0.15;
        audio.play();
    }

    function renderTransactions() {
        transactionList.innerHTML = '';
        transactions.slice().reverse().forEach((t, idx) => {
            const li = document.createElement('li');
            let priceDisplay = '';
            if (t.prices && Array.isArray(t.prices)) {
                priceDisplay = t.prices.map((p, i) => {
                    const isSelected = t.selectedPrice === i || (t.selectedPrice === undefined && i === 0);
                    return `<span class="price-option" data-idx="${transactions.length - 1 - idx}" data-price="${i}" style="cursor:pointer;${isSelected ? 'text-decoration:underline;font-weight:bold;' : ''}">$${p.toFixed(2)}</span>`;
                }).join(' / ');
            } else {
                priceDisplay = `$${t.amount.toFixed(2)}`;
            }
            // Add emoji based on description
            const emoji = getEmoji(t.desc);
            li.innerHTML = `${emoji} ${t.type === 'income' ? '+' : '-'}${priceDisplay} — ${t.desc}`;
            li.style.color = t.type === 'income' ? 'green' : 'red';
            // Add delete button
            const delBtn = document.createElement('button');
            delBtn.textContent = '🗑️';
            delBtn.setAttribute('aria-label', 'Delete transaction');
            delBtn.style.marginLeft = '10px';
            delBtn.style.background = 'transparent';
            delBtn.style.border = 'none';
            delBtn.style.cursor = 'pointer';
            delBtn.style.color = '#D3D3D3';
            delBtn.onclick = () => {
                transactions.splice(transactions.length - 1 - idx, 1);
                updateDashboard();
                renderTransactions();
                localStorage.setItem('transactions', JSON.stringify(transactions));
                playDeleteSound();
            };
            li.appendChild(delBtn);
            transactionList.appendChild(li);
        });
        // Add click event for price selection
        document.querySelectorAll('.price-option').forEach(span => {
            span.onclick = function() {
                const tIdx = parseInt(this.getAttribute('data-idx'));
                const pIdx = parseInt(this.getAttribute('data-price'));
                transactions[tIdx].selectedPrice = pIdx;
                updateDashboard();
                renderTransactions();
                localStorage.setItem('transactions', JSON.stringify(transactions));
            };
        });
        localStorage.setItem('transactions', JSON.stringify(transactions));
    }

    // Delete all transactions button logic
    const deleteAllBtn = document.getElementById('delete-all-btn');
    if (deleteAllBtn) {
        deleteAllBtn.onclick = function() {
            if (confirm('Are you sure you want to delete all transactions?')) {
                transactions = [];
                updateDashboard();
                renderTransactions();
                localStorage.removeItem('transactions');
                playDeleteSound();
            }
        };
    }

    // Load transactions from localStorage on page load
    const saved = localStorage.getItem('transactions');
    if (saved) {
        transactions = JSON.parse(saved);
        updateDashboard();
        renderTransactions();
    }
});
