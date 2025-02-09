const API_BASE = 'https://links.ebolton.site'

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

export const addLink = async (text) => {
    const response = await fetch(`${API_BASE}/add`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ link: text }),
    });

    if (!response.ok) {
        throw new Error('Failed to post link');
    }

    return response.json();
};

export const deleteLink = async (idx) => {
    const response = await fetch(`${API_BASE}/delete/${idx}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to delete link');
    }

    return response.json();
};
