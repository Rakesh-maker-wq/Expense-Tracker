document.addEventListener('DOMContentLoaded', () => {
    const balanceElement = document.getElementById('balance');
    const transactionForm = document.getElementById('transaction-form');
    const transactionHistory = document.getElementById('transaction-history');
    const typeSelect = document.getElementById('type');
    const subtypeSelect = document.getElementById('subtype');
    const doughnutChartCtx = document.getElementById('doughnutChart').getContext('2d');
    let balance = 0;

    const subtypes = {
        income: ['Salary', 'Bonus', 'Profit'],
        expense: ['Food', 'Education', 'Transportation', 'Rent', 'Clothes', 'Entertainment']
    };

    const subtypeAmounts = {
        salary: 0,
        bonus: 0,
        profit: 0,
        food: 0,
        education: 0,
        transportation: 0,
        rent: 0,
        clothes: 0,
        entertainment: 0
    };

    const doughnutChart = new Chart(doughnutChartCtx, {
        type: 'doughnut',
        data: {
            labels: [],
            datasets: [{
                data: [],
                backgroundColor: []
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
        }
    });

    typeSelect.addEventListener('change', () => {
        const selectedType = typeSelect.value;
        subtypeSelect.innerHTML = '<option value="" disabled selected>Select Subtype</option>';
        if (selectedType) {
            subtypes[selectedType].forEach(subtype => {
                const option = document.createElement('option');
                option.value = subtype.toLowerCase();
                option.textContent = subtype;
                subtypeSelect.appendChild(option);
            });
        }
    });

    transactionForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const type = typeSelect.value;
        const subtype = subtypeSelect.value;
        const amount = parseFloat(document.getElementById('amount').value);
        const date = document.getElementById('date').value;
        const description = document.getElementById('description').value;

        if (type && subtype && amount && date && description) {
            if (type === 'income') {
                balance += amount;
            } else {
                balance -= amount;
            }

            subtypeAmounts[subtype] += amount;

            updateBalance();
            updateDoughnutChart();
            addTransactionToHistory(type, subtype, amount, date, description);
            transactionForm.reset();
            subtypeSelect.innerHTML = '<option value="" disabled selected>Select Subtype</option>';
        }
    });

    function updateBalance() {
        balanceElement.textContent = balance.toFixed(2);
    }

    function updateDoughnutChart() {
        doughnutChart.data.labels = [];
        doughnutChart.data.datasets[0].data = [];
        doughnutChart.data.datasets[0].backgroundColor = [];

        for (const subtype in subtypeAmounts) {
            if (subtypeAmounts[subtype] > 0) {
                doughnutChart.data.labels.push(subtype.charAt(0).toUpperCase() + subtype.slice(1));
                doughnutChart.data.datasets[0].data.push(subtypeAmounts[subtype]);
                doughnutChart.data.datasets[0].backgroundColor.push(getColor(subtype));
            }
        }
        doughnutChart.update();
    }

    function getColor(subtype) {
        const colors = {
            salary: '#4caf50',
            bonus: '#81c784',
            profit: '#388e3c',
            food: '#f44336',
            education: '#e57373',
            transportation: '#ffeb3b',
            rent: '#ff9800',
            clothes: '#9c27b0',
            entertainment: '#3f51b5'
        };
        return colors[subtype];
    }

    function addTransactionToHistory(type, subtype, amount, date, description) {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${description} - ${date} - $${amount.toFixed(2)}</span>
            <button class="delete-btn">Delete</button>
        `;
        li.querySelector('.delete-btn').addEventListener('click', () => {
            if (type === 'income') {
                balance -= amount;
            } else {
                balance += amount;
            }

            subtypeAmounts[subtype] -= amount;

            updateBalance();
            updateDoughnutChart();
            li.remove();
        });
        transactionHistory.appendChild(li);
    }
});
