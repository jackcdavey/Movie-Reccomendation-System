import { User, Movie, Dataset, Entry } from '../objects';

//Calculates the cosine similarity between two users
export function cosine_usr_usr(userA: User, userB: User) {
    let userAVal = 0.0;
    let userBVal = 0.0;
    let dot_product = 0.0;

    let userA_rated_movies = userA.entries.filter(entry => entry.rating > 0);
    let userA_rated_movies_ids = userA_rated_movies.map(entry => entry.movieId);
    let userB_rated_movies = userB.entries.filter(entry => entry.rating > 0);
    let userB_common_entries = userB_rated_movies.filter(entry => userA_rated_movies_ids.includes(entry.movieId));
    let userA_common_entries = userA_rated_movies.filter(entry => userB_rated_movies.map(entry => entry.movieId).includes(entry.movieId));

    for (let i = 0; i < userA_common_entries.length; i++) {
        if (userA_common_entries[i].rating > 0 && userB_common_entries[i].rating > 0) {
            userAVal += userA_common_entries[i].rating * userA_common_entries[i].rating;
            userBVal += userB_common_entries[i].rating * userB_common_entries[i].rating;
            dot_product += userA_common_entries[i].rating * userB_common_entries[i].rating;
        }
    }

    
    // for (let i = 0; i < userA.entries.length; i++) {
    //     if (userA.entries[i] !== undefined && userB.entries[i] !== undefined && userA.entries[i].rating > 0 && userB.entries[i].rating > 0) {
    //             let movie_id = userA.entries[i].movieId;
    //             let a = userA.entries.filter(entry => entry.movieId === movie_id)[0].rating;
    //             let b = -1;
    //         for (let j = 0; j < userB.entries.length; j++) {
    //             if (userB.entries[j].movieId === movie_id) {
    //                 b = userB.entries[j].rating;
    //                 break;
    //             }
    //         }

            
    //             userAVal += Math.pow(a, 2);
    //             userBVal += Math.pow(b, 2);
    //             dot_product += (a * b);
    //     }
    // }
    userAVal = Math.sqrt(userAVal);
    userBVal = Math.sqrt(userBVal);

    let similarity = dot_product / (userAVal * userBVal);
    if (userAVal === 0 || userBVal === 0) 
        similarity = 0;

    return similarity;
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

    //Then, find all users that have rated at least x movies in common with the target user
    for (let i = 0; i < rated_by_users.length; i++) {
        let x = 2;
        let rated_by_user_movies = rated_by_users[i].entries.filter(entry => entry.rating > 0);
        let rated_by_user_movies_ids = rated_by_user_movies.map(entry => entry.movieId);
        let common_movies = rated_by_user_movies_ids.filter(id => target_user_rated_movies_ids.includes(id));
        if (common_movies.length > x) {
            // console.log("YEAH");
            candidate_sim_users.push(rated_by_users[i]);
        }
    }

    //Next, compute the cosine similarity between the target user and each of the candidate users, and sort the candidate users by similarity
    let candidate_sim_users_sorted: User[] = [];
    for (let i = 0; i < candidate_sim_users.length; i++) {
        let sim = cosine_usr_usr(user, candidate_sim_users[i]);
        let index = 0;
        if (candidate_sim_users_sorted.length > 0) {
            while (index < candidate_sim_users_sorted.length && sim > cosine_usr_usr(user, candidate_sim_users_sorted[index]) ) {
                // console.log("Ova here");
                index++;
            }
        }
        candidate_sim_users_sorted.splice(index, 0, candidate_sim_users[i]);
    }

        
        

    //Finally, use the k most similar users' weighted ratings of the target movie to predict the target user's rating
    let k = 5;
    for (let i = 0; i < k; i++) {
        if (candidate_sim_users_sorted[i] !== undefined) {
            let sim_user = candidate_sim_users_sorted[i];
            // console.log("Final yeet");
            let sim_user_rating = sim_user.entries.filter(entry => entry.movieId == movie.id)[0].rating;
            let sim_user_weight = cosine_usr_usr(user, sim_user);
            console.log("W:" + sim_user_weight);
            predicted_rating += (sim_user_rating * sim_user_weight)*(1/k);
        } else
            break;
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
    
