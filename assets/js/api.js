// Unified ERP API Client
const ERP_API = {
    async get(action, params = {}) {
        const url = new URL('api.php', window.location.href);
        url.searchParams.set('action', action);
        for (const [key, value] of Object.entries(params)) {
            if (value !== undefined && value !== null) {
                url.searchParams.set(key, value);
            }
        }
        try {
            const resp = await fetch(url.toString(), {
                method: 'GET',
                headers: { 'Accept': 'application/json' }
            });
            const data = await resp.json();
            return data;
        } catch (err) {
            console.error('API GET Error:', err);
            return { success: false, error: '網絡或伺服器連線異常: ' + err.message };
        }
    },

    async post(action, payload = {}) {
        const url = new URL('api.php', window.location.href);
        url.searchParams.set('action', action);
        try {
            const resp = await fetch(url.toString(), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(payload)
            });
            const data = await resp.json();
            return data;
        } catch (err) {
            console.error('API POST Error:', err);
            return { success: false, error: '網絡或伺服器連線異常: ' + err.message };
        }
    },

    // Windows ERP Style Modal Message Box
    showMessage(text, title = '系統訊息', isError = false) {
        alert((isError ? '【錯誤】' : '【訊息】') + '\n\n' + text);
    },

    confirm(text, title = '確認') {
        return window.confirm(text);
    }
};
