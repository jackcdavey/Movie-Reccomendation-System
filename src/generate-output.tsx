import { Dataset, Entry } from "./objects";

export default function generateOutput(dataset: Dataset, entries: Entry[]) {
    let output: string = "";
    //replace each entry in the dataset with the corresponing input entry
    for (let i = 0; i < dataset.entries.length; i++) {
        for (let j = 0; j < entries.length; j++) {
            if (dataset.entries[i].userId == entries[j].userId && dataset.entries[i].movieId == entries[j].movieId) {
                dataset.entries[i].rating = entries[j].rating;
            }
        }
        // console.log(dataset.entries[i].userId + ", " + dataset.entries[i].movieId + ", " + dataset.entries[i].rating);
        let new_entry_string = dataset.entries[i].userId + " " + dataset.entries[i].movieId + " " + dataset.entries[i].rating + "\n";
        output = output + new_entry_string;
    }
    // console.log(output);
    return output;

}
