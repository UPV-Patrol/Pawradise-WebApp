// DESCRIPTION: fetches sponsorship data and stats based on year, disp table and charts

const MONTH_ORDER = [
    'January','February','March','April','May','June',
    'July','August','September','October','November','December'
];

let animalChartInstance = null;
let monthChartInstance = null;

document.addEventListener('DOMContentLoaded', () => {
    const yearSelect = document.getElementById('yearSelect');
    
    //initial
    loadDashboard(yearSelect.value);

    // reload when year changes
    yearSelect.addEventListener('change', (e) => {
        loadDashboard(e.target.value);
    });
});

function loadDashboard(year) {
    loadSponsorships(year);
    loadStats(year);
}

async function loadSponsorships(year) {
    try {
        const response = await fetch(`/api/admin/view-sponsors?year=${year}`, { credentials: 'include' });
        const result = await response.json();

        const tbody = document.getElementById('sponsorship-table-body');
        tbody.innerHTML = '';


        if (!result.success || result.data.length === 0) {
            tbody.innerHTML = `<tr><td colspan="8">No records found for ${year}</td></tr>`;
            return;
        }

        result.data.forEach(row => {
            const formattedDate = new Date(row.created_at).toLocaleDateString('en-US', {
                year: 'numeric', month: 'short', day: 'numeric'
            });

            const formattedDateMonth = row.sponsorship_month 
                ? row.sponsorship_month.split(/[\s-]+/)[0].trim() 
                : '';
            
            const tr = document.createElement('tr');

            tr.innerHTML = `
                <td>${row.registered_username}</td>
                <td>${row.sponsor_type}</td>
                <td>${row.target_pets}</td>
                <td>${formattedDateMonth}</td>
                <td>${formattedDate}</td>
                <td>₱${parseFloat(row.amount).toFixed(2)}</td>
                <td>
                    <a href="/uploads/sponsorship/${row.proof_img}" target="_blank">View Proof</a>
                </td>
                <td>
                    <div class="status-actions">
                        <button 
                            class="approve-btn" 
                            onclick="updateStatus(${row.sponsor_id}, 'verified')"
                            ${row.status === 'verified' ? 'disabled' : ''}>
                            Approve
                        </button>
                        <button 
                            class="deny-btn" 
                            onclick="updateStatus(${row.sponsor_id}, 'denied')"
                            ${row.status === 'denied' ? 'disabled' : ''}>
                            Deny
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (err) { 
        console.error(err); 
    }
}

// sends patch request to ud sponsorship stat
async function updateStatus(sponsorId, newStatus) {
    try {
        const response = await fetch(`/api/admin/sponsorship/${sponsorId}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ status: newStatus })
        });

        const result = await response.json();

        if (result.success) {


            const yearSelect = document.getElementById('yearSelect');
            loadSponsorships(yearSelect.value);
        } else {
            alert('Failed to update status: ' + result.message);
        }

    } catch (err) {
        console.error('Update status error:', err);
    }
}

async function loadStats(year) {
    try {
        const response = await fetch(`/api/admin/stats?year=${year}`, { credentials: 'include' });
        const result = await response.json();
        if (!result.success) return;

        renderAnimalChart(result.petStats);
        renderMonthChart(result.monthStats);
    } catch (err) { 
        console.error(err); 
    }
}

function renderAnimalChart(petStats) {
    if (animalChartInstance) animalChartInstance.destroy();
    
    const ctx = document.getElementById('animalChart').getContext('2d');
    animalChartInstance = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: Object.keys(petStats),
            datasets: [{
                data: Object.values(petStats),
                backgroundColor: ['#ff914d', '#ffc19a', '#ffb347', '#ff7f50', '#ffa07a']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'right', labels: { boxWidth: 12, font: { size: 11 } } }
            }
        }
    });
}

function renderMonthChart(monthStats) {
    if (monthChartInstance) monthChartInstance.destroy();

    const cleanedStats = {};
    Object.keys(monthStats).forEach(raw => {
        const nameOnly = raw.split(/[\s-]+/)[0].trim();
        cleanedStats[nameOnly] = (cleanedStats[nameOnly] || 0) + monthStats[raw];
    });

    const labels = MONTH_ORDER.filter(m => cleanedStats[m]!== undefined);
    const values = labels.map(m => cleanedStats[m]);

    const ctx = document.getElementById('monthChart').getContext('2d');
    monthChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                label: 'Sponsorships',
                data: values,
                backgroundColor: '#ff914d',
                maxBarThickness: 40
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { 
                y: { beginAtZero: true, ticks: { stepSize: 1 } },
                x: { ticks: { autoSkip: false } }
            }
        }
    });
}