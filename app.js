// Global state
let currentSection = 'intro';
let sirChart = null;
let businessChart = null;
let quizCurrentQuestion = 0;

// Quiz data
const quizQuestions = [
    {
        question: "¿Cuál primitivo usarías para representar una cuenta bancaria?",
        options: ["Stock 📦", "Flow ➡️", "Variable 🔢", "Link 🔗"],
        correct: 0,
        explanation: "Una cuenta bancaria almacena dinero, por lo que es un Stock."
    },
    {
        question: "¿Qué primitivo representa un depósito de dinero?",
        options: ["Stock 📦", "Flow ➡️", "Variable 🔢", "Link 🔗"],
        correct: 1,
        explanation: "Un depósito mueve dinero hacia la cuenta, es un Flow."
    },
    {
        question: "¿Cuál primitivo usarías para la tasa de interés?",
        options: ["Stock 📦", "Flow ➡️", "Variable 🔢", "Link 🔗"],
        correct: 2,
        explanation: "La tasa de interés es un valor calculado o constante, es una Variable."
    }
];

// Exercise details
const exerciseDetails = {
    1: {
        title: "Ejercicio 1: Crecimiento Poblacional",
        content: `
            <h3>Objetivo:</h3>
            <p>Crear un modelo básico de crecimiento poblacional que incluya nacimientos y muertes.</p>
            
            <h3>Elementos del Modelo:</h3>
            <ul>
                <li><strong>Stock:</strong> Población (valor inicial: 1000)</li>
                <li><strong>Flow de entrada:</strong> Nacimientos</li>
                <li><strong>Flow de salida:</strong> Muertes</li>
                <li><strong>Variables:</strong> Tasa de natalidad (0.02), Tasa de mortalidad (0.01)</li>
            </ul>
            
            <h3>Ecuaciones:</h3>
            <ul>
                <li>Nacimientos = Población * Tasa de natalidad</li>
                <li>Muertes = Población * Tasa de mortalidad</li>
            </ul>
            
            <h3>Configuración de Simulación:</h3>
            <ul>
                <li>Tiempo: 0 a 100 años</li>
                <li>Intervalos: 1 año</li>
            </ul>
        `
    },
    2: {
        title: "Ejercicio 2: Modelo de Inventario",
        content: `
            <h3>Objetivo:</h3>
            <p>Desarrollar un sistema de gestión de inventario con demanda variable y reposición automática.</p>
            
            <h3>Elementos del Modelo:</h3>
            <ul>
                <li><strong>Stock:</strong> Inventario (valor inicial: 500 unidades)</li>
                <li><strong>Flow de entrada:</strong> Reposición</li>
                <li><strong>Flow de salida:</strong> Ventas</li>
                <li><strong>Variables:</strong> Demanda diaria (50), Punto de reorden (100), Cantidad de pedido (200)</li>
            </ul>
            
            <h3>Lógica del Modelo:</h3>
            <ul>
                <li>Ventas = MIN(Demanda diaria, Inventario)</li>
                <li>Reposición = IF(Inventario < Punto de reorden, Cantidad de pedido, 0)</li>
            </ul>
            
            <h3>Configuración de Simulación:</h3>
            <ul>
                <li>Tiempo: 0 a 365 días</li>
                <li>Intervalos: 1 día</li>
            </ul>
        `
    },
    3: {
        title: "Ejercicio 3: Difusión de Innovación",
        content: `
            <h3>Objetivo:</h3>
            <p>Modelar la adopción de una nueva tecnología en el mercado usando el modelo de Bass.</p>
            
            <h3>Elementos del Modelo:</h3>
            <ul>
                <li><strong>Stock:</strong> Adoptantes (valor inicial: 0)</li>
                <li><strong>Stock:</strong> Potenciales Adoptantes (valor inicial: 10000)</li>
                <li><strong>Flow:</strong> Adopción</li>
                <li><strong>Variables:</strong> Coeficiente de innovación (0.03), Coeficiente de imitación (0.3)</li>
            </ul>
            
            <h3>Ecuación Principal:</h3>
            <ul>
                <li>Adopción = (Coeficiente de innovación + Coeficiente de imitación * Adoptantes / (Adoptantes + Potenciales Adoptantes)) * Potenciales Adoptantes</li>
            </ul>
            
            <h3>Configuración de Simulación:</h3>
            <ul>
                <li>Tiempo: 0 a 50 períodos</li>
                <li>Intervalos: 0.25 períodos</li>
            </ul>
        `
    }
};

