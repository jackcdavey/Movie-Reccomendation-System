import { User, Movie } from '../App';

export function cosine_usr_usr(userA: User, userB: User) {
    let userAVal = 0.0;
    let userBVal = 0.0;
    let dot_product = 0.0;

    for (let i = 0; i < userA.entries.length; i++) {
        if (userA.entries[i].rating > 0 && userB.entries[i].rating > 0) {
            let a = userA.entries[i].rating - userA.avgRating();
            let b = userB.entries[i].rating - userB.avgRating();
            userAVal += Math.pow(a, 2);
            userBVal += Math.pow(b, 2);
            dot_product += (a * b);
        }
    }
    userAVal = Math.sqrt(userAVal);
    userBVal = Math.sqrt(userBVal);
    if (userAVal == 0 || userBVal == 0) 
        return 0;
    return dot_product / (userAVal * userBVal);
}

export function cosine_usr_mov(user: User, movie: Movie) {
    let user_vector = [];
    let movie_vector = [];
    let dot_product = 0;
    let user_norm = 0;
    let movie_norm = 0;
    let similarity = 0;
    for (let i = 0; i < user.entries.length; i++) {
        user_vector.push(user.entries[i].rating);
        user_norm += Math.pow(user.entries[i].rating, 2);
    }
    for (let i = 0; i < movie.entries.length; i++) {
        movie_vector.push(movie.entries[i].rating);
        movie_norm += Math.pow(movie.entries[i].rating, 2);
    }
    for (let i = 0; i < user_vector.length; i++) {
        dot_product += user_vector[i] * movie_vector[i];
    }
    user_norm = Math.sqrt(user_norm);
    movie_norm = Math.sqrt(movie_norm);
    similarity = dot_product / (user_norm * movie_norm);
    return similarity;
}
    
