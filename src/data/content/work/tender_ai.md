# Teaching a Machine to Read Public Tenders

*TL;DR: As an AI engineer and architect at AE, I spent a short but intense stretch helping build Tender AI, a system that ingests tenders in any format and proposes the right product for every line, using a matching engine trained on historical data. I designed and implemented that matching engine.*

## The problem

Public bodies such as municipalities, hospitals and schools can't just place an order. They publish a tender with a long list of items they need, often hundreds or thousands of lines. Each line is written in the buyer's own words, sometimes in another language, and often describes a product by what it does rather than what it's called. A supplier who wants to bid has to match every line to a product in its own catalogue. Until now, that work was done by hand, line by line, by a few experienced people.

I spent a short but intense stretch on a project to change that. Together with colleagues at AE, I helped build the first version of **Tender AI**, a system that reads historical and incoming tenders and proposes the right product for each line.

## Three problems, three building blocks

**1. Reading anything.** Tenders arrive as PDFs, Excel sheets, scans and images, and no two look alike. The first building block turns all of them into one standard data model. After that, everything downstream works with clean, structured data.

**2. Matching.** A tender line and a catalogue product share no common key, so this is a retrieval problem, not a lookup. It's also where I spent most of my time. The engine combines several signals:

- how similar the buyer's description is to the products and to past tender lines
- what happened in comparable historical tenders
- the award criteria
- the properties of the product itself

It runs several vector searches and blends the results into a single score per candidate. The weights behind that score were learned from historical data, not set by gut feeling. Each proposal comes with a score and an explanation, so a human can see why the system suggested it.

**3. A tool people actually use.** A simple front-end lets sales upload documents, review the proposed matches, pick the right candidate or correct it, and push the result to the internal system. The goal was never to remove the expert. It was to make their judgement count on the lines that need it, instead of on every line.

## What I took away

- **Retrieval beats cleverness.** Most of the quality came from getting the right candidates in front of the scorer, using several complementary views of the same line. A bigger model wasn't what moved the needle.
- **Learn from history.** Years of past tenders are a goldmine. Tuning weights on real outcomes gave a defensible, measurable way to improve the matching, and a good answer to the question "how do we know it's better?"
- **Keep the human in the loop.** Showing scores and explanations builds trust and speeds up review. It also turns every correction into data that can improve the system.

It was a short time, but a rewarding one. I got to design a system end to end and work closely with a team that knew the domain.
