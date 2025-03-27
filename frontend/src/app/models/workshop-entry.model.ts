// Interface for Workshop Entry data, based on backend response
export interface WorkshopEntry {
    WEID: number;
    category: string;
    title: string;
    description: string; // Keep description, might show snippet or full on hover/details later
    subscriptions: number;
    game: {
        gameID: number;
        title: string; // Renamed from gameTitle in backend for clarity here
    };
    user: {
        userID: number;
        name: string; // Renamed from userName in backend for clarity here
    };
}