import { User, Movie, Dataset, Entry } from '../objects';

//Calculates the cosine similarity between two users
export function cosine_usr_usr(userA: User, userB: User) {
    let userAVal = 0.0;
    let userBVal = 0.0;
    let dot_product = 0.0;

    for (let i = 0; i < userA.entries.length; i++) {
        if (userA.entries[i] !== undefined && userB.entries[i] !== undefined && userA.entries[i].rating > 0 && userB.entries[i].rating > 0) {
                let movie_id = userA.entries[i].movieId;
                let a = userA.entries.filter(entry => entry.movieId === movie_id)[0].rating;
                let b = -1;
            for (let j = 0; j < userB.entries.length; j++) {
                if (userB.entries[j].movieId === movie_id) {
                    b = userB.entries[j].rating;
                    break;
                }
            }
                userAVal += Math.pow(a, 2);
                userBVal += Math.pow(b, 2);
                dot_product += (a * b);
        }
    }
    userAVal = Math.sqrt(userAVal);
    userBVal = Math.sqrt(userBVal);
    let similarity = dot_product / (userAVal * userBVal);
    return similarity;
}

export function get_cosine(vectorA: number[], vectorB: number[]) {
    let dot_product = 0.0;
    let normA = 0.0;
    let normB = 0.0;
    for (let i = 0; i < vectorA.length; i++) {
        dot_product += vectorA[i] * vectorB[i];
        normA += Math.pow(vectorA[i], 2);
        normB += Math.pow(vectorB[i], 2);
    }
    return dot_product / (Math.sqrt(normA) * Math.sqrt(normB));
}


//Predicts the rating of a movie by a user based on the rating of the most similar user that has rated the movie
export function cosine_usr_mov(user: User, movie: Movie, datasets: Dataset[]) {
    let predicted_rating = 0;
    let new_entry: Entry = new Entry(0, 0, 0);


    //Get the IDs of all the movies that the target user has rated
    let target_user_rated_movies = user.entries.filter(entry => entry.rating > 0);
    let target_user_rated_movies_ids = target_user_rated_movies.map(entry => entry.movieId);

    let rated_by_users: User[] = [];
    let candidate_sim_users: User[] = [];

    //First, find all users that have rated the target movie
    for (let i = 0; i < datasets[1].users.length; i++) {
        for(let j = 0; j < datasets[1].users[i].entries.length; j++) {
            if (datasets[1].users[i].entries[j].movieId === movie.id) {
                rated_by_users.push(datasets[1].users[i]);
            }
        }
    }
    //console.log("Movie " + movie.id + " has been rated by " + rated_by_users.length + " users");
    //Then, find all users that have rated at least x movies in common with the target user
    for (let i = 0; i < rated_by_users.length; i++) {
        let x = 2;
        let rated_by_user_movies = rated_by_users[i].entries.filter(entry => entry.rating > 0);
        let rated_by_user_movies_ids = rated_by_user_movies.map(entry => entry.movieId);
        let common_movies = rated_by_user_movies_ids.filter(id => target_user_rated_movies_ids.includes(id));
        if (common_movies.length > x) {
            candidate_sim_users.push(rated_by_users[i]);
        }
    }
    //console.log("Of those users, " + candidate_sim_users.length + " have rated at least " + 2 + " movies in common");

    //Next, compute the cosine similarity between the target user and each of the candidate users, and sort the candidate users by similarity
    let candidate_sim_users_sorted: User[] = [];
    for (let i = 0; i < candidate_sim_users.length; i++) {
        let sim = cosine_usr_usr(user, candidate_sim_users[i]);
        let index = 0;
        if (candidate_sim_users_sorted.length > 0) {
            while (index < candidate_sim_users_sorted.length && sim < cosine_usr_usr(user, candidate_sim_users_sorted[index]) ) {
                index++;
            }
        }
        candidate_sim_users_sorted.splice(index, 0, candidate_sim_users[i]);
    }
    //console.log("Sorted candidate users: ");
    for (let i = 0; i < candidate_sim_users_sorted.length; i++) {
        //console.log("User: " + candidate_sim_users_sorted[i].id);
        //console.log("Similarity: " + cosine_usr_usr(user, candidate_sim_users_sorted[i]));
    }

        
        

    //Finally, use the k most similar users' weighted ratings of the target movie to predict the target user's rating
    let k = user.entries.filter(entry => entry.rating > 0).length;
    for (let i = 0; i < k; i++) {
        if (candidate_sim_users_sorted[i] !== undefined) {
            let sim_user = candidate_sim_users_sorted[i];
            let sim_user_rating = sim_user.entries.filter(entry => entry.movieId == movie.id)[0].rating;
            let sim_user_weight = cosine_usr_usr(user, sim_user);
            predicted_rating += (sim_user_rating * sim_user_weight)*(1/k);
        } else
            break;
    }

    if (candidate_sim_users.length < 1) {
        predicted_rating = user.avgRating();
        //console.log("Using average rating of " + predicted_rating);
    }

    if (predicted_rating > 4.5)
        predicted_rating = 5;
    else if (predicted_rating < 1.5)
        predicted_rating = 1;
    
    predicted_rating = Math.round(predicted_rating);


    new_entry.userId = user.id;
    new_entry.movieId = movie.id;
    new_entry.rating = predicted_rating;

    console.log("Prediction complete");
    return new_entry;
}
    
