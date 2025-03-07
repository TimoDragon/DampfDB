export interface Game {
    gameID: number,
    title: string,
    genre: Genre,
    rating: number,
    description: string,
    downloads: number,
    price: number,
    developer: Developer,
}

export interface Genre {
    genreId: number,
    name: string,
}

export interface Developer {
    developerID: number,
    name: string,
}