// Navigation functions
function showSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => section.classList.remove('active'));
    
    // Show selected section
    document.getElementById(sectionId).classList.add('active');
    
    // Update navigation
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => item.classList.remove('active'));
    event.target.classList.add('active');
    
    currentSection = sectionId;
    
    // Initialize section-specific content
    if (sectionId === 'primitives') {
        initializePrimitivesQuiz();
    } else if (sectionId === 'sir') {
        initializeSIRControls();
    } else if (sectionId === 'business') {
        initializeBusinessControls();
    }
}

// Initialize primitives quiz
function initializePrimitivesQuiz() {
    quizCurrentQuestion = 0;
    displayQuizQuestion();
}

function displayQuizQuestion() {
    const quizContainer = document.getElementById('primitiveQuiz');
    if (quizCurrentQuestion >= quizQuestions.length) {
        quizContainer.innerHTML = `
            <div class="quiz-complete">
                <h4>🎉 ¡Quiz Completado!</h4>
                <p>Has completado todos los ejercicios de identificación de primitivos.</p>
                <button class="btn btn--primary" onclick="resetQuiz()">Reiniciar Quiz</button>
            </div>
        `;
        return;
    }
    
    const question = quizQuestions[quizCurrentQuestion];
    quizContainer.innerHTML = `
        <div class="quiz-question">
            <h4>Pregunta ${quizCurrentQuestion + 1} de ${quizQuestions.length}</h4>
            <p><strong>${question.question}</strong></p>
            <div class="quiz-options">
                ${question.options.map((option, index) => `
                    <div class="quiz-option" onclick="selectQuizOption(${index})">
                        ${option}
                    </div>
                `).join('')}
            </div>
            <div id="quizFeedback" class="mt-16" style="display: none;"></div>
        </div>
    `;
}

function selectQuizOption(selectedIndex) {
    const question = quizQuestions[quizCurrentQuestion];
    const options = document.querySelectorAll('.quiz-option');
    const feedback = document.getElementById('quizFeedback');
    
    // Disable further clicks
    options.forEach(option => {
        option.style.pointerEvents = 'none';
    });
    
    // Show correct/incorrect styling
    options[selectedIndex].classList.add(selectedIndex === question.correct ? 'correct' : 'incorrect');
    if (selectedIndex !== question.correct) {
        options[question.correct].classList.add('correct');
    }
    
    // Show feedback
    feedback.style.display = 'block';
    feedback.innerHTML = `
        <p><strong>${selectedIndex === question.correct ? '✅ ¡Correcto!' : '❌ Incorrecto'}</strong></p>
        <p>${question.explanation}</p>
        <button class="btn btn--primary" onclick="nextQuizQuestion()">Siguiente Pregunta</button>
    `;
}

function nextQuizQuestion() {
    quizCurrentQuestion++;
    displayQuizQuestion();
}

function resetQuiz() {
    quizCurrentQuestion = 0;
    displayQuizQuestion();
}

// SIR Model functions
function initializeSIRControls() {
    // Set up slider event listeners
    const sliders = {
        'population': 'populationValue',
        'initialInfected': 'initialInfectedValue',
        'infectionRate': 'infectionRateValue',
        'recoveryRate': 'recoveryRateValue'
    };
    
    Object.keys(sliders).forEach(sliderId => {
        const slider = document.getElementById(sliderId);
        const valueDisplay = document.getElementById(sliders[sliderId]);
        
        slider.addEventListener('input', function() {
            valueDisplay.textContent = this.value;
        });
    });
    
    // Initialize chart
    const ctx = document.getElementById('sirChart').getContext('2d');
    sirChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                {
                    label: 'Susceptibles',
                    data: [],
                    borderColor: '#1FB8CD',
                    backgroundColor: 'rgba(31, 184, 205, 0.1)',
                    fill: true
                },
                {
                    label: 'Infectados',
                    data: [],
                    borderColor: '#B4413C',
                    backgroundColor: 'rgba(180, 65, 60, 0.1)',
                    fill: true
                },
                {
                    label: 'Recuperados',
                    data: [],
                    borderColor: '#D2BA4C',
                    backgroundColor: 'rgba(210, 186, 76, 0.1)',
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Días'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Población'
                    },
                    beginAtZero: true
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                }
            },
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
            }
        }
    });
}

