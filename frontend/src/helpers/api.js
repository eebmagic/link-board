const API_BASE = 'http://links.ebolton.site'

export const getLinks = async (offset, n) => {
    const queryString = new URLSearchParams({
        offset: offset || 0,
        n: n || 10,
    }).toString();

    const result = await fetch(
        `${API_BASE}/links?${queryString}`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }
    );

    if (!result.ok) {
        throw new Error(`HTTP response error: ${result.status}`);
    };

    const links = await result.json();
    return links;
}

