# Skill Market: Building AE's Internal AI Skill Marketplace

*TL;DR: I proposed and built Skill Market, a web app where any AE employee can upload, browse, and download AI skills with no technical knowledge required. What started as a personal side project turned into an official AE AI Programme initiative, sponsored at leadership level, that I had to align across a dozen other AE initiatives and stakeholders to actually ship.*

## A skill market, why?

At AE, people were already building useful AI skills, prompts, chatbot configs, small workflow automations, but they were stuck on individual laptops or shared ad-hoc over Teams. If two people on different projects both figured out a good way to summarize client meeting notes, neither of them would ever find out the other one existed. Everyone kept re-inventing the same wheel. For developers this wasn't a big problem, they already had a Github repo with skills for quite some time. But pointing non-techy people to a Github repo and saying: "Yeah just put it there for other people to find", is not really going to work. And even for techy people, a repo full of Skill files, near duplicates, without any governance or overview, is not really scalable across the organization.

So the idea for Skill Market was simple: a place where any employee (technical or not) can upload a skill, browse the catalog by category and download whatever looks useful.

### What's built vs. what's still ahead

What exists today is deliberately the thin slice: upload a skill, browse the catalog by category and download it.

The bigger idea, though, is further along in my head than in the codebase. The vision is a marketplace that works less like a file store and more like a living system: team leads/moderators who can "verify" the good skills so they surface above the noise, teams that curate their own recommended skill packages, semantic search so "something that summarizes meeting notes" actually finds the right skill instead of requiring the exact right keyword, and eight native skills (browse, install, update, create, publish, share...) that ship with the platform itself, so the very first thing a new user does inside their AI tool is use Skill Market to learn Skill Market. Probably one of the nicest ideas is Skills over MCP, which I will expand upon in the next section.

In summary, the tool will become more of a governance layer on top of being able to easily share skills with each other.

### Skills over MCP

How do people install skills nowadays? They download it to their local PC and place it in whatever folder their coding agent needs it in. For the web based agents, they upload a file or a ZIP, or make it directly in the UI. Both add some extra friction and make it harder for non-techy people. Also, most people aren't obsessed with hyper-optimizing their AI setup and probably won't even bother adding skills at all. That where I had the idea to expose them over MCP. It solves the problem of having all these different installation paths, it could solve the problem of having your context littered with dozens of skills (as you could just search over MCP the exact skill that might be relevant instead of seeing all descriptions), installation can be done at admin level (IT installing the MCP for everyone in the organisation)... Of course, I wasn't the first to think of this, but still a nice little idea.

## Some takeaways for me

The technical part was, honestly, the easy bit. What actually taught me something was everything around it.

- **Pitching an idea internally is a different skill than building it.** Going from "I have an idea" to "this is an official AE initiative with a sponsor" meant writing a real problem statement, a business case's worth of justification, and sitting with stakeholders who each cared about a completely different slice of the same project.
- **Scoping "what this is NOT" is as important as scoping what it is.** It is really easy to come up with 100 extra features to add to this skill market idea, but YAGNI was my slogan here.
- **Coordinating across an organization is sometimes painfully slow, but necessary.** There were 3 other people doing something similar, we had to talk to 20 different people who all had different ideas, we had to coordinate with other AI initiatives that would launch together with ours, pass the architectural board... I probably could have built the application 100x in the time it took to do this, but it wouldn't have mattered. Everybody has to be on board with what your building, otherwise its just a nice demo that no one will actually use.