function runSIRSimulation() {
    const population = parseInt(document.getElementById('population').value);
    const initialInfected = parseInt(document.getElementById('initialInfected').value);
    const infectionRate = parseFloat(document.getElementById('infectionRate').value);
    const recoveryRate = parseFloat(document.getElementById('recoveryRate').value);
    
    const days = 100;
    const dt = 0.1;
    const steps = days / dt;
    
    let S = population - initialInfected;
    let I = initialInfected;
    let R = 0;
    
    const results = {
        labels: [],
        susceptible: [],
        infected: [],
        recovered: []
    };
    
    let maxInfected = I;
    let maxInfectedDay = 0;
    
    for (let step = 0; step <= steps; step++) {
        const t = step * dt;
        
        if (step % (1 / dt) === 0) { // Record every day
            results.labels.push(Math.round(t));
            results.susceptible.push(Math.round(S));
            results.infected.push(Math.round(I));
            results.recovered.push(Math.round(R));
            
            if (I > maxInfected) {
                maxInfected = I;
                maxInfectedDay = Math.round(t);
            }
        }
        
        // SIR differential equations
        const dS = -infectionRate * S * I / population;
        const dI = infectionRate * S * I / population - recoveryRate * I;
        const dR = recoveryRate * I;
        
        S += dS * dt;
        I += dI * dt;
        R += dR * dt;
        
        // Ensure non-negative values
        S = Math.max(0, S);
        I = Math.max(0, I);
        R = Math.max(0, R);
    }
    
    // Update chart
    sirChart.data.labels = results.labels;
    sirChart.data.datasets[0].data = results.susceptible;
    sirChart.data.datasets[1].data = results.infected;
    sirChart.data.datasets[2].data = results.recovered;
    sirChart.update();
    
    // Update metrics
    const totalAffected = population - results.susceptible[results.susceptible.length - 1];
    const duration = results.labels.find((_, index) => results.infected[index] < 1) || days;
    
    document.getElementById('peakInfected').textContent = Math.round(maxInfected);
    document.getElementById('peakDay').textContent = maxInfectedDay;
    document.getElementById('totalAffected').textContent = Math.round(totalAffected);
    document.getElementById('duration').textContent = `${duration} días`;
}

function resetSIRSimulation() {
    // Reset sliders to default values
    document.getElementById('population').value = 1000;
    document.getElementById('initialInfected').value = 10;
    document.getElementById('infectionRate').value = 0.3;
    document.getElementById('recoveryRate').value = 0.1;
    
    // Update value displays
    document.getElementById('populationValue').textContent = 1000;
    document.getElementById('initialInfectedValue').textContent = 10;
    document.getElementById('infectionRateValue').textContent = 0.3;
    document.getElementById('recoveryRateValue').textContent = 0.1;
    
    // Clear chart
    sirChart.data.labels = [];
    sirChart.data.datasets.forEach(dataset => {
        dataset.data = [];
    });
    sirChart.update();
    
    // Clear metrics
    document.getElementById('peakInfected').textContent = '-';
    document.getElementById('peakDay').textContent = '-';
    document.getElementById('totalAffected').textContent = '-';
    document.getElementById('duration').textContent = '-';
}

// Business Model functions
function initializeBusinessControls() {
    // Set up slider event listeners
    const sliders = {
        'initialCustomers': 'initialCustomersValue',
        'marketingBudget': 'marketingBudgetValue',
        'acquisitionCost': 'acquisitionCostValue',
        'churnRate': 'churnRateValue',
        'referralRate': 'referralRateValue',
        'revenuePerCustomer': 'revenuePerCustomerValue'
    };
    
    Object.keys(sliders).forEach(sliderId => {
        const slider = document.getElementById(sliderId);
        const valueDisplay = document.getElementById(sliders[sliderId]);
        
        slider.addEventListener('input', function() {
            let value = this.value;
            if (sliderId === 'churnRate' || sliderId === 'referralRate') {
                valueDisplay.textContent = value + '%';
            } else {
                valueDisplay.textContent = value;
            }
        });
    });
    
    // Initialize chart
    const ctx = document.getElementById('businessChart').getContext('2d');
    businessChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                {
                    label: 'Clientes',
                    data: [],
                    borderColor: '#1FB8CD',
                    backgroundColor: 'rgba(31, 184, 205, 0.1)',
                    fill: false,
                    yAxisID: 'y'
                },
                {
                    label: 'Ingresos Acumulados ($)',
                    data: [],
                    borderColor: '#D2BA4C',
                    backgroundColor: 'rgba(210, 186, 76, 0.1)',
                    fill: false,
                    yAxisID: 'y1'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Meses'
                    }
                },
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Número de Clientes'
                    },
                    beginAtZero: true
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: 'Ingresos ($)'
                    },
                    beginAtZero: true,
                    grid: {
                        drawOnChartArea: false
                    }
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                }
            }
        }
    });
}

