# Quiz

- **What is the relationship between actor and task?**
    - Tasks help you prepare the configuration of an actor to perform a specific job.
    - Tasks enable you to create multiple configurations for a single Actor and then run the selected configuration directly from the Apify platform, schedule or API.
    - We can create tasks on an Actor. When we create a task, we can setup options and input for the actor.
    - If we leave the configuration empty and run the task, actor's default configuration will be used.


- **What are the differences between default (unnamed) and named storage? Which one would you choose for everyday usage?**
    - Named and Unnamed storages are the same in all regards except their retention period.
    - **Named** storage are retained indefinitely while **Unnamed** storage expire after 7 days unless otherwise specified.
    - For everyday usage we should use default (unnamed) storage because they linked to specfic run which make them easy to find for that run and also they cleared after their retention period which is usually 7 days so it will be storage cost effective.


- **What is the relationship between the Apify API and the Apify client? Are there any significant differences?**
    - The Apify API v2 provides programmatic access to the Apify platform.
    - With API we can access the Tasks, Actors, Schedules and Storages with different endpoints for different purposes like run, get, create, update, delete etc.
    - In Node.js the APIs can be accessed through Apify client, to simplify the developement of apps that depends on Apify platform. It correspond to the API endpoints and have the same parameters.


- **Is it possible to use a request queue for deduplication of product IDs? If yes, how would you do that?**
    - Yes, Request Queue automatically manages the duplicate productIds, it keeps track of the processed product IDs, if it already processed then it will ignore the duplicate one.


- **What is data retention and how does it work for all types of storage (default and named)?**
    - Data retention means how long the data in storages will be available in Apify.
    - Unnamed storages will expire after 7 days (based on the subscription plan of a user, default is 7).
    - Named storages will retain permanently untill we delete it.
    - If we want to preserve a data in storage, simply give it a name and it will be retained indefinitely.


- **How do you pass input when running an actor or task via the API?**
    - We can pass the input using POST payload when running an actor or task via the API.
    - If we don't pass input, it will get the default input from INPUT.json file in the key-value store.