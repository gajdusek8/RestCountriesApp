let allCountries = [];

const countriesGrid = document.getElementById('countries-grid');
const searchInput = document.getElementById('search-input');
const regionFilter = document.getElementById('region-filter');
const countriesCount = document.getElementById('countries-count');
const loader = document.getElementById('loader');
const themeToggle = document.getElementById('theme-toggle');


async function fetchCountries() {
    const url = 'countries.json';

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Chyba při stahování dat ze souboru countries.json');

        allCountries = await response.json();

        allCountries.sort((a, b) => {
            const nameA = a.name?.common || '';
            const nameB = b.name?.common || '';
            return nameA.localeCompare(nameB);
        });

        loader.style.display = 'none';
        displayCountries(allCountries);

    } catch (error) {
        console.error(error);
        loader.innerHTML = `<i class="fa-solid fa-triangle-exclamation" style="color: #ef4444;"></i> Soubor <strong>countries.json</strong> se nepodařilo načíst. Ujistěte se, že ho máte ve stejné složce jako tento skript a projekt spouštíte přes lokální server (např. Live Server ve VS Code).`;
    }
}

function displayCountries(countries) {
    countriesGrid.innerHTML = '';
    countriesCount.textContent = countries.length;

    if (countries.length === 0) {
        countriesGrid.innerHTML = '<p class="loader">Nebyly nalezeny žádné země.</p>';
        return;
    }

    countries.forEach(country => {
        const flag = country.flags?.png || country.flags?.svg || '';
        const name = country.name?.common || 'Neznámý';
        const capital = country.capital && country.capital.length > 0 ? country.capital[0] : 'Neznámé';
        const population = country.population ? country.population.toLocaleString('cs-CZ') : '0';
        const area = country.area ? country.area.toLocaleString('cs-CZ') + ' km²' : 'Neznámá';
        const region = country.region || 'Neznámý';
        const languages = country.languages ? Object.values(country.languages).join(', ') : 'Neznámé';
        const currencies = country.currencies
            ? Object.values(country.currencies).map(c => `${c.name} (${c.symbol || ''})`).join(', ')
            : 'Neznámé';
        const timezones = country.timezones ? country.timezones.slice(0, 2).join(', ') + (country.timezones.length > 2 ? '...' : '') : 'Neznámé';
        const card = document.createElement('div');
        card.classList.add('card');

        card.innerHTML = `
            <img src="${flag}" alt="Vlajka ${name}" class="card-flag" loading="lazy">
            <div class="card-content">
                <h2 class="card-title">${name}</h2>
                <div class="card-info">
                    <p><i class="fa-solid fa-city"></i> <strong>Hlavní město:</strong> ${capital}</p>
                    <p><i class="fa-solid fa-users"></i> <strong>Obyvatelstvo:</strong> ${population}</p>
                    <p><i class="fa-solid fa-earth-americas"></i> <strong>Region:</strong> ${region}</p>
                    <p><i class="fa-solid fa-chart-area"></i> <strong>Rozloha:</strong> ${area}</p>
                    <p><i class="fa-solid fa-language"></i> <strong>Jazyky:</strong> ${languages}</p>
                    <p><i class="fa-solid fa-coins"></i> <strong>Měny:</strong> ${currencies}</p>
                    <p><i class="fa-solid fa-clock"></i> <strong>Čas. pásmo:</strong> ${timezones}</p>
                </div>
            </div>
        `;

        countriesGrid.appendChild(card);
    });
}

function filterCountries() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedRegion = regionFilter.value;

    const filtered = allCountries.filter(country => {
        const matchesSearch = country.name && country.name.common ? country.name.common.toLowerCase().includes(searchTerm) : false;
        const matchesRegion = selectedRegion === "" || country.region === selectedRegion;
        return matchesSearch && matchesRegion;
    });

    displayCountries(filtered);
}

searchInput.addEventListener('input', filterCountries);
regionFilter.addEventListener('change', filterCountries);

themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    if (currentTheme === 'dark') {
        document.documentElement.removeAttribute('data-theme');
        themeToggle.innerHTML = '<i class="fa-regular fa-moon"></i> Tmavý režim';
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i> Světlý režim';
    }
});

fetchCountries();