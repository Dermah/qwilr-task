# Report

## Process

### Key decisions

- Chose a stack that I knew well (Typescript, React, GraphQL).
  - [`react-jss`](https://github.com/cssinjs/react-jss) for easy styling inside JS.
  - [Material UI](https://material-ui.com) front end library for ease of UI creation and because it works well with `react-jss`.
  - [Apollo Client using Apollo Boost](https://github.com/apollographql/apollo-client/tree/master/packages/apollo-boost) for simple client side app data caching.
- Bootstraped with solid and flexible create scripts ([`create-react-app-typescript`](https://github.com/wmonk/create-react-app-typescript) and [`graphql-cli minimal`](https://github.com/graphql-cli/graphql-cli)).
- I aimed to build towards an MVP. Implementing full but small features in the front and back end simultaneously was the approach to building the app.
  - To prevent scope creep in this framework, I was lazy wherever possible. For example, did not use a database since it could be held easily in memory and persistance was not a requirement.
- Used [IEX Web API](https://iextrading.com/developer/), a free and feature filled American Stocks API
  - Relatively high rate limit (~100 requests/second) that should be enpugh for one user.
  - No requirement for authentication

### Process

- 19th Sept
  - 8pm - 8:45pm: Researched appropriate bootstrap scripts to allow quick iteration in a comfortable stack.
  - 8:45pm - 10pm: Configured dependencies and environment to work as desired.
  - 10pm - 12am: Began adding features on front and back end to get to an "MVP" stage
    - Basic page layout
    - Add and remove funds in API and front end
- 23rd Sept
  - 9:45pm - 1am: Worked on the front end back end so that full features are added sequentially, while building reuseable components that will be helpful later
    - Pass through IEX API data
    - Add today's market winners (made generic Stock Card UI component)
    - Add ability to purchase stocks (made generic stock management mutation and front end GraphQL query)
    - Refactor data management to look a bit like a database ORM
    - Show the user's holdings
- 24th Sept
  - 9:30pm - 10:45pm: Implemented stock lookup and selling features. Cleaned up UI to make it more visible that back end work is being done when clicking things, significantly improving UX.

Total time: ~8.5 hours

## Shortcuts

- There is only one user of the app, and they are always logged in. This significantly simplified data management and resolution.
- There is no real database, data is saved in simple JS data structures held in memory.
- Most data objects use the stock code as their ID. This means `Holding`s and `Stock`s can have the same ID, preventing the possibility for global ID lookups that are a [common pattern](https://facebook.github.io/relay/graphql/objectidentification.htm) in GraphQL servers.
- Terrible floating point arithmetic in the back end is masked by rounding off the numbers to two decimal points in the front end. This could lead to inaccuracies when buying and selling and should be fixed by using something like [`big.js`](https://github.com/MikeMcl/big.js/).
- The `buyStocks` mutation can also sell stocks by 'buying' a negative amount of stocks. To prevent annoying developers and API consumers, this should be renamed or split into two mutations.
- The only point that Stock IDs are normalised to uppercase is when they're coming in to the `buyStocks` mutation. They should be normalised at the 'database' level to prevent duplicate data being stored by other future mutations.
- Silent failure (no error messages) in the front end when a mutation fails (usually due to insufficient funds or stock quantity). It's assumed (incorrectly) that you won't try to buy or sell if you physically can't.
- Some bad typing, usually when it came to handler functions composed using `recompose` in the front end.
- If an API consumer followed the graph too deep through Holding -> Stock -> Holding -> Stock ..., or made a lot of stock lookups in the same request, they might hit the IEX rate limit. It is assumed they wouldn't need to.
- Inconsistent use of `react-apollo`'s `graphql` HOC and new `Query` and `Mutation` render-prop components. I should have stuck to one or the other.
- Inconsistent placement and use of UI objects, for example loading spinners are all over the place.
- No tests.

## Problems that slowed me down and how I overcame them

- I have bootstraped quite a few JS GraphQL servers perviously, but it's been a few months since I last did one. That was long enough for everything to change in the JS landscape again and I got lost trying to find an ideal setup (Typescript or ES6 JS, Apollo Server, no extra unnecessary Prisma junk). Suprisingly, live reload wasn't included in this solution so I spent some time adding it in to give me a time and sanity benefit over the rest of the project.
- When implementing things feature by feature as described in the first section, I was easily distracted by trying to perfect the UI and make it nicer to use. Since the most important outcome was to deliver the requirements with or without polish, I had to catch myself and move on even when I wasn't perfectly happy with the solution.
- `create-react-app-typescript` seems to include some overly aggressive linting rules for most projects, let alone a quick MVP. I turned off the most annoying rules, but I left on one rule that caused me to lose a decent amount of time rearranging imports to be alphabetical.

---

Sputnik Antolovich, 2018
