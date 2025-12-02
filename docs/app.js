// Sayfa yüklendiğinde SCAN butonunu aktif et
window.addEventListener("DOMContentLoaded", () => {
    document.getElementById("scanBtn").addEventListener("click", startScan);
});

async function checkDomain(domain) {
    const API_KEY = "OIgCwJbtkk0tSMngejuZkw==pXAxvfDzvOnxrBKe";

    // CORS problemini çözüyoruz
    const url = `https://corsproxy.io/?https://api.api-ninjas.com/v1/whois?domain=${domain}`;

    try {
        const response = await fetch(url, {
            headers: { "X-Api-Key": API_KEY }
        });

        const data = await response.json();

        // Domain boş mu?
        if (!data || data.error || data.is_available === true) {
            return "AVAILABLE";
        }

        // Eğer WHOIS bilgisi varsa domain alınmıştır
        if (
            data.domain_name ||
            data.creation_date ||
            data.registrar ||
            (data.name_servers && data.name_servers.length > 0)
        ) {
            return "TAKEN";
        }

        return "AVAILABLE";

    } catch (err) {
        console.log("Hata:", err);
        return "UNKNOWN";
    }
}


// TARAMAYI BAŞLATAN ANA FONKSİYON
async function startScan() {
    const prefix = document.getElementById("prefix").value;
    const start = parseInt(document.getElementById("start").value);
    const end = parseInt(document.getElementById("end").value);
    const tld = document.getElementById("tld").value;

    const result = document.getElementById("result");
    result.innerHTML = "Scanning...<br><br>";

    for (let i = start; i <= end; i++) {
        const domain = `${prefix}${i}${tld}`;
        const status = await checkDomain(domain);

        const color =
            status === "AVAILABLE" ? "green" :
            status === "TAKEN" ? "red" :
            "yellow";

        result.innerHTML +=
            `<span style="color:${color}">${domain} → ${status}</span><br>`;
    }
}
