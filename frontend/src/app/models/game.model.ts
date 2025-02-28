interface Game {
    gameID: number,
    title: string,
    genre: Genre,
    rating: number,
    description: string,
    downloads: number,
    price: number,
    developer: Developer,
}

interface Genre {
    genreId: number,
    name: string,
}

interface Developer {
    developerID: number,
    name: string,
}