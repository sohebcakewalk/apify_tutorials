# Quiz

- **Where and how can you use JQuery with the SDK?**
    - jQuery (crawler) aka Cheerio crawler downloads each URL using a plain HTTP request, parses the HTML content using Cheerio and then invokes the user-provided CheerioCrawlerOptions.handlePageFunction to extract page data using a jQuery-like interface to the parsed HTML DOM.
    - Since CheerioCrawler uses raw HTTP requests to download web pages, it is very fast and efficient on data bandwidth

- **What is the main difference between Cheerio and JQuery?**
    - Cheerio is a server-side version of the jQuery library. It does not require a browser but instead constructs a DOM from a HTML string. It then provides the user an API to work with that DOM.
    - jQuery runs in a browser and attaches directly to the browser's DOM. Where does cheerio get its HTML
    - Unlike jQuery, Cheerio doesn't have access to the browser’s DOM. Instead, we need to load the source code of the webpage we want to crawl. Cheerio allows us to load HTML code as a string, and returns an instance that we can use just like jQuery.

- **When would you use CheerioCrawler and what are its limitations?**
    - Cheerio Scraper is ideal for scraping web pages that do not rely on client-side JavaScript to serve their content and can be up to 20 times faster than using a full-browser solution such as Puppeteer.
    - It does not employ a full-featured web browser such as Chromium or Firefox, so it will not be sufficient for web pages that render their content dynamically using client-side JavaScript
    
- **What are the main classes for managing requests and when and why would you use one instead of another?**
    - There are two main classes which are **RequestList** or **RequestQueue** which derived from **Request**
    
    #### **RequestList**
    - Represents a static list of URLs to crawl. The URLs can be provided either in code or parsed from a text file hosted on the web.
    - Once you create an instance of RequestList, you need to call the RequestList.initialize() function before the instance can be used. After that, no more URLs can be added to the list.

    #### **RequestQueue**
    - Represents a queue of URLs to crawl, which is used for deep crawling of websites where you start with several URLs and then recursively follow links to other pages
    - Unlike RequestList, RequestQueue supports dynamic adding and removing of requests

- **How can you extract data from a page in Puppeteer without using JQuery?**
    - Page function is a single JavaScript function that enables the user to control the Scraper's operation, manipulate the visited pages and extract data as needed.

- **What is the default concurrency/parallelism the SDK uses?**
    - For **minConcurrency**, default value is **1**
    - For **maxConcurrency**, default value is **1000**