# Quiz

- **How do you allocate more CPU for your actor run?**
    - Increasing memories will increase the CPU. More memory means more CPU horsepower.
    - **1024 MB** gives **0.25 CPU** cores. If we increase memory to **2048 MB** then CPU cores we get is **0.5**. 
    - There are multiple ways to allocate more CPU for the actor run:
        - In Apify app, Select **Actors** from the left sidebar menu and select one of your actor and goto **SOURCE** tab where you will find **Developer console** section. Select **Options** and allocate the Memory in Megabytes. For the last two options you need to set up env to null in apify.json, otherwise it will override the variables in the app.    
        - In Apify app, select **Actors** from the left sidebar menu and select one of your actor and goto **SETTINGS** tab and allocate the Memory in Megabytes from the **Default run options** section.
        - We can also specify the memory allocation with the environment variable APIFY_MEMORY_MBYTES in apify.json.
        - When you run the Actor using the post API, you can set the Memory in parameters. example: https://api.apify.com/v2/acts/actorId/runs?token=JCyt3zC9F3zsigH9xHC6QtQYj&timeout=60&memory=256...


- **How can you get the exact time when the actor was started from within the running actor process?**
    - In Apify dashboard, Select a particular actor for which you want exact time and goto **RUNS** tab where you get list which shows all runs of the actor. Here you can see column **Started at** which shows the exact time when the actor was started.
    - Apify.getEnv()["startedAt"] will give you the exact time when the actor was started. Also, you can get all the actor running details from Apify.getEnv().


- **Which are the default storages an actor run is allocated (connected to)?**
    - Each actor run is associated with the Key-value store, Dataset and Request queue.

- **Can you change the memory allocated to a running actor?**
    - No, We cannot change the memory allocated to a running actor. If you need to change the memory, you have to re-run the actor to apply the changes.

- **How can you run an actor with Puppeteer in a headful (non-headless) mode?**
    - We can set Environment variable **APIFY_HEADLESS** to **0**. Also in **Apify.launchPuppeteer** method we can set **headless** to **false** and it will run the actor in headful mode. For Base docker image, we have to select **chrome-xvfb**.

- **Imagine the server/instance the container is running on has a 32 GB, 8-core CPU. What would be the most performant (speed/cost) memory allocation for CheerioCrawler? (Hint: NodeJS processes cannot use user-created threads)**
    - **4096 MB** memory allocation.

### (Bonus - Docker)    

- **What is the difference between RUN and CMD Dockerfile commands?**
    - **RUN:** is an image build step, the state of the container after a RUN command will be committed to the container image. A Dockerfile can have many RUN steps that layer on top of one another to build the image.
    - **CMD:** is the command the container executes by default when you launch the built image. A Dockerfile will only use the final CMD defined. The main purpose of a **CMD** is to provide defaults for an executing container.


- **Does your Dockerfile need to contain a CMD command (assuming we don't want to use ENTRYPOINT which is similar)? If yes or no, why?**
    - The answer depends on the condition how the docker run command is executed. 
    - **Yes:**
        - CMD instruction allows you to set a default command, which will be executed only when you run container without specifying a command.
    - **No:**
        - When the docker container runs with a command, the default command will be ignored, so in this case dockerfile does not need to contatin a CMD command.


- **How does the FROM command work and which base images Apify provides?**
    - The **FROM** instruction specifies the *Parent Image* from which you are building. **FROM** may only be preceded by one or more ARG instructions, which declare arguments that are used in **FROM** lines in the Dockerfile.
    - **Base images Apify provides:**
        - Node.js 12 on Alpine Linux (apify/actor-node-basic)
        - Node.js 12 + Chrome on Debian (apify/actor-node-chrome)
        - Node.js 12 + Chrome + Xvfb on Debian (apify/actor-node-chrome-xvfb)
        - And some BETA versions (If available to use)...