// API Configuration
const API_BASE_URL = '/api/verbs';

// API Service
const VerbsAPI = {
    // Start a new game
    async newGame(language) {
        try {
            const response = await fetch(`${API_BASE_URL}/newGame/${languagej}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to start new game');
            }

            return await response.json();
        } catch (error) {
            console.error('Error starting new game:', error);
            throw error;
        }
    },

    // Submit a verb guess
    async guessVerb(gameId, guess) {
        try {
            const response = await fetch(`${API_BASE_URL}/play`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    gameId: gameId,
                    guess: guess
                })
            });

            if (response.status === 400) {
                const errorText = await response.text();
                throw new Error(errorText || 'Invalid verb or verb already used');
            }

            if (!response.ok) {
                throw new Error('Failed to submit guess');
            }

            return await response.json();
        } catch (error) {
            console.error('Error submitting guess:', error);
            throw error;
        }
    },

    // Delete a game
    async deleteGame(gameId) {
        try {
            const response = await fetch(`${API_BASE_URL}/${gameId}`, {
                method: 'DELETE'
            });

            if (response.status === 404) {
                console.warn('Game not found for deletion');
                return false;
            }

            return response.status === 204;
        } catch (error) {
            console.error('Error deleting game:', error);
            return false;
        }
    }
};

// Export for use in other files
window.VerbsAPI = VerbsAPI;
