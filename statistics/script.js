const stats = await getStatistics();
const totalAttemptsElement = document.getElementById('total-attempts');
const averageAttemptsElement = document.getElementById('average-attempts');
const totalWinsElement = document.getElementById('total-wins');
const totalLossesElement = document.getElementById('total-losses');


function getStatistics() {
    return fetch('/stats')
        .then(response => response.json())
        .catch(error => {
            console.error('Error fetching statistics:', error);
            return null;
        });
}

function animateValue(element, start, end, duration = 500) {
    const startTime = performance.now();
    
    const update = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const current = Math.floor(start + (end - start) * progress);
        element.textContent = current;
        
        if (progress < 1) requestAnimationFrame(update);
    };
    
    requestAnimationFrame(update);
}

function setStatistics(stats) {
    animateValue(totalAttemptsElement, 0, stats.total_attempts);
    animateValue(averageAttemptsElement, 0, Math.round(stats.average_attempt));
    animateValue(totalWinsElement, 0, stats.total_wins);
    animateValue(totalLossesElement, 0, stats.total_losses);
}

function main() {
    if (!stats) {
        totalAttemptsElement.textContent = 'Error';
        averageAttemptsElement.textContent = 'Error';
        totalWinsElement.textContent = 'Error';
        totalLossesElement.textContent = 'Error';
        return;
    }

    setStatistics(stats);
}

main();