import { User, Movie, Dataset, Entry } from '../objects';

//Calculates the cosine similarity between two users
function cosine_mov_mov(movieA: Movie, movieB: Movie) {
    let movieAVal = 0.0;
    let movieBVal = 0.0;
    let dot_product = 0.0;
        

    for (let i = 0; i < movieA.entries.length; i++) {
        let a = 0;
        let b = 0;
        if (movieA.entries[i].rating > 0) {
            a = movieA.entries[i].rating;
            for (let j = 0; j < movieB.entries.length; j++) {
                if(movieB.entries[j].movieId === movieA.entries[i].movieId) {
                    b = movieB.entries[j].rating;
                    // console.log("Comparing user " + movieA.id + "'s rating of "+ a + " for movie " + movieA.entries[i].movieId + " and user " + movieB.id + "'s rating of " + b + " for movie " + movieB.entries[j].movieId);
                    break;
                }
            }
            if (a > 0 && b > 0) {
            //     if (movieA.id === 300 && movieB.id === 90) {
                
                // console.log("Comparing ratings: " + a + " and " + b);
            // }
                dot_product += a * b;
                movieAVal += a * a;
                movieBVal += b * b;
            }
        }
    }
    if (movieAVal === 0.0 || movieBVal === 0.0)
        return 0;
    
    // if (movieA.id === 300 && movieB.id === 90) 
        // console.log("dot product: " + dot_product + " movieAVal: " + movieAVal + " movieBVal: " + movieBVal);
    
    let similarity = dot_product / (Math.sqrt(movieAVal) * Math.sqrt(movieBVal));

    if (similarity >= 1)
        similarity = 0.5;
    if(similarity <= 0) 
        similarity = 0.1;

    return similarity;
}


//Predicts a user's rating for a movie based on the similarity between the movie and other movies liked by the taget user
export function cosine_mov_usr(movie: Movie, user: User,  datasets: Dataset[]) {
    let predicted_rating = 0;
    let new_entry: Entry = new Entry(0, 0, 0);


    //First, get the IDs of all the users that have rated the target movie
    let target_movie_rated_users = movie.entries.filter(entry => entry.rating > 0);
    let target_movie_rated_users_ids = target_movie_rated_users.map(entry => entry.userId);

    


    //Get the IDs of all the movies that the target user has rated
    let target_user_rated_movies = user.entries.filter(entry => entry.rating > 0);
    let target_user_rated_movies_ids = target_user_rated_movies.map(entry => entry.movieId);

    let rated_by_users: User[] = [];
    let candidate_sim_users: User[] = [];

    //First, find all movies rated by the target user
    for (let i = 0; i < datasets[1].users.length; i++) {
        for(let j = 0; j < datasets[1].users[i].entries.length; j++) {
            if (datasets[1].users[i].entries[j].movieId === movie.id) {
                rated_by_users.push(datasets[1].users[i]);
            }
        }
    }
    // console.log("\nMovie " + movie.id + " has been rated by " + rated_by_users.length + " users");
    
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
    // console.log("Of those users, " + candidate_sim_users.length + " have rated at least " + 2 + " movies in common with user " + user.id);

    //Next, compute the cosine similarity between the target user and each of the candidate users, and sort the candidate users by similarity
    let candidate_sim_users_sorted: User[] = [];
    for (let i = 0; i < candidate_sim_users.length; i++) {
        let sim = cosine_mov_mov(user, candidate_sim_users[i]);
        let index = 0;
        if (candidate_sim_users.length > 0) {
            while (index < candidate_sim_users.length && sim < cosine_mov_mov(user, rated_by_users[index]) ) {
                index++;
            }
        }
        candidate_sim_users_sorted.splice(index, 0, candidate_sim_users[i]);
    }
        // console.log("Sorted candidate users: ");
        // for (let i = 0; i < candidate_sim_users_sorted.length; i++) {
        //     console.log("User: " + candidate_sim_users_sorted[i].id);
        //     console.log("Similarity: " + cosine_usr_usr(user, candidate_sim_users_sorted[i]));
        //     console.log("Gave movie " + movie.id + " a rating of " + candidate_sim_users_sorted[i].entries.filter(entry => entry.movieId === movie.id)[0].rating);
        // }
    

        
        

    //Finally, use the k most similar users' weighted ratings of the target movie to predict the target user's rating
    let k = candidate_sim_users.length;
    
    let sum_of_weights = 0;
    let sum_of_ratings = 0;


    for (let i = 0; i < k; i++) {
        if (candidate_sim_users_sorted[i] !== undefined) {
            let sim_user = candidate_sim_users_sorted[i];
            let sim_user_rating = sim_user.entries.filter(entry => entry.movieId === movie.id)[0].rating;
            let sim_user_weight = cosine_mov_mov(user, sim_user);
            sum_of_weights += sim_user_weight;
            sum_of_ratings += sim_user_rating * sim_user_weight;
            // console.log("Weight sum: " + sum_of_weights + " rating sum: " + sum_of_ratings);
        } else {
            k = i;
            break;
        }
    }
    // console.log("Using " + k + " most similar users");

    

    if (candidate_sim_users.length < 1 || sum_of_weights === 0) {
        predicted_rating = user.avgRating();
        // predicted_rating = 3;
        // console.log("No similar users available, using hard rating of " + predicted_rating);
    } else
        predicted_rating = sum_of_ratings / sum_of_weights ;

    if (predicted_rating > 4.5)
        predicted_rating = 5;
    else if (predicted_rating < 1.5)
        predicted_rating = 1;
    
    predicted_rating = Math.round(predicted_rating);


    new_entry.userId = user.id;
    new_entry.movieId = movie.id;
    new_entry.rating = predicted_rating;
    // console.log("Predicted rating for user " + user.id + " for movie " + movie.id + ": " + predicted_rating);
    console.log("Prediction complete");
    return new_entry;
}
    
