import {User, Movie} from '../App';

function cosine_sim(user: User, movie: Movie) {
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

export default cosine_sim;
