import {Queue} from "bullmq";
import redis from "./redis";

export const videoQueue = new Queue("videoQueue", {
    connection :redis, 
    defaultJobOptions: {
        attempts: 3,
        backoff: {
            type: "exponential",
            delay: 5000
        },
    },
});