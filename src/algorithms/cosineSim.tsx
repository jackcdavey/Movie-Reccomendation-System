import { User, Movie, Dataset } from '../App';

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

export function cosine_usr_mov(user: User, movie: Movie, dataset: Dataset) {
    let closest_user: User = user;
    let closest_user_sim = 0.0;

    //First, find the most similar user in the dataset to the input user
    for (let i = 0; i < dataset.users.length; i++) {
        let sim = cosine_usr_usr(user, dataset.users[i]);
        if (sim > closest_user_sim && user.id != dataset.users[i].id) {
            //Check if the user in the dataset has a rating for the input movie
            let has_rating = false;
            for (let j = 0; j < dataset.users[i].entries.length; j++) {
                if (dataset.users[i].entries[j].movieId == movie.id) {
                    has_rating = true;
                    break;
                }
            }
            if (has_rating) {
                closest_user = dataset.users[i];
                closest_user_sim = sim;
            }
        }
    }

    //Output the closest user's rating for the input movie
    if (closest_user != user) {
        for (let i = 0; i < closest_user.entries.length; i++) {
            if (closest_user.entries[i].movieId == movie.id) {
                console.log("The most likely rating of movie: " + movie.id + "by user: "+ user.id + "is: " +closest_user.entries[i].rating);
            }
        }
    }
    return 0;
    

    
}
    
