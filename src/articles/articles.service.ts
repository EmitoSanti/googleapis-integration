"use strict";

import { Article } from "./article";

export class ArticlesService {
    static migrationArticles(articles: any): Promise<Boolean> {
        console.log("ArticlesService migrationArticles()");

        return new Promise<Boolean>((resolve, reject) => {
            try {
                Article.insertMany(articles); // https://docs.mongodb.com/manual/reference/method/db.collection.insertMany/
                console.log("Finish migration");
                resolve(true);
            } catch (error) {
                console.log("error: " + error);
                reject();
            }
        });
    }

    static dropArticles(): Promise<Boolean> {
        console.log("ArticlesService dropArticles()");

        return new Promise<Boolean>((resolve, reject) => {
            try {
                Article.collection.drop();
                console.log("Article Collection is dropped");
                resolve(true);
            } catch (error) {
                console.log("error: " + error);
                reject(error);
            }
        });
    }
}