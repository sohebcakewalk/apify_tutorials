# Quiz

- **What types of proxies does the Apify Proxy include? What are the main differences between them?**
    - **There are three types of proxies does the Apify Proxy include:**
        - Datacenter proxy 
            - Datacenter proxies are a cheap, fast and stable way to mask your identity online. When you access a website using a datacenter proxy, the site can only see the proxy center's credentials, not yours.

        - Residential proxy
            - Residential proxies use IP addresses assigned by Internet Service Providers to the homes and offices of actual users. Unlike datacenter proxies, traffic from residential proxies is indistiguishable from that of legitimate users.

            - This solution allows you access to a larger pool of servers than datacenter proxy. This makes it a better option in cases when you need a large number of different IP addresses.


        - Google SERP proxy
            - Google SERP proxy allows you to extract search results from Google Search-powered services. It allows searching in various countries and to dynamically switch between country domains.

            - Google SERP proxy can only be used for Google Search and Shopping. It cannot be used to access other websites.


- **Which proxies (proxy groups) can users access with the Apify Proxy trial? How long does this trial last?**
    - **Datacenter** proxy and **Google SERP** proxy
    - Trial last for 30 days.


- **How can you prevent a problem that one of the hardcoded proxy groups that a user is using stops working (a problem with a provider)? What should be the best practices?**
    - We can prevent a problem that one of the hardcoded proxy group that a user is using stops working either by providing multiple proxy groups or use auto proxy groups by not using any hardcoded proxy groups.
    - The best practices, We do not need to use proxy group in **ProxyConfigurationOptions**. If we do not provide any group then the proxy will select the available groups automatically.


- **Does it make sense to rotate proxies when you are logged in?**
    - If we are logged in then proxy rotation is not recommended. We can use a long-living sessions.


- **Construct a proxy URL that will select proxies only from the US (without specific groups).**

        const proxyConfiguration = await Apify.createProxyConfiguration(
            {
                countryCode: 'US'
            });
        const proxyUrl = proxyConfiguration.newUrl();


- **What do you need to do to rotate proxies (one proxy usually has one IP)? How does this differ for Cheerio Scraper and Puppeteer Scraper?**
    - We need to use Sessionpool to rotate proxies and just set useSessionPool and persistCookiesPerSession properties are true in crawler.

            const cheerioCrawler = new Apify.CheerioCrawler({
                useSessionPool: true,
                persistCookiesPerSession: true
            });

    - **Cheerio:** Every request rotates by default.
    - **Puppeteer:** It can rotate only when you restart the browser which by default happens every 100 requests.


- **Try to set up the Apify Proxy (using any group or auto) in your browser. This is useful for testing how websites behave with proxies from specific countries (although most are from the US). You can try Switchy Omega extension but there are many more. Were you successful?**
    - I created new profile in **Switchy Omega** interface and put **country-US** as username and then i try to access google.com in incognito window of chrome browser then it's worked and i can see **United States** in the bottom of the google search page.

    - I also tried with **auto** as username and try to access google.com in incognito window which works fine.
    
    - But if try with another profile in **Switchy Omega** interface and put **groups-StaticUS3** as username and then i try to access google.com in incognito window of chrome browser, sometime it ask for captcha and sometimes i get message **This site can’t be reached**.
    


- **Name a few different ways a website can prevent you from scraping it.**

        1. IP detection
        2. IP rate limiting
        3. Browser detection
        4. Tracking user behavior


- **Do you know any software companies that develop anti-scraping solutions? Have you ever encountered them on a website?**
    - No.