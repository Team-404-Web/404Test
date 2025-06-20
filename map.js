document.addEventListener('DOMContentLoaded', function() {
    try {
        // Karte initialisieren
        const map = L.map('map').setView([51.1657, 10.4515], 6); // Zentriert auf Deutschland
        
        // OpenStreetMap Layer hinzufügen
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        // Rote Marker-Icon erstellen
        const redIcon = L.icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        });

        console.log('Versuche locations.json zu laden...');
        
        // Versuche die locations.json zu laden
        fetch('locations.json', {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => {
            console.log('Response Status:', response.status);
            console.log('Response Headers:', response.headers);
            
            if (!response.ok) {
                throw new Error(`Netzwerkfehler: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Erfolgreich geladene Daten:', data);
            
            // Überprüfe, ob die Daten im richtigen Format sind
            if (!data || !data.locations || !Array.isArray(data.locations)) {
                throw new Error('Ungültiges JSON-Format: Kein locations Array gefunden');
            }

            // Container für die Liste erstellen
            const listContainer = document.createElement('div');
            listContainer.className = 'location-list';
            document.querySelector('.locations-container').appendChild(listContainer);

            // Jeden Standort verarbeiten
            data.locations.forEach(location => {
                console.log('Verarbeite Standort:', location);
                
                // Überprüfe, ob alle erforderlichen Felder vorhanden sind
                if (!location.latitude || !location.longitude || !location.city || !location.address) {
                    throw new Error('Fehlende erforderliche Felder in Standortdaten');
                }

                // Rote Marker auf der Karte hinzufügen
                const marker = L.marker([location.latitude, location.longitude], { icon: redIcon })
                    .addTo(map)
                    .bindPopup(`<strong>${location.city}</strong><br>${location.address}`);

                // Liste-Eintrag erstellen
                const listItem = document.createElement('div');
                listItem.className = 'location-item';
                
                // Adresse in PLZ, Straße aufteilen
                const addressParts = location.address.split(',');
                const street = addressParts[0];
                const zipCity = addressParts[1];
                
                listItem.innerHTML = `
                    <h3>${location.city}</h3>
                    <p>${street}</p>
                    <p>${zipCity}</p>
                    <button class="view-on-map">Auf Karte anzeigen</button>
                `;
                listContainer.appendChild(listItem);

                // Button-Handler für den "Auf Karte anzeigen" Button
                listItem.querySelector('.view-on-map').addEventListener('click', () => {
                    // Google Maps URL öffnen
                    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.address)}`;
                    window.open(googleMapsUrl, '_blank');
                });

                // Klick auf den Listeintrag zoomt zur Position
                listItem.addEventListener('click', (e) => {
                    if (e.target.tagName !== 'BUTTON') {
                        map.setView([location.latitude, location.longitude], 12);
                    }
                });
            });
        })
        .catch(error => {
            console.error('Fehler beim Laden der Standorte:', error);
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.innerHTML = `
                <p style="color: #ff0000;">${error.message}</p>
                <p style="color: #ff0000;">Bitte überprüfen Sie:</p>
                <ul style="color: #ff0000;">
                    <li>Ob die locations.json im richtigen Verzeichnis liegt</li>
                    <li>Ob der Browser Zugriff auf lokale Dateien hat</li>
                    <li>Ob die JSON-Datei korrekt formatiert ist</li>
                </ul>
            `;
            document.querySelector('.locations-container').appendChild(errorDiv);
        });

    } catch (error) {
        console.error('Fehler bei der Karteninitialisierung:', error);
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = '<p style="color: #ff0000;">Fehler bei der Karteninitialisierung. Bitte versuchen Sie es später noch einmal.</p>';
        document.querySelector('.locations-container').appendChild(errorDiv);
    }
});
