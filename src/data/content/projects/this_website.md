# Personal Website Chatbot
    
*TL;DR: I made a website with only a chatbot interface able to answer questions about my personal projects, academic and professional career*

## The idea
I wanted to have my own portfolio website for some time already, but I wanted it to be different. I saw these nice examples of people making 3D websites using Three.js ([Bruno Simon](https://bruno-simon.com/), [Ida Lindgren](https://medium.com/@ida-lindgren/from-inspiration-to-creation-how-i-built-my-3d-interactive-portfolio-856182f255c9)...), but as I am absolutely not a designer that seemed not the best idea for me. So I started thinking, designers make cool 3D portfolio websites, what do AI engineers make? Aha they make chatbots! My creative genius is clearly unmatched...

The website needed the following things to be a successful:
- The chatbot must be able to answer questions about my portfolio (duh)
- It should be simple to use and clear for the use what it can ask
- It should be pretty cheap and easy to maintain (I don't want to spent money on a pet project that will be visited by my mother and webscrapers)
- The information the chatbot provides should be factually correct
- The chatbot should be fun to use and have some character (don't want people to think I'm boring)

Based on these detailed requirements, the fun part began!

## The implementation
To keep the project in the free tier as much as possible I went looking for free hosting solutions. After some AI-assisted researching (one Perplexity question), I found that Cloudflare seemed like a good solution. It has a generous free tier of 100k requests per day for Workers, which is plenty for the AI bots scraping my website. Cloudflare also has support for SQLite and vector indexes with again high enough limits within the free tier.

I started from the agents starter template from Cloudflare which already gave me everything needed to have a working chat agent with tools deployed on Cloudflare. I used Figma Make to generate me a nice UI, as I really have no aesthetic intuition or design talent. But for the 2 minutes I spent on it, not that bad UI I think...
