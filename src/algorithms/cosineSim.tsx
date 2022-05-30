import { User, Movie, Dataset, Entry } from '../objects';

export function cosine_usr_usr(userA: User, userB: User, badUsers: User[]) {
    let userAVal = 0.0;
    let userBVal = 0.0;
    let dot_product = 0.0;

    for (let i = 0; i < userA.entries.length; i++) {
        if (userA.entries[i] != undefined && userB.entries[i] != undefined) {
            if (userA.entries[i].rating > 0 && userB.entries[i].rating > 0) {
                let a = userA.entries[i].rating - userA.avgRating();
                let b = userB.entries[i].rating - userB.avgRating();
                userAVal += Math.pow(a, 2);
                userBVal += Math.pow(b, 2);
                dot_product += (a * b);

            }
        }
    }
    userAVal = Math.sqrt(userAVal);
    userBVal = Math.sqrt(userBVal);
    if (userAVal == 0 || userBVal == 0) 
        return 0;
    return dot_product / (userAVal * userBVal);
}

export function cosine_usr_mov(user: User, movie: Movie, datasets: Dataset[]) {
    let closest_user: User = user;
    let closest_user_sim = 0.0;
    let predicted_rating = 0;
    let new_entry: Entry = new Entry(0, 0, 0);
    let invalid_users: User[] = [];
    invalid_users.push(user);

    //First, find the most similar user in the dataset to the input user
    for (let k = 0; k < datasets.length; k++) {
        for (let i = 0; i < datasets[k].users.length; i++) {
            let sim = cosine_usr_usr(user, datasets[k].users[i], invalid_users);
            let similar_entry_rating: Entry = new Entry(0, 0, 0);

            if (datasets[k].users[i].entries.find(entry => entry.movieId == movie.id) != undefined)
                similar_entry_rating = datasets[k].users[i].entries.find(entry => entry.movieId == movie.id)!;
        
        
            // console.log("similarity rating: " + similar_entry_rating.rating);
            if (sim > closest_user_sim && user.id != datasets[k].users[i].id && similar_entry_rating.rating > 0) {
                //Check if the user in the dataset has a rating for the input movie
                let has_rating = false;
                for (let j = 0; j < datasets[k].users[i].entries.length; j++) {
                    if (datasets[k].users[i].entries[j].movieId == movie.id && datasets[k].users[i].entries[j].rating > 0) {
                        has_rating = true;
                        break;
                    }
                }
                if (has_rating) {
                    closest_user = datasets[k].users[i];
                    closest_user_sim = sim;
                }
                else {
                    continue;
                }
            }
        }
    }

    //Output the closest user's rating for the input movie
    // if (closest_user != user) {
        for (let i = 0; i < closest_user.entries.length; i++) {
            if (closest_user.entries[i].movieId == movie.id) {
                // console.log("The most likely rating of movie: " + movie.id + " by user: " + user.id + " is: " + closest_user.entries[i].rating);
                predicted_rating = closest_user.entries[i].rating;
            }
        }
        //Generate a new entry object for the input user and movie based on the predction
        if (predicted_rating > 0)
            new_entry.rating = predicted_rating;
        else if (Math.round(user.avgRating()) > 0) {
            new_entry.rating = Math.round(user.avgRating());
            console.log("No data, using avg rating: " + new_entry.rating);
        }
        else{
            new_entry.rating = 1;
            console.log("No data, using low avg rating: " + new_entry.rating);
        }
        new_entry.userId = user.id;
        new_entry.movieId = movie.id;
        console.log(new_entry.userId + ", " + new_entry.movieId + ", " + new_entry.rating);
        return new_entry;
    // }

    



    
    

    
}
    
