# Quiz

- **Do you have to rebuild an actor each time the source code is changed?**
    - It depends on our use case.
        - If we build actor locally and push it to apify and when we run the actor, apify automatically first build the actor and run.
        - In Apify app, In **Source code** section in **SOURCE** tab for *Multiple source files* **type** and save changes, we need to manually build the actor.
        - And if we use **Git repository** type in **Source code** section in *Source* tab, we can setup Webhook in git to build actor through build API when we push our changes to git repo.


- **What is the difference between pushing your code changes and creating a pull request?**
    - **Push:**
        - Push our local changes to remote branch.
        - Usually we create our own branch *(from master or some othe branch)* and make changes locally and when we push our changes to remote, it will create new branch with same name (if not exist) and push our changes to that branch.
    - **Pull:**
        - Sometimes when we do not have rights on certain branch on remote then we cannot directly push our changes to that branch. We need to make a pull request to that branch and then a branch owner/reviewer check and merge our changes to that branch.
        - Eg. master/Production branch not allow every developer to access it. So we create our own branch, make changes and create pull request to merge our changes to master/production branch.


- **How does the apify push command work? Is it worth using, in your opinion?**
    - **Apify push** command uploads the actor to the Apify platform and builds it there. 
    - This command is used to deploy our actor code to apify platform.
    - Yes, It is worth usingit.  With this single cli command, we can push our code changes to apify platform and check, build and run actor code there. 