function runBusinessSimulation() {
    const initialCustomers = parseInt(document.getElementById('initialCustomers').value);
    const marketingBudget = parseFloat(document.getElementById('marketingBudget').value);
    const acquisitionCost = parseFloat(document.getElementById('acquisitionCost').value);
    const churnRate = parseFloat(document.getElementById('churnRate').value) / 100;
    const referralRate = parseFloat(document.getElementById('referralRate').value) / 100;
    const revenuePerCustomer = parseFloat(document.getElementById('revenuePerCustomer').value);
    
    const months = 24;
    let customers = initialCustomers;
    let cumulativeRevenue = 0;
    let totalInvestment = 0;
    
    const results = {
        labels: [],
        customers: [],
        revenue: []
    };
    
    for (let month = 0; month <= months; month++) {
        results.labels.push(month);
        results.customers.push(Math.round(customers));
        results.revenue.push(Math.round(cumulativeRevenue));
        
        if (month < months) {
            // Marketing acquisitions
            const monthlyBudget = marketingBudget / 12;
            const newCustomersFromMarketing = monthlyBudget / acquisitionCost;
            totalInvestment += monthlyBudget;
            
            // Referral acquisitions
            const newCustomersFromReferrals = customers * referralRate;
            
            // Churn
            const lostCustomers = customers * churnRate;
            
            // Update customers
            customers = customers + newCustomersFromMarketing + newCustomersFromReferrals - lostCustomers;
            customers = Math.max(0, customers);
            
            // Update revenue
            const monthlyRevenue = customers * revenuePerCustomer;
            cumulativeRevenue += monthlyRevenue;
        }
    }
    
    // Update chart
    businessChart.data.labels = results.labels;
    businessChart.data.datasets[0].data = results.customers;
    businessChart.data.datasets[1].data = results.revenue;
    businessChart.update();
    
    // Calculate metrics
    const finalCustomers = results.customers[results.customers.length - 1];
    const totalRevenue = results.revenue[results.revenue.length - 1];
    const roi = ((totalRevenue - totalInvestment) / totalInvestment * 100);
    const growthRate = ((finalCustomers - initialCustomers) / initialCustomers * 100);
    
    // Update metrics
    document.getElementById('finalCustomers').textContent = finalCustomers.toLocaleString();
    document.getElementById('totalRevenue').textContent = '$' + totalRevenue.toLocaleString();
    document.getElementById('finalROI').textContent = roi.toFixed(1) + '%';
    document.getElementById('growthRate').textContent = growthRate.toFixed(1) + '%';
}

function resetBusinessSimulation() {
    // Reset sliders to default values
    document.getElementById('initialCustomers').value = 100;
    document.getElementById('marketingBudget').value = 5000;
    document.getElementById('acquisitionCost').value = 50;
    document.getElementById('churnRate').value = 5;
    document.getElementById('referralRate').value = 2;
    document.getElementById('revenuePerCustomer').value = 100;
    
    // Update value displays
    document.getElementById('initialCustomersValue').textContent = 100;
    document.getElementById('marketingBudgetValue').textContent = 5000;
    document.getElementById('acquisitionCostValue').textContent = 50;
    document.getElementById('churnRateValue').textContent = '5%';
    document.getElementById('referralRateValue').textContent = '2%';
    document.getElementById('revenuePerCustomerValue').textContent = 100;
    
    // Clear chart
    businessChart.data.labels = [];
    businessChart.data.datasets.forEach(dataset => {
        dataset.data = [];
    });
    businessChart.update();
    
    // Clear metrics
    document.getElementById('finalCustomers').textContent = '-';
    document.getElementById('totalRevenue').textContent = '-';
    document.getElementById('finalROI').textContent = '-';
    document.getElementById('growthRate').textContent = '-';
}

// Exercise modal functions
function showExerciseDetails(exerciseNumber) {
    const modal = document.getElementById('exerciseModal');
    const exerciseDetails = document.getElementById('exerciseDetails');
    
    const exercise = getExerciseDetails(exerciseNumber);
    exerciseDetails.innerHTML = `
        <h2>${exercise.title}</h2>
        ${exercise.content}
    `;
    
    modal.style.display = 'block';
}

function getExerciseDetails(exerciseNumber) {
    return exerciseDetails[exerciseNumber] || {
        title: 'Ejercicio no encontrado',
        content: '<p>No se encontró información para este ejercicio.</p>'
    };
}

function closeModal() {
    document.getElementById('exerciseModal').style.display = 'none';
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('exerciseModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Set up initial navigation state
    const firstNavItem = document.querySelector('.nav-item');
    if (firstNavItem) {
        firstNavItem.classList.add('active');
    }
    
    // Show intro section by default
    showSection('intro');
});