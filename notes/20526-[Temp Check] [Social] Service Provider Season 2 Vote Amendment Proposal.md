# Post #1 by James
Posted at: 2025-04-03T15:37:45.669Z

# [Temp Check] [Social] Service Provider Season 2 Vote Amendment Proposal

## Abstract

EP 6.3 was passed with a budget of $4.5M for 2025 on the 25th of February and pertains to Service Provider budgets and allocation mechanisms for 2025. After broad discussion between delegates, working groups and service providers, a proposed change to the voting process is now being presented for vote.

## Vote

This is a proposed amendment to the evaluation criteria for Service Providers. On April 1st there was an Delegate All Hands meeting in which many delegates expressed the desire to be able to fine tune their vote in order to express preference over not only the teams, but also their respective budgets. This was followed by extensive discussion between delegates, working groups and Service Providers, leading to the below amendment:

*The goal here is to propose a new rule change while keeping the same properties as having a single budget be decided in one simultaneous vote.*

### Current Evaluation Process, as voted on snapshot

> **Evaluation Process**
> 
> Projects are assessed in ranked order:
> 
> * If “None Below” is reached, evaluation stops.
> * If the candidate has been part of the Service provider program for at least a year AND if the extended budget fits within the remaining two-year stream budget, assign to the two-year stream . Subtract the extended budget from the two-year stream budget.
> * Assign to the one-year stream if:
>   + The extended budget fits the one-year budget. Subtract its extended budget from the one-year stream.
>   + OR if the basic budget fits the one-year budget, subtract the its basic budget from the one-year stream.
>   + If none of these conditions are met, the project is eliminated.

### New proposed rule amendment

The vote will present both extended and basic budgets as separate options and a given voter can pick *either* budget to rank their candidates. They do not need to rank both budget options separately, as they are considered the same candidate.

The rank of each candidate will be the rank of it’s highest ranked budget option, according to a Copeland methodology (using average support as a tiebreaker). Then a pairwise comparison will be made between the two budget options and the preferred one will be set as its selected budget.

### Vote Processing Algorithm

1. **Votes Preprocessing**:
   
   * For providers with both basic and extended budget options, the algorithm enforces the lowest option to be ranked immediately after the highest option (of the same provider).
   * If a provider has only one budget option, no special enforcement is needed for that provider.
   * This grouping ensures accurate pairwise comparisons between different between different providers and then budget options from the same provider.
2. **Pairwise Comparisons (copeland)**:
   
   * For each pair of candidates (provider), we calculate the total voting power supporting each over the other.
   * A candidate wins a head-to-head matchup if the total voting power ranking them higher exceeds that of their opponent.
   * Each win contributes 1 point to a candidate’s Copeland score.
   * The pairwise comparison between basic and extended must also be stored, for defining the preferrence on the budget.
3. **“None Below” Handling**:
   
   * The “None Below” option serves as a cutoff point in a voter’s ranking.
   * Candidates ranked above “None Below” are considered ranked.
   * Candidates ranked below “None Below” are considered unranked by that voter.
   * A ranked candidate always wins against an unranked candidate in pairwise comparisons.
4. **Scoring and Ranking**:
   
   * Candidates are ranked by their Copeland score (descending), with average support as a tiebreaker.

### Allocation Process

1. **Budget Type Determination**:
   
   * Each provider’s budget (basic or extended) is determined by their internal head-to-head match result.
2. **Stream Allocation**:
   
   * Candidates are processed in Copeland ranking order.
   * Candidates that are in top 5 and were selected in SPP1, are elegible for the 2-year stream.
   * All other candidates receive allocations from the 1-year stream.
   * From top to bottom, try to fit projects in the 2 year stream budget, and then on the 1-year stream budget using the standard knapsack algorithm, stopping once budgets are exhausted or None Below is reached.
   * If a service providers extended scope got a majority vote over basic scope and the extended scope doesn’t fit into the remaining 1-year budget but the basic budget does, then the given service provider’s basic budget is included.
   * If a candidate is ranked below “None Below”, they’re rejected regardless of budget availability.
3. **Budget Transfer Mechanism**:
   
   * After processing the top 5 candidates, any remaining 2-year budget transfers to the 1-year stream. Final 1-year budget = (Initial 1-year budget) + (Leftover 2-year budget).
4. **Rejection Criteria**:
   
   * A candidate is rejected if:
     + They’re ranked below the “None Below” option
     + There’s insufficient budget

## Updated Timelines

The initial proposal stated a submission deadline of March 31st, and vote to begin *soon* after that. Below is the proposed timeline for the amended process:

* This vote will be conducted over the next 5 days. Then, if the vote is successful MetaGov will be interfacing with voting UI teams to ensure sufficient testing and timelines before a the final SPP vote.

## Conclusion

If this amendment proposal passes, the MetaGov working group, delegates and governance UI providers will enact the updated proposal process.

We would like to thank everyone who has taken the time to be involved in this discussion and have been blown away by the level of alignment & productivity throughout. Extra thanks to AVSA.eth who drafted this updated voting process! ![:unicorn_face:](https://discuss.ens.domains/images/emoji/twitter/unicorn_face.png?v=12 ":unicorn_face:")

---

# Post #2 by nick.eth
Posted at: 2025-04-03T16:01:33.295Z

![](https://discuss.ens.domains/user_avatar/discuss.ens.domains/james/48/506_2.png) James:
> The rank of each candidate will be the rank of it’s highest ranked budget option, according to a Copeland methodology (using average support as a tiebreaker).

It’s unclear to me how this algorithm is supposed to work. Is this intended to:

a) Describe how individual ballots are preprocessed before the voting algorithm is executed, or  

b) Describe a modification to the Copeland algorithm that changes how ballots are compared, or  

c) Describe a postprocessing step on the outcome of the Copeland algorithm?

I think a more thorough and mechanistic explanation of the intended modification is needed here, as the current description seems ambiguous, at least to my uneducated eye.

![](https://discuss.ens.domains/user_avatar/discuss.ens.domains/james/48/506_2.png) James:
> Then a pairwise comparison will be made between the two budget options and the preferred one will be set as its selected budget.

Likewise I don’t understand what’s being described here; earlier it says that each user should vote for only one of the two options, so won’t any attempt to do a pairwise comparison between them fail to produce a sensible result?

I’m concerned that this change, coming as it does at the last minute and further complicating an already novel and complex voting system runs a high risk of introducing errors in the algorithm, specification, or implementation in UIs that compromise the integrity of the result. This is further compounded by pushing these changes through under urgency.

I would personally be much more comfortable with a change that preserves the existing voting algorithm such as allowing nominees to separate their proposals into more than one line item, or a decision to take this as input for the next round. We could also choose to institute a “short round” of 6 months under the current rules while alternative options are explored and pursued.

---

# Post #3 by James
Posted at: 2025-04-03T16:28:04.633Z

The parts quoted were from [@AvsA](/u/avsa)’s post so ill let him reply ![:slight_smile:](https://discuss.ens.domains/images/emoji/twitter/slight_smile.png?v=12 ":slight_smile:")

---

# Post #4 by AvsA
Posted at: 2025-04-03T16:31:47.596Z

![](https://discuss.ens.domains/user_avatar/discuss.ens.domains/nick.eth/48/712_2.png) nick.eth:
> Likewise I don’t understand what’s being described here; earlier it says that each user should vote for only one of the two options, so won’t any attempt to do a pairwise comparison between them fail to produce a sensible result?

We are inferring two questions from the single ranked choice: the rank of all candidates and which budget they will have.

Let me try a better wording:

* A Copeland score will be calculated for every **company** (*NOT* their individual **budgets**). This will be done by considering only the highest ranked budget for each company on the ballot as the intended rank for that company. This, of course, can be abstracted away in the UI.
* For each **company**, we will also make a direct comparison on which of their **budget** is the most preferred one. This will be their *selected budget* for the remainder of the algorithm.
* Once the overall rank is created and each budget selected, the algorithm runs even simpler than before. We try to fit each company on the two-year stream, then in the one-year stream and if it doesn’t we move to the next, until we reach “NONE BELOW”

Ranking companies on Copeland instead of individual budgets is important because that particular algorithm rewards uncontroversial candidates. This is beneficial in elections if there are two major candidates (call them red and blue) which are loved by nearly half of the population and hated by the other, which require voters to pick the “least bad”. Copeland in that situation would reward a third candidate which isn’t loved by anyone but considered acceptable by most. In a case in which a single candidate is represented on the ballot by two entries who people have strong opinions on, then the algorithm will “see” that as a controversy.

![](https://discuss.ens.domains/user_avatar/discuss.ens.domains/james/48/506_2.png) James:
> Primary service provider vote will go live on **April X** and will be live for voting for 5 days, ending on **April X**.

I would not push any hard date, but make it dependent on a successful implementation by teams (7 days without finding a bug between two independent implementations, etc). This won’t be happening by April.

---

# Post #5 by nick.eth
Posted at: 2025-04-04T07:37:00.330Z

![](https://discuss.ens.domains/user_avatar/discuss.ens.domains/avsa/48/1689_2.png) AvsA:
> We are inferring two questions from the single ranked choice: the rank of all candidates and which budget they will have.
> 
> Let me try a better wording:
> 
> * A Copeland score will be calculated for every **company** (*NOT* their individual **budgets**). This will be done by considering only the highest ranked budget for each company on the ballot as the intended rank for that company. This, of course, can be abstracted away in the UI.
> * For each **company**, we will also make a direct comparison on which of their **budget** is the most preferred one. This will be their *selected budget* for the remainder of the algorithm.
> * Once the overall rank is created and each budget selected, the algorithm runs even simpler than before. We try to fit each company on the two-year stream, then in the one-year stream and if it doesn’t we move to the next, until we reach “NONE BELOW”

This makes a lot more sense, thank you. My concerns about implementing this in a hurry, and the complication it adds to an already novel and complex voting algorithm remain, however.

![](https://discuss.ens.domains/user_avatar/discuss.ens.domains/avsa/48/1689_2.png) AvsA:
> Ranking companies on Copeland instead of individual budgets is important because that particular algorithm rewards uncontroversial candidates. This is beneficial in elections if there are two major candidates (call them red and blue) which are loved by nearly half of the population and hated by the other, which require voters to pick the “least bad”. Copeland in that situation would reward a third candidate which isn’t loved by anyone but considered acceptable by most. In a case in which a single candidate is represented on the ballot by two entries who people have strong opinions on, then the algorithm will “see” that as a controversy.

This doesn’t make sense to me. The algorithm doesn’t know how strong someone’s opinion is, only the order they rank things.

Ranking projects is semantically different to ranking companies, for sure - but Copeland should be equally competent at ranking any sort of thing competing for resources. Allowing companies to specify multiple independent projects if they wish to have them evaluated separately adds the expressiveness delegates have asked for, more comprehensively than the proposed change, and doesn’t require any changes to the voting algorithm.

Here’s an example: There are two service providers, and a budget of $1M. Provider one is proposing to use the entire budget to accomplish two projects. Project one is universally agreed to be absolutely essential to ENS. Project two is of niche usefulness at best. Provider two has a single project, and wants $500k for it; the project is important, but not as important as project one.

In this scenario, we have to either choose projects One and Two, or project Three. We can’t choose One and Three, even though there’s budget to cover it. We can almost get this expressiveness with ‘basic’ and ‘extended’ scopes, but only if Provider One divides their budget up accordingly, and this isn’t possible if a provider has more than two projects on offer.

Further, it’s clear that both providers should prefer this system. Provider One has to either take the gamble on asking for the full budget (and get all or nothing), or give up on Project Two to improve their odds. Provider Two sees their more popular project being hedged out by a less popular one because of the bundling. Again, Basic/Extended scopes give a similar result but only in this simplified case.

---

# Post #6 by James
Posted at: 2025-04-04T08:37:15.352Z

I’d be super interested in if any of the other delegates or service providers share Nicks concerns.

I know there’s been at least 3 independent meetings between delegates and service providers where there was agreement that allowing voters to differentiate between basic and extended scope is a good idea!

---

# Post #7 by clowes.eth
Posted at: 2025-04-04T10:30:42.403Z

![](https://discuss.ens.domains/user_avatar/discuss.ens.domains/james/48/506_2.png) James:
> there was agreement that allowing voters to differentiate between basic and extended scope is a good idea

I think this is a good idea. I think this is preferential to what was initially proposed. My interpretation was that all delegates on the various calls about this were in agreement.

![](https://discuss.ens.domains/user_avatar/discuss.ens.domains/nick.eth/48/712_2.png) nick.eth:
> Allowing companies to specify multiple independent projects if they wish to have them evaluated separately adds the expressiveness delegates have asked for

As I said on Telegram, I **also agree with this**. Allowing companies to express multiple different products and to split things as deliverables **is** expressive. There is value in a voting mechanism that does not throw the baby out with the bath water when delegates think that the totality of a companies ask is excessive (in the current setup) but acknowledge that specific elements are a huge value add to ENS.

That said, my understanding of delegate’s opinion (from the calls) was that the proposed modifications are conceptually small enough **to not** necessitate drastic changes to Service Provider applications that have been prepared and submitted. There will be a period when applicants **can** change their applications but they do not **have** to.

My understanding is that more fundamental changes to program design will be iterated on for the **next** iteration of the program specifically to avoid rushing anything in the here and now.

---

> **TL;DR** - I am in favour of these proposed changes. They are better than was was previously proposed albeit not perfect.

---

# Post #8 by slobo.eth
Posted at: 2025-04-04T12:15:19.089Z

Given how complex this is, it would be great to see a live demo of “Voting Experience A” vs. “Voting Experience B,” then vote.

I suspect I’m not the only one who isn’t confident that they fully grok what’s being proposed.

---

# Post #9 by James
Posted at: 2025-04-04T14:00:02.221Z

On both of the last SPP calls there’s been demonstrations from [@alextnetto.eth](/u/alextnetto.eth) showing this displayed in a very straightforward way. As well as team members from Lighthouse and Agora stating that they’re spinning up this UI.

---

# Post #10 by brantlymillegan
Posted at: 2025-04-04T14:07:50.642Z

Let’s say someone is the last in line to get funded. Their Extended scope got the majority vote over Basic scope. But their Extended scope doesn’t fit in the remaining budget, but their Basic Scope does. In such a case, should we default to someone’s Basic scope?

---

# Post #11 by slobo.eth
Posted at: 2025-04-04T14:48:46.176Z

To clarify my post after my conversation with [@James](/u/james), what I mean by demo is a place where service providers and delegates can run simulations. This does not need to be a full blown UI. A spreadsheet would do or even a script, where one can enter:

**Inputs**  

Budget: 1,000,000

Applicants: A- basic, A - extended, B-basic, C-basic C-extended…

Voters: let’s say 10 of them, with varying voting power

Section to simulate the vote.

Section to show the result, that updates based on inputs.

This way we can turn words into code/algos. This would be helpful to game out edge cases.

I also realize this may not be feasible, so this is a comment not a request.

---

# Post #12 by AvsA
Posted at: 2025-04-04T16:11:09.182Z

![](https://discuss.ens.domains/user_avatar/discuss.ens.domains/nick.eth/48/712_2.png) nick.eth:
> Ranking projects is semantically different to ranking companies, for sure - but Copeland should be equally competent at ranking any sort of thing competing for resources.

Think of an extreme case in which an election runs in which company A and B presents a single budget and company C presents 3 budgets. Now the total of possible pairwise comparisons is 10, but of these only 3 are between different companies. It means that beating A or B will get 1 point while beating C gets you 7 points. Suppose C1 is considered the strongest candidate but C2 and C3 are the weakest. In this case, A and B get each 2 points for beating these candidates, and now C has to beat its own budgets in order to make up for it.

It’s not the end of the world, but this might be enough for candidates simply not to put forward a second budget.

![](https://discuss.ens.domains/user_avatar/discuss.ens.domains/nick.eth/48/712_2.png) nick.eth:
> Allowing companies to specify multiple independent projects if they wish to have them evaluated separately adds the expressiveness delegates have asked for, more comprehensively than the proposed change, and doesn’t require any changes to the voting algorithm.

Something which is interesting is that the UI that Blockful is working on, is backwards compatible with Snapshot because it enforces those decisions on the front end. When you drag a Company, you’re actually dragging all the budget entries, and the “toggle” is really just inverting the order.

It means that in their UI, if you rank project A (extended), B (basic) and then C (single budget), you are submitting a ballot expressing the preference of: A (extended) > A (basic) > B (Basic) > B (Extended), C (single budget).

This matters because **if everyone used an interface that did that** (or even if the majority of voters did), then the resulting rank shown on snapshot (comparing all budgets as separate entries) or the one proposed in the algorithm (compare all candidates as a single entity) **would show the same result.** In blockchain parlance, that would be a “soft-fork” of the voting algorithm, meaning that if a majority of the voters used the proposed interface, then it would essentially be a change of the rules without having to hard encode them.

This could be a valid option in my opinion. Voters who would prefer to express their votes by ranking all budgets could still go to snapshot. There’s a valid concern that the fear of vote splitting on snapshot (regardless if it exists or not) might make some providers put forward a single budget anyway. But this could be a way to allow the extra expressiveness without changing the core ranking algorithm.

![](https://discuss.ens.domains/user_avatar/discuss.ens.domains/brantlymillegan/48/312_2.png) brantlymillegan:
> Let’s say someone is the last in line to get funded. Their Extended scope got the majority vote over Basic scope. But their Extended scope doesn’t fit in the remaining budget, but their Basic Scope does. In such a case, should we default to someone’s Basic scope?

This is a valid point. In the proposed algorithm we wouldn’t, and this sort of defeats the original intent of having two budgets, right? We could add the option to reduce the scope in this case.

---

# Post #13 by dennison
Posted at: 2025-04-04T17:26:05.811Z

Service provider here:

What if teams simply didn’t have an extended scope? The extended scope seems to be the most complicating element of this calculation for both service providers and delegates.

As a service provider ourselves we didn’t do an extended scope because it felt like a nice to have that added complexity to the decision making process. Maybe it’s too late to make this change, but wouldn’t that be simpler?

---

# Post #14 by AvsA
Posted at: 2025-04-04T19:54:14.042Z

I’ve compiled this table which might be helpful for the discussion. It’s useful to know what we are debating about in practice.

| Company | Basic Scope | Extended Scope | Delta |
| --- | --- | --- | --- |
| **AlphaGrowth** | $400,000 | $800,000 | $400,000 |
| **ZK.Email** | $400,000 | $800,000 | $400,000 |
| **Blockful** | $400,000 | $700,000 | $300,000 |
| **Unruggable** | $400,000 | $700,000 | $300,000 |
| **3DNS** | $500,000 | $700,000 | $200,000 |
| **Ethereum.Identity.Foundation** | $500,000 | $700,000 | $200,000 |
| **JustaName** | $400,000 | $600,000 | $200,000 |
| **NameHash.Labs** | $1,100,000 | $1,300,000 | $200,000 |
| **Namespace** | $400,000 | $600,000 | $200,000 |
| **Agora** | $300,000 | $400,000 | $100,000 |
| **dWeb.host** | $300,000 | $400,000 | $100,000 |
| **EthLimo** | $700,000 | $800,000 | $100,000 |
| **Wildcard.Labs** | $300,000 | $400,000 | $100,000 |
| **Curia.Lab** | $300,000 | – | – |
| **Decent** | $300,000 | – | – |
| **Enscribe** | $400,000 | – | – |
| **GovPal** | $300,000 | – | – |
| **Lighthouse\_Labs** | $400,000 | – | – |
| **Namestone** | $800,000 | – | – |
| **PYOR** | $300,000 | – | – |
| **Tally** | $300,000 | – | – |
| **Unicorn.eth** | $300,000 | – | – |
| **Web3bio** | $500,000 | – | – |
| **WebHash** | $300,000 | – | – |
| **x23.ai** | $300,000 | – | – |

---

# Post #15 by alextnetto.eth
Posted at: 2025-04-04T20:42:23.860Z

From blockful’s side as a service provider:

Letting delegates choose between budgets is positive as long as the changes in the voting mechanism don’t create negative externalities (like splitting the votes if the provider has 2 budgets).

The proposed solution above, which was discussed at the 1st April Metagov call (Delegate all-hands), does address this concern and lets delegates express their preference without changing the properties of the initially proposed voting mechanism (well explained by Avsa on the above posts).

![](https://discuss.ens.domains/user_avatar/discuss.ens.domains/dennison/48/10541_2.png) dennison:
> What if teams simply didn’t have an extended scope?

That’s also an option, but it brings an all-or-nothing situation for providers who want to execute a larger scope because they see the necessity.

If delegates don’t see the necessity of this larger scope, by having a basic budget, at least delegates can express they want a smaller budget, and we’ll probably have more teams funded.

---

Supportive of the proposal. It creates **better outcomes for capital allocation than just approving all the extended budgets for top-ranked providers** and does not change much things (probably nothing) for our SP application.

---

Also, for full context:

We started Monday night to implement the algorithm for the voting mechanism previously approved on [EP6.3](https://snapshot.box/#/s:ens.eth/proposal/0x0cca1cf36731203e235b0e2de9041be3a16d9cdeadff6e15e1f1215c611e12ef). Then after the Metagov’s call, we started adapting toward above’s direction, which actually are small changes.

Whatever the DAO decides, for the current and this new voting mechanism, we are on track for the UI to be shipped.

---

# Post #16 by ethlimo.eth
Posted at: 2025-04-04T21:05:02.891Z

![](https://discuss.ens.domains/user_avatar/discuss.ens.domains/brantlymillegan/48/312_2.png) brantlymillegan:
> Let’s say someone is the last in line to get funded. Their Extended scope got the majority vote over Basic scope. But their Extended scope doesn’t fit in the remaining budget, but their Basic Scope does. In such a case, should we default to someone’s Basic scope?

This is a great point, personally I believe it should default to the basic scope.

Our original application only included 1 ask, but after discussing the extended/basic scope with other SP applicants and delegates we felt compelled to represent both.

---

# Post #18 by simona_pop
Posted at: 2025-04-07T11:14:24.271Z

Appreciate the engagement in this thread — it’s clear there’s a shared commitment to fairness, clarity in voting, and effective decision making.

A few common themes seem to be emerging:

* **Clarity & transparency:** There’s some understandable concern about how the Copeland method and pairwise comparisons play out, especially with so many line items. I think there was already a concern around complexity of this new model even during the first all delegates call. Perhaps some visual explanations and examples could go a long way in making the process more intuitive…?
* **Simplicity vs. flexibility:** There is a sentiment of it’s best to keep the current voting mechanism, at least for this round. But there’s also recognition (both on the calls held on the topic and in the responses here) that separating base and extended budget can give delegates a finer tuned voting opportunity and support more nuanced decision making that would perhaps keep the budget allocated to the programme in check.

A phased approach makes sense to many — test improvements first, then consider deeper changes. That is definitely a sentiment worth listening to.

That said, we now have an actual UI built in record time by [@alextnetto.eth](/u/alextnetto.eth) and his team to support the above logic — and that’s the best possible ground for meaningful testing in my view. So lets see how this stands up

---

# Post #19 by nick.eth
Posted at: 2025-04-07T13:33:19.331Z

![](https://discuss.ens.domains/user_avatar/discuss.ens.domains/avsa/48/1689_2.png) AvsA:
> Think of an extreme case in which an election runs in which company A and B presents a single budget and company C presents 3 budgets. Now the total of possible pairwise comparisons is 10, but of these only 3 are between different companies. It means that beating A or B will get 1 point while beating C gets you 7 points. Suppose C1 is considered the strongest candidate but C2 and C3 are the weakest. In this case, A and B get each 2 points for beating these candidates, and now C has to beat its own budgets in order to make up for it.

That’s because you are still thinking in terms of funding companies, rather than projects. The point of this program is to fund projects, not companies. If your project is better than 3 other projects, it **should** get 3 points (not 7 - not sure where that figure is from). If a company is on the cutoff, only their strongest projects should get funded, in preference to their weaker ones.

![](https://discuss.ens.domains/user_avatar/discuss.ens.domains/alextnetto.eth/48/11355_2.png) alextnetto.eth:
> Letting delegates choose between budgets is positive as long as the changes in the voting mechanism don’t create negative externalities (like splitting the votes if the provider has 2 budgets).

To be clear, there’s no “splitting votes” in Copeland. If you offer two budgets and all your voters rank them adjacent to each other, the end result is the same as if you’d just offered one budget - except if you end up right on the cutoff, in which case you’d get one project funded instead of nothing.

The results are different if someone ranks other providers’ budgets in between two of your own proposals - but this is as intended, it’s allowing the voter to express their preference between proposals across different candidates. You *could* bundle them together into one proposal, but in that case you’re making the gamble that the voter wants your more popular project enough to overcome the additional cost of the combined budget. In reality you should expect that a single proposal for $x+$y will rank lower than the better of $x or $y alone.

---

# Post #20 by AvsA
Posted at: 2025-04-07T15:30:45.384Z

![](https://discuss.ens.domains/user_avatar/discuss.ens.domains/nick.eth/48/712_2.png) nick.eth:
> That’s because you are still thinking in terms of funding companies, rather than projects. The point of this program is to fund projects, not companies.

I would be ok with simplifying the amendment rules to:

* Budgets are ranked individually
* Once one of your budgets are selected, all lower-ranked budgets are eliminated

I would *strongly encourage* voters to use the simplified UI that would show individual companies instead of all the budgets separately (and any other alternative UI that is live by then) but we wouldn’t need to enforce the reordering by rules. If enough people voted by bundling all budgets from the same company together (as that alternative UI presented enforces), then both methods of counting the votes would end up in similar places.

This way we can get this amendment passed with both Simplicity and Flexibility., like [@simona\_pop](/u/simona_pop) said in her usual beautifully crafted NVC way.

---

# Post #21 by nick.eth
Posted at: 2025-04-07T19:20:08.645Z

![](https://discuss.ens.domains/user_avatar/discuss.ens.domains/avsa/48/1689_2.png) AvsA:
> I would be ok with simplifying the amendment rules to:
> 
> * Budgets are ranked individually
> * Once one of your budgets are selected, all lower-ranked budgets are eliminated

But why? It’s so much simpler to just let teams post multiple budgets if they want! They can choose if and how to split things up, it gives everyone more flexibility, it doesn’t change the voting algorithm and there’s **literally no downside**.

---

# Post #15 by alextnetto.eth
Posted at: 2025-04-04T20:42:23.860Z

From blockful’s side as a service provider:

Letting delegates choose between budgets is positive as long as the changes in the voting mechanism don’t create negative externalities (like splitting the votes if the provider has 2 budgets).

The proposed solution above, which was discussed at the 1st April Metagov call (Delegate all-hands), does address this concern and lets delegates express their preference without changing the properties of the initially proposed voting mechanism (well explained by Avsa on the above posts).

![](https://discuss.ens.domains/user_avatar/discuss.ens.domains/dennison/48/10541_2.png) dennison:
> What if teams simply didn’t have an extended scope?

That’s also an option, but it brings an all-or-nothing situation for providers who want to execute a larger scope because they see the necessity.

If delegates don’t see the necessity of this larger scope, by having a basic budget, at least delegates can express they want a smaller budget, and we’ll probably have more teams funded.

---

Supportive of the proposal. It creates **better outcomes for capital allocation than just approving all the extended budgets for top-ranked providers** and does not change much things (probably nothing) for our SP application.

---

Also, for full context:

We started Monday night to implement the algorithm for the voting mechanism previously approved on [EP6.3](https://snapshot.box/#/s:ens.eth/proposal/0x0cca1cf36731203e235b0e2de9041be3a16d9cdeadff6e15e1f1215c611e12ef). Then after the Metagov’s call, we started adapting toward above’s direction, which actually are small changes.

Whatever the DAO decides, for the current and this new voting mechanism, we are on track for the UI to be shipped.

---

# Post #16 by ethlimo.eth
Posted at: 2025-04-04T21:05:02.891Z

![](https://discuss.ens.domains/user_avatar/discuss.ens.domains/brantlymillegan/48/312_2.png) brantlymillegan:
> Let’s say someone is the last in line to get funded. Their Extended scope got the majority vote over Basic scope. But their Extended scope doesn’t fit in the remaining budget, but their Basic Scope does. In such a case, should we default to someone’s Basic scope?

This is a great point, personally I believe it should default to the basic scope.

Our original application only included 1 ask, but after discussing the extended/basic scope with other SP applicants and delegates we felt compelled to represent both.

---

# Post #18 by simona_pop
Posted at: 2025-04-07T11:14:24.271Z

Appreciate the engagement in this thread — it’s clear there’s a shared commitment to fairness, clarity in voting, and effective decision making.

A few common themes seem to be emerging:

* **Clarity & transparency:** There’s some understandable concern about how the Copeland method and pairwise comparisons play out, especially with so many line items. I think there was already a concern around complexity of this new model even during the first all delegates call. Perhaps some visual explanations and examples could go a long way in making the process more intuitive…?
* **Simplicity vs. flexibility:** There is a sentiment of it’s best to keep the current voting mechanism, at least for this round. But there’s also recognition (both on the calls held on the topic and in the responses here) that separating base and extended budget can give delegates a finer tuned voting opportunity and support more nuanced decision making that would perhaps keep the budget allocated to the programme in check.

A phased approach makes sense to many — test improvements first, then consider deeper changes. That is definitely a sentiment worth listening to.

That said, we now have an actual UI built in record time by [@alextnetto.eth](/u/alextnetto.eth) and his team to support the above logic — and that’s the best possible ground for meaningful testing in my view. So lets see how this stands up

---

# Post #19 by nick.eth
Posted at: 2025-04-07T13:33:19.331Z

![](https://discuss.ens.domains/user_avatar/discuss.ens.domains/avsa/48/1689_2.png) AvsA:
> Think of an extreme case in which an election runs in which company A and B presents a single budget and company C presents 3 budgets. Now the total of possible pairwise comparisons is 10, but of these only 3 are between different companies. It means that beating A or B will get 1 point while beating C gets you 7 points. Suppose C1 is considered the strongest candidate but C2 and C3 are the weakest. In this case, A and B get each 2 points for beating these candidates, and now C has to beat its own budgets in order to make up for it.

That’s because you are still thinking in terms of funding companies, rather than projects. The point of this program is to fund projects, not companies. If your project is better than 3 other projects, it **should** get 3 points (not 7 - not sure where that figure is from). If a company is on the cutoff, only their strongest projects should get funded, in preference to their weaker ones.

![](https://discuss.ens.domains/user_avatar/discuss.ens.domains/alextnetto.eth/48/11355_2.png) alextnetto.eth:
> Letting delegates choose between budgets is positive as long as the changes in the voting mechanism don’t create negative externalities (like splitting the votes if the provider has 2 budgets).

To be clear, there’s no “splitting votes” in Copeland. If you offer two budgets and all your voters rank them adjacent to each other, the end result is the same as if you’d just offered one budget - except if you end up right on the cutoff, in which case you’d get one project funded instead of nothing.

The results are different if someone ranks other providers’ budgets in between two of your own proposals - but this is as intended, it’s allowing the voter to express their preference between proposals across different candidates. You *could* bundle them together into one proposal, but in that case you’re making the gamble that the voter wants your more popular project enough to overcome the additional cost of the combined budget. In reality you should expect that a single proposal for $x+$y will rank lower than the better of $x or $y alone.

---

# Post #20 by AvsA
Posted at: 2025-04-07T15:30:45.384Z

![](https://discuss.ens.domains/user_avatar/discuss.ens.domains/nick.eth/48/712_2.png) nick.eth:
> That’s because you are still thinking in terms of funding companies, rather than projects. The point of this program is to fund projects, not companies.

I would be ok with simplifying the amendment rules to:

* Budgets are ranked individually
* Once one of your budgets are selected, all lower-ranked budgets are eliminated

I would *strongly encourage* voters to use the simplified UI that would show individual companies instead of all the budgets separately (and any other alternative UI that is live by then) but we wouldn’t need to enforce the reordering by rules. If enough people voted by bundling all budgets from the same company together (as that alternative UI presented enforces), then both methods of counting the votes would end up in similar places.

This way we can get this amendment passed with both Simplicity and Flexibility., like [@simona\_pop](/u/simona_pop) said in her usual beautifully crafted NVC way.

---

# Post #21 by nick.eth
Posted at: 2025-04-07T19:20:08.645Z

![](https://discuss.ens.domains/user_avatar/discuss.ens.domains/avsa/48/1689_2.png) AvsA:
> I would be ok with simplifying the amendment rules to:
> 
> * Budgets are ranked individually
> * Once one of your budgets are selected, all lower-ranked budgets are eliminated

But why? It’s so much simpler to just let teams post multiple budgets if they want! They can choose if and how to split things up, it gives everyone more flexibility, it doesn’t change the voting algorithm and there’s **literally no downside**.

---

# Post #22 by AvsA
Posted at: 2025-04-07T20:09:07.024Z

You mean someone could post a $300k project and a $500k project and the DAO could either fund 300, 500 or both at 800?

I think it would require applicants from changing their applications fundamentally, and also it’s a lot more cognitive load from delegates to have them rank individual projects from each team. I also think it’s good to give leeway for teams to adapt their work, build new things that weren’t clear were necessary or stop building something that becomes irrelevant as the market evolves. That’s why I prefer to think in terms of teams, not “build this thing to spec”.

---

# Post #23 by brantlymillegan
Posted at: 2025-04-08T00:34:37.367Z

![](https://discuss.ens.domains/user_avatar/discuss.ens.domains/nick.eth/48/712_2.png) nick.eth:
> That’s because you are still thinking in terms of funding companies, rather than projects. The point of this program is to fund projects, not companies.

This is not true. This is not what the rules we voted on say, it’s not how Alex has talked about the program over the last year and a half, it’s not how season 1 functioned, and it’s not how most people conceive of the program.

If you’d like a program to exist more as you’ve described, that’s fine but you’ll need to create that program, rather than claiming the existing program is already that when it’s not.

![](https://discuss.ens.domains/user_avatar/discuss.ens.domains/nick.eth/48/712_2.png) nick.eth:
> But why? It’s so much simpler to just let teams post multiple budgets if they want! They can choose if and how to split things up, it gives everyone more flexibility, it doesn’t change the voting algorithm and there’s **literally no downside**.

The downside is that, as [@AvsA](/u/avsa) says above, it would be different program and require a complete restructuring of every application and every group’s plans.

---

# Post #24 by 5pence.eth
Posted at: 2025-04-08T03:04:18.389Z

I agree with [@simona\_pop](/u/simona_pop)’s comments that significant changes should be off the table for this cycle. The projects vs. companies discussion will be good for next year.

Focusing on the text of this temp check, I agree that providing the level of granularity suggested here would be an improvement, and it would achieve this with a relatively small deviation from the original specification.

While there are two less-than-ideal aspects to consider - the additional delay for applicants and the rushed timeline for UI development - I believe the benefits of this additional granularity outweigh both of these concerns. The previous Season 1 streams always had extra runway to specifically allow for delays in this vote. We can afford to take a moment on this if we want to.

---

# Post #25 by nick.eth
Posted at: 2025-04-08T07:55:56.963Z

![](https://discuss.ens.domains/user_avatar/discuss.ens.domains/avsa/48/1689_2.png) AvsA:
> You mean someone could post a $300k project and a $500k project and the DAO could either fund 300, 500 or both at 800?

Yes; each budget would be independent.

My description of it as “projects” is a poor one - I should have said “independent budgets”. Each entry does not need to correspond to a single project; it simply gives teams the flexibility to split up their offering if desired.

![](https://discuss.ens.domains/user_avatar/discuss.ens.domains/avsa/48/1689_2.png) AvsA:
> I think it would require applicants from changing their applications fundamentally, and also it’s a lot more cognitive load from delegates to have them rank individual projects from each team.[/quote]
> 
> Applicants can choose to submit only a single budget, or to submit two - effectively ‘basic’ and ‘extended’ - with the note that voters should rank the first above the second.
> 
> I think it’s *less* cognitive load to assess individual budgets on their own merits, than it is to assess teams and separately assess whether to fund their “basic” or “extended” scope.
> 
> [quote] I also think it’s good to give leeway for teams to adapt their work, build new things that weren’t clear were necessary or stop building something that becomes irrelevant as the market evolves. That’s why I prefer to think in terms of teams, not “build this thing to spec”.

Teams are also free to leave room for that in their objectives or deliverables. But the SPP is is for funding specific deliverables that ENS or the DAO needs. We should expect teams to describe what it is they intend to do in concrete terms.

![](https://discuss.ens.domains/user_avatar/discuss.ens.domains/5pence.eth/48/10424_2.png) 5pence.eth:
> I agree with [@simona\_pop](/u/simona_pop)’s comments that significant changes should be off the table for this cycle. The projects vs. companies discussion will be good for next year.

Allowing teams to request multiple budgets is a smaller change than the proposed change, and comes with less technical risk because it doesn’t alter the voting process. If teams want to, they can still use it to replicate the effect of a basic/extended scope, too.

I continue to believe that the proposed change to the voting process is high risk, as it involves further complicating an already complex voting process, with multiple UIs, on a short timeline, and thus comes with the possibility of bugs that materially affect the voting process or its outcomes. If the options put forward are to leave the process as-is or to adopt this new change, I will accordingly be voting for the lower risk and safer option. I won’t be investing any further energy into trying to convince people that this is a bad idea, however.

---

# Post #26 by James
Posted at: 2025-04-08T08:24:08.749Z

![](https://discuss.ens.domains/user_avatar/discuss.ens.domains/nick.eth/48/712_2.png) nick.eth:
> Allowing teams to request multiple budgets is a smaller change than the proposed change, and comes with less technical risk because it doesn’t alter the voting process. If teams want to, they can still use it to replicate the effect of a basic/extended scope, too.

This would also require a vote for us to amend the SPP process as far as i understand right? But i support this as a way to solve for the primary ask from the MetaGov delegate all hands which was to allow delegates to vote on basic vs extended scopes.

![](https://discuss.ens.domains/user_avatar/discuss.ens.domains/nick.eth/48/712_2.png) nick.eth:
> I continue to believe that the proposed change to the voting process is high risk, as it involves further complicating an already complex voting process, with multiple UIs, on a short timeline, and thus comes with the possibility of bugs that materially affect the voting process or its outcomes.

Agree that we don’t want to rush this process and create bugs/risks. However we do not need to rush this process, this vote is regarding 25% of the entire DAOs yearly revenue, ensuring a low risk voting process where delegates can make a clear vote on this budget is the goal here. I would strongly lean towards prioritising impact at the expense of time.

---

# Post #27 by nick.eth
Posted at: 2025-04-08T11:03:37.915Z

![](https://discuss.ens.domains/user_avatar/discuss.ens.domains/james/48/506_2.png) James:
> This would also require a vote for us to amend the SPP process as far as i understand right?

Yes, but any proposed change will require this.

---

# Post #28 by clowes.eth
Posted at: 2025-04-08T14:16:50.575Z

# Options

**Proposed**

The proposed mechanism is essentially “*UI-as-truth*”.

I think it would be fair to say that the nuances of the algorithm are not simple/quick to grasp. Without the custom built interfaces, delegates would be voting in an opaque manner through the snapshot interface which is, in my opinion, not great for democratic legitimacy or transparency.

Whilst it’s additional work I think these interfaces need to allow delegates to simulate how their vote will impact the result in advance of the vote being cast. If someone modifies their rankings, UIs should show exactly how that would change the outcome - interactive comprehension.

Bonus points for some sort of open-source implementation of the algorithm that produces deterministic outputs given raw inputs such that the UIs can essentially be audited.

**Original**

The original format was also unclear to delegates (as outlined in the various Metagov facilitated calls). The custom interface developed by Agora was not expressive enough for the manner in which a number of delegates stated that they wanted to vote.

The UI was also new, and as I understand there was only a singular implementation. It is similarly **not** battle-tested.

# Thoughts

![](https://discuss.ens.domains/user_avatar/discuss.ens.domains/nick.eth/48/712_2.png) nick.eth:
> But the SPP is is for funding specific deliverables that ENS or the DAO needs.

The approach thus far has been for potential Service Providers to tell the DAO what it needs.

I can’t help but feel that true simplicity happens if:

* The **DAO defines the need** - “we need X”
* People **apply to deliver** that need
* The proposals are about **how** to meet the need, not *whether* it’s needed

It would minimise the load on delegates with clearly defined categorisations of work - we would avoid the situation where delegates have to compare *another* subname provider with a team doing something completely different (and novel).

That said, taking Brantly’s words, this idea is also:

![](https://discuss.ens.domains/user_avatar/discuss.ens.domains/brantlymillegan/48/312_2.png) brantlymillegan:
> not how Alex has talked about the program over the last year and a half, it’s not how season 1 functioned, and it’s not how most people conceive of the program

**Rushing**

We don’t need to rush.

![](https://discuss.ens.domains/user_avatar/discuss.ens.domains/james/48/506_2.png) James:
> this vote is regarding 25% of the entire DAOs yearly revenue

As a current Service Provider (and applicant) I am very much OK with this being delayed so as to allow for it to be done properly.

The idea that we would knowingly poorly allocate such a vast amount of money simply to avoid a week/month delay is not cool.

These conversations are also happening on public platforms. Potential applicants have an opportunity to state their positioning and opinions but the large majority have not. I can only work with available information, but thus far no-one (I believe) has explicitly stated that they have an issue with delays.

**!!!**

The ENS DAO is widely considered a best in class example of a DAO. We should absolutely strive to maintain it’s integrity, and should take the time to do this properly.

---

# Post #29 by jefflau.eth
Posted at: 2025-04-08T16:36:49.190Z

![](https://discuss.ens.domains/user_avatar/discuss.ens.domains/nick.eth/48/712_2.png) nick.eth:
> Allowing teams to request multiple budgets is a smaller change than the proposed change, and comes with less technical risk because it doesn’t alter the voting process. If teams want to, they can still use it to replicate the effect of a basic/extended scope, too.

I’ve been following the discussion and have been trying to grok what makes the most sense, but I think this made things clear to me. I’ve been finding it hard myself to understand how the voting process works and how things ‘fall through’ based on getting enough votes for their basic but not their expanded and how it might affect the vote and what gets funded. For instance I might only want to fund the team because I feel the expanded vote is what they should be working on, but because they only got funded based on their basic, it would have changed my vote/endorsement.

I think it’s clearer for me to see “this is a good feature, and this is a good team, therefore this should be funded”. It’s far easier to see what to support based on this too.

![](https://discuss.ens.domains/user_avatar/discuss.ens.domains/avsa/48/1689_2.png) AvsA:
> I think it would require applicants from changing their applications fundamentally, and also it’s a lot more cognitive load from delegates to have them rank individual projects from each team. I also think it’s good to give leeway for teams to adapt their work, build new things that weren’t clear were necessary or stop building something that becomes irrelevant as the market evolves. That’s why I prefer to think in terms of teams, not “build this thing to spec”.

Applicants can choose not to restructure their applications if they choose and be considered as a team. I think looking through the projects myself, the hard part about deciding whether a team is worth endorsing/voting for is hard because many of the teams choose to do many different deliverables and I may only feel like 1 of 3 things are the most useful to the DAO/protocol.

Lastly I think lowering the risk to the vote makes the most sense, whatever we decide to do.

![](https://discuss.ens.domains/user_avatar/discuss.ens.domains/clowes.eth/48/8205_2.png) clowes.eth:
> I can’t help but feel that true simplicity happens if:
> 
> * The **DAO defines the need** - “we need X”
> * People **apply to deliver** that need
> * The proposals are about **how** to meet the need, not *whether* it’s needed

Actually this does make quite a bit of sense and is basically an RFP process.

![](https://discuss.ens.domains/user_avatar/discuss.ens.domains/clowes.eth/48/8205_2.png) clowes.eth:
> The idea that we would knowingly poorly allocate such a vast amount of money simply to avoid a week/month delay is not cool.

I agree with this sentiment

---

# Post #30 by AvsA
Posted at: 2025-04-08T18:26:41.236Z

![](https://discuss.ens.domains/user_avatar/discuss.ens.domains/jefflau.eth/48/1850_2.png) jefflau.eth:
> ![](https://discuss.ens.domains/user_avatar/discuss.ens.domains/clowes.eth/48/8205_2.png) clowes.eth:
> > I can’t help but feel that true simplicity happens if:
> > 
> > * The **DAO defines the need** - “we need X”
> > * People **apply to deliver** that need
> > * The proposals are about **how** to meet the need, not *whether* it’s needed
> 
> Actually this does make quite a bit of sense and is basically an RFP process.

Not only this should be discussed on the scope of a future program (not this specific amendment), but I think it’s fundamentally a different funding philosophy in my opinion. Who would be making these RFPs and deciding them? Would it be something where the DAO ranks some general ideas and then Metagov writes it to spec and then companies compete for the lowest bid? What happens if the market moves in the mean time and what made sense one moment doesn’t make sense the other? What if a company has a very bright idea to pivot that project into something better but outside the spec? What if the people who build it lack the refinement of those who had the initial idea in the first place, and instead of trying to build the best tool they just focus on delivering on their contract?

That’s why I’d rather trust **teams**. They put forth budgets of stuff they want to work on and they are loosely bound to it, but most importantly what we are saying is not “this thing needs to be built and I think this person will do it for cheap” but rather “I trust this team to continuously focus on finding innovative solutions for these problems and any new ones that might occur in the future”.

---

# Post #31 by nick.eth
Posted at: 2025-04-08T19:16:22.387Z

![](https://discuss.ens.domains/user_avatar/discuss.ens.domains/clowes.eth/48/8205_2.png) clowes.eth:
> I can’t help but feel that true simplicity happens if:
> 
> * The **DAO defines the need** - “we need X”
> * People **apply to deliver** that need
> * The proposals are about **how** to meet the need, not *whether* it’s needed
> 
> It would minimise the load on delegates with clearly defined categorisations of work - we would avoid the situation where delegates have to compare *another* subname provider with a team doing something completely different (and novel).

RFPs definitely have their place, and we’ve used them in the past. But I do think there’s a lot of value in teams identifying what they see as a need and proposing to the DAO that they can satisfy that need, which is the space the SPP fills.

What I am less enthusiastic about is this tendency to bundle multiple unrelated offerings together and force people to vote for all or nothing. I would much rather that a team proposing to do three distinct things put forward three separate proposals. The advocates of the current amendment have made it clear that they see this kind of expressiveness as something to be explicitly prevented, however.

---

# Post #32 by AvsA
Posted at: 2025-04-09T16:09:27.041Z

![](https://discuss.ens.domains/user_avatar/discuss.ens.domains/nick.eth/48/712_2.png) nick.eth:
> The advocates of the current amendment have made it clear that they see this kind of expressiveness as something to be explicitly prevented, however.

This isn’t the position. The position is that vote splitting in this manner can adversely affect a company that puts forth many proposals.

Let’s imagine a simplified Scenario in which there are only two companies and three voters (with different tokens amounts). Company A puts forward two budgets and company B only one. Let’s say the proposals are in all aspects identical, so most of the supporters of the company A put these in front, and B in second, while leaves the other budget unranked (in the bottom). Suppose these are the final results of the vote.

[![Screenshot 2025-04-09 at 12.49.25 PM](https://discuss.ens.domains/uploads/db9688/optimized/2X/4/4da5ff1640596495aa922f6fba8a16715aaec6da_2_690x176.jpeg)Screenshot 2025-04-09 at 12.49.25 PM2098×536 81.8 KB](https://discuss.ens.domains/uploads/db9688/original/2X/4/4da5ff1640596495aa922f6fba8a16715aaec6da.jpeg "Screenshot 2025-04-09 at 12.49.25 PM")

In this example, even though company A has 75% of the support, it loses both head to head comparisons with company B, and thus loses the vote. Company B is the clear Copeland winner, and *it would be the intended result if this was an election with 2 controversial candidates and one who’s everyone’s second best* (Copeland rewards consensus and broad support), but for companies applying, they don’t care so much about which of their budgets gets approved, *as long as one of them does.*

–*“But Alex, if A1 and A2 are identical, why would the voters put their secondary proposal under B? If they prefer company A over B, then they should put both budgets above B!”*

And you’re absolutely right, they should! And if they do it this way, then the problem disappears. But the problem is, in practice, not all of them will, specially not when there are 50 entries to be ranked independently on snapshot. So it means that necessarily, some of these budgets will remain unranked, or ranked very much below the others. So it is an UI issue, and if everyone used the “right” UI it wouldn’t be a problem, but we can’t control that.

But more importantly: yesterday we had a governance call and most Service Providers who were there agreed that they feared this effect enough that if the budgets were to be independently ranked then they would only put forth one budget for fear of losing even a bit of a rank because of the effect.

So while I appreciate you’re defending more expressiveness, we have strong reasons to suspect **the end result would be less options on the vote overall.**

Finally: *we could be wrong.* Maybe most delegates will use the better UI and the snapshot vote result will match 100% and this whole custom algorithm was completely unnecessary. In that case we will have the data (just compare snapshot and agora+blockful’s rank) and next year can do without it. But if we don’t, and Service Provider candidates only put forth one budget, then we will never know.

---

# Post #33 by nick.eth
Posted at: 2025-04-09T18:39:00.350Z

![](https://discuss.ens.domains/user_avatar/discuss.ens.domains/avsa/48/1689_2.png) AvsA:
> Company A puts forward two budgets and company B only one. Let’s say the proposals are in all aspects identical, so most of the supporters of the company A put these in front, and B in second, while leaves the other budget unranked (in the bottom). Suppose these are the final results of the vote.
> 
> [![Screenshot 2025-04-09 at 12.49.25 PM](https://discuss.ens.domains/uploads/db9688/optimized/2X/4/4da5ff1640596495aa922f6fba8a16715aaec6da_2_690x176.jpeg)Screenshot 2025-04-09 at 12.49.25 PM2098×536 81.8 KB](https://discuss.ens.domains/uploads/db9688/original/2X/4/4da5ff1640596495aa922f6fba8a16715aaec6da.jpeg "Screenshot 2025-04-09 at 12.49.25 PM")
> 
> In this example, even though company A has 75% of the support, it loses both head to head comparisons with company B,

Company A has 75% support for **half the money**. If they combined both their proposals together, the ask would be double what either of their split budgets is demanding, and it’s fallacious to assume that people would give the same support to a proposal that costs twice as much.

![](https://discuss.ens.domains/user_avatar/discuss.ens.domains/avsa/48/1689_2.png) AvsA:
> *“But Alex, if A1 and A2 are identical, why would the voters put their secondary proposal under B? If they prefer company A over B, then they should put both budgets above B!”*
> 
> And you’re absolutely right, they should! And if they do it this way, then the problem disappears. But the problem is, in practice, not all of them will, specially not when there are 50 entries to be ranked independently on snapshot. So it means that necessarily, some of these budgets will remain unranked, or ranked very much below the others. So it is an UI issue, and if everyone used the “right” UI it wouldn’t be a problem, but we can’t control that.

It sounds like you’re saying you don’t expect users to be able to express their voting intentions accurately under this system. Why do you believe it would be any easier for them to do so under your proposal?

![](https://discuss.ens.domains/user_avatar/discuss.ens.domains/avsa/48/1689_2.png) AvsA:
> But more importantly: yesterday we had a governance call and most Service Providers who were there agreed that they feared this effect enough that if the budgets were to be independently ranked then they would only put forth one budget for fear of losing even a bit of a rank because of the effect.

This is effectively arguing that because incorrect information has already been effectively spread to everyone, there’s no point in trying to correct it or to do the right thing. It’s a poor argument for how to design a system.

![](https://discuss.ens.domains/user_avatar/discuss.ens.domains/avsa/48/1689_2.png) AvsA:
> So while I appreciate you’re defending more expressiveness

That’s not actually my main goal; my main goal is to avoid further complicating an already very involved voting system, and the goal of my suggestion is to offer the expressiveness people have asked for without the additional complexity and risk.

---

# Post #34 by dennison
Posted at: 2025-04-09T18:53:32.444Z

Hey folks, I ran the convo through AI to get bullet points on where we are right now:

### :green_circle: Supporters of the Amendment

These folks support allowing voters to choose between **basic** and **extended** budget options per service provider.

**Why they support it:**

* **More nuanced voting:** Delegates can express finer-grained preferences (e.g., “this team is good, but not for that much money”).
* **Avoids all-or-nothing:** If extended budget is too much but basic is fine, it won’t lead to full rejection.
* **UI already built:** Blockful and Agora teams are working on interfaces to support this logic.

**Key supporters:**

* James: Leading the charge to give delegates flexibility and ensure capital is allocated efficiently.
* AvsA: Proposed the new logic; believes it gives a clearer outcome and mitigates vote splitting via UI tricks.
* alextnetto.eth: Confirms UI implementation is simple and on track.
* slobo.eth, simona\_pop, 5pence.eth: Like the amendment but suggest more clarity, simulations, and phased approaches.

---

### :red_circle: Opponents or Cautious Voices

These folks are concerned about the complexity, rushed implementation, and potential bugs.

**Why they’re skeptical:**

* **Too complex:** Hard to explain, and Copeland + pairwise logic isn’t intuitive.
* **Too rushed:** Making changes close to the vote risks mistakes, UI issues, and delegitimizing the process.
* **Prefer simpler approach:** Let teams submit multiple proposals (e.g., “basic” and “extended”) as distinct line items instead of one bundled vote.

**Key skeptics:**

* nick.eth: Prefers keeping current system and letting teams post multiple line items. Thinks Copeland is okay but doesn’t need new logic.
* clowes.eth: Wants more transparency and simulation tools to model outcomes.

---

# Post #35 by AvsA
Posted at: 2025-04-09T22:29:17.986Z

![](https://discuss.ens.domains/user_avatar/discuss.ens.domains/nick.eth/48/712_2.png) nick.eth:
> In reality you should expect that a single proposal for $x+$y will rank lower than the better of $x or $y alone.

![](https://discuss.ens.domains/user_avatar/discuss.ens.domains/nick.eth/48/712_2.png) nick.eth:
> Company A has 75% support for **half the money**. If they combined both their proposals together, the ask would be double what either of their split budgets is demanding, and it’s fallacious to assume that people would give the same support to a proposal that costs twice as much.

Nick you have expressed similar comments before so there might be a misunderstanding on how the budgets work: they are **mutually exclusive**. The extended budget always contains the scope of the basic budget, and selecting one excludes the other. We could argue if it could be a good idea to have them as separate projects in which you could pick either or both ([I disagree](https://discuss.ens.domains/t/temp-check-social-service-provider-season-2-vote-amendment-proposal/20526/30)) but that’s not how the current budgets were structured by the candidates so changing this now would be a big change and IMHO, inconsiderate to them.

So in the scenario outlined, if a voter expresses their preference as A1 > A2 > B, they’re saying they prefer company A over B and budget A1 over budget A2. Once budget A1 is selected, A2 is excluded from the competition. That voter is NOT expressing they want to fund both A1 and A2, and only then fund B. So in this scenario, if 75% voters are expressing their support for company A they’re not expressing support for *both budgets*, but to *either budget.* If A is selected they will only get one of them (and we can consider their difference in value to be small enough that voters are almost identically split on it - but it’s not twice)

---

# Post #36 by nick.eth
Posted at: 2025-04-10T08:28:45.584Z

![](https://discuss.ens.domains/user_avatar/discuss.ens.domains/avsa/48/1689_2.png) AvsA:
> Nick you have expressed similar comments before so there might be a misunderstanding on how the budgets work: they are **mutually exclusive**. The extended budget always contains the scope of the basic budget, and selecting one excludes the other. We could argue if it could be a good idea to have them as separate projects in which you could pick either or both ([I disagree](https://discuss.ens.domains/t/temp-check-social-service-provider-season-2-vote-amendment-proposal/20526/30)) but that’s not how the current budgets were structured by the candidates so changing this now would be a big change and IMHO, inconsiderate to them.

But you presented this scenario as a counterargument to my suggestion of allowing teams to present multiple budgets if they want to. Why would you bake in an unstated assumption that only one of the budgets can be approved, when that’s not what I’m proposing?

In any case, if companies wish to have dependencies between budgets, they can simply say “We can’t accomplish A2 without A1 - so please do not rank A2 above A1”.

![](https://discuss.ens.domains/user_avatar/discuss.ens.domains/avsa/48/1689_2.png) AvsA:
> So in the scenario outlined, if a voter expresses their preference as A1 > A2 > B, they’re saying they prefer company A over B and budget A1 over budget A2. Once budget A1 is selected, A2 is excluded from the competition. That voter is NOT expressing they want to fund both A1 and A2, and only then fund B. So in this scenario, if 75% voters are expressing their support for company A they’re not expressing support for *both budgets*, but to *either budget.* If A is selected they will only get one of them (and we can consider their difference in value to be small enough that voters are almost identically split on it - but it’s not twice)

If the intention is for the budgets to be connected, then they can simply instruct delegates as I suggested above, and the group of A2 > B > A1 voters in your example disappears, and A wins the vote. Even without the instruction, it doesn’t make sense to expect that people would rank “extra funding for A” budget much higher than the “basic funding for A” budget in the first place.

---

# Post #37 by nick.eth
Posted at: 2025-04-10T09:08:53.515Z

One other problem I see with the current proposal is that I don’t think it works for what I expect to be a very common scenario, where a team puts their most vital work in the basic budget and “nice to have” items in an extended budget.

Let’s suppose a scenario where there is a $1M budget and some teams:

Team Alice wants $400k to build something absolutely vital to the success of ENS. They also propose an extended budget - for an extra $200k, they’ll make it easier to use and prettier.

Team Bob wants $400k to build something else pretty awesome - not quite as important as Alice’s infra, but still really useful to have.

There are a bunch of other teams making various other things, ranging from important to trivial.

As a delegate, I think Alice’s UX improvements are important, but not as important as Bob’s work. However, under the proposed system, I have only these choices:

1. I rank Alice above Bob, and choose Alice’s extended budget. This reduces the odds of Bob getting funded, even though I believe his work is more important than Alice’s UX improvements.
2. I rank Alice above Bob, and choose Alice’s basic budget. This gives the best odds of funding Alice and Bob, but Alice’s UX improvements don’t get funded, even though I believe they’re more important than some other things on my ballot.
3. I rank Bob above Alice, and choose Alice’s extended budget. This at least means the really important stuff is at the top of the ballot, but hurts Alice’s chances and doesn’t reflect what I believe is the most important project.

Here’s an alternative proposal that I think *might* actually make everyone happy:

* Allow teams to submit multiple budgets. Each budget is cumulative - eg, builds on the previous one. We can limit this to two, effectively replicating basic/extended scope, or allow teams a little more freedom if desired.
* Modify UIs to enforce that budgets *for a single team* must be ranked in ascending order. Thus, I must always rank Alice’s basic budget ahead of her extended budget - but there can be any number of other entries between the two.
* Modify the voting algorithm with a simple preprocessing step: if a team’s budgets are out of order, move the lower item above the upper item. If all UIs enforce the ordering restriction, this is a no-op, but it prevents inconsistent results if people vote using UIs that don’t enforce ordering.
* Run the voting algorithm as originally specified, but without the “basic/extended” logic originally described.

This proposal doesn’t have any issue of “vote splitting”, has a simpler UX than asking people to both rank teams and select a budget from each, and allows more expressiveness, eliminating the issue I described above. Further, it requires only minor changes to the existing UIs and voting algorithm, reducing technical risk.

---

# Post #38 by clowes.eth
Posted at: 2025-04-10T11:31:36.808Z

nick.eth (on Telegram):
> Team A want to be funded for both their “must have” and “nice to have” proposals; forcing me to either choose to not vote for their secondary proposal, or rank their whole offering lower to avoid their secondary proposal being ranked over someone else’s primary one doesn’t help them or me.

I feel like this quote from the Telegram chat explains Nick’s position succinctly. I agree - this is a valid want.

I *think*, if I am understanding correctly, that this is also aligned with what (I believe) a number of delegates want - the ability to prioritise the basic budgets of many over the extended budgets of few.

![](https://discuss.ens.domains/user_avatar/discuss.ens.domains/nick.eth/48/712_2.png) nick.eth:
> Modify UIs to enforce that budgets *for a single team* must be ranked in ascending order. Thus, I must always rank Alice’s basic budget ahead of her extended budget - but there can be any number of other entries between the two.

It’s a slightly more complicated interface to implement, but totally feasible.

The piece that some took issue with previously was that such an interface would plausibly have close to 70 different options to order. Perhaps the interface could couple both asks together when moving them about with basic above advanced, and then users that want more fine-grained control can decouple them?

![](https://discuss.ens.domains/user_avatar/discuss.ens.domains/nick.eth/48/712_2.png) nick.eth:
> Modify the voting algorithm with a simple preprocessing step: if a team’s budgets are out of order, move the lower item above the upper item. If all UIs enforce the ordering restriction, this is a no-op, but it prevents inconsistent results if people vote using UIs that don’t enforce ordering.

Does this pre-processing of votes submitted through other non order-enforcing interfaces not make Snapshot data non-authoritative?

It feels a bit like "*Well, you didn’t tick the box properly, so we’ve interpreted your vote differently*” where *properly* is arbitrarily (albeit reasonably) defined by us, the DAO.

Easily mitigated with a clear ‘*This is how this works*’ at the top of the on chain proposal with appropriate permalinks, but its worth considering.

---

# Post #39 by AvsA
Posted at: 2025-04-10T14:01:28.251Z

![](https://discuss.ens.domains/user_avatar/discuss.ens.domains/clowes.eth/48/8205_2.png) clowes.eth:
> Does this pre-processing of votes submitted through other non order-enforcing interfaces not make Snapshot data non-authoritative?

Yes, but so does the originally proposed amendment. Snapshot is used for the source of voting data, but the ranking displayed is not the source of truth. If most people vote using a compliant UI it would be, which is why it’s important to clarify all that.

---

# Post #40 by AvsA
Posted at: 2025-04-10T14:20:15.387Z

![](https://discuss.ens.domains/user_avatar/discuss.ens.domains/nick.eth/48/712_2.png) nick.eth:
> Here’s an alternative proposal that I think *might* actually make everyone happy:

I find this a very clever solution that achieves similar results with an even simpler algorithm. To clarify:

* Each candidate proposal is broken down in two independent entries. So if a candidate has a proposal structure that is 400k basic and 600k extended scope, then it’s broken down in two entries in the ballot: “Candidate A - Basic - 400k” and “Candidate A - Extended - 200k” (notice that in the extended proposal we are just putting the value of the difference from the basic)
* When considering a ballot, IF the vote ranks **Basic** under **Extended**, then we modify the ballot such that **basic** is ranked *directly above* **extended**. For teams building a voting UI, we will ask them to enforce that when writing the ballot, but if someone submits a “non compliant” ballot, we simply consider it as if it was changed in this way.
* The ranking of all entries (including None Below) is then calculated in a standard Copeland method.
* Once the ranking is complete, from top to bottom, we will try to fit projects in the 2 year stream, and then on the 1-year stream using the standard knapsack algorithm, stopping once budgets are exhausted or None Below is reached.
* Once we have ranked 5 projects OR if a project’s budget won’t fit in the 1 year stream we will remove any remaining budget from the 2-years and bring it to the 1-year stream.

Nick’s new proposal allows more detailed expressivity, while simplifying the current algorithm by a lot. Some of the properties that needed express rules (like downgrading a project’s extended to basic if it wouldn’t fit) now become inherent properties of the system. As far as I can tell it removes the vote splitting issue (at least in the example I provided), but we need some time to evaluate it.

It presents some UI challenges on ranking 50 different entries, but we might be able to overcome this with better interfaces.

---

# Post #41 by alextnetto.eth
Posted at: 2025-04-11T14:06:46.383Z

![](https://discuss.ens.domains/user_avatar/discuss.ens.domains/nick.eth/48/712_2.png) nick.eth:
> * Allow teams to submit multiple budgets. Each budget is cumulative - eg, builds on the previous one. We can limit this to two, effectively replicating basic/extended scope, or allow teams a little more freedom if desired.
> * Modify UIs to enforce that budgets *for a single team* must be ranked in ascending order. Thus, I must always rank Alice’s basic budget ahead of her extended budget - but there can be any number of other entries between the two.
> * Modify the voting algorithm with a simple preprocessing step: if a team’s budgets are out of order, move the lower item above the upper item. If all UIs enforce the ordering restriction, this is a no-op, but it prevents inconsistent results if people vote using UIs that don’t enforce ordering.
> * Run the voting algorithm as originally specified but without the “basic/extended” logic originally described.

This is almost equal to the proposed amendment and acknowledges the existence of vote splitting (by partially enforcing options from the same provider to be together). I truly believe that the proposed amendment is still a better fit. This has slight differences that create more work by all parties involved (SPs, delegates, …) and changes in game theory:

**Vote splitting concerns for extended scopes:** Under this alternative mechanism, extended scopes would compete not just against the basic scope of the same provider, but also against all other providers’ budgets. This creates a disadvantage for extended scopes that doesn’t exist in the current amendment. Service Providers would naturally respond by concentrating more work in their basic budget to avoid this penalty.

For instance, if Blockful were to adapt to this mechanism, we would likely restructure our application to place more work in the basic scope rather than using extended as intended - a nice-to-have addition. This seems to be different from the original purpose of the two-budget approach, which was more about the basic budget as a fallback rather than extended as a nice to have.

![](https://discuss.ens.domains/user_avatar/discuss.ens.domains/avsa/48/1689_2.png)[A Brain Dump on Service Provider Program Season 2](https://discuss.ens.domains/t/a-brain-dump-on-service-provider-program-season-2/19929/11)
> I liked Nick’s Minimum Viable Budget proposal. I have heard service providers complain that they dislike the all-or-nothing approach to getting accepted.

**Implementation and voting complexity:** The current amendment introduces minimal complexity for delegates - simply asking “After ranking providers, which budget do you prefer (basic or extended)?” The alternative would require additional UI changes and create a more complex voting experience, when many delegates have already expressed concerns about the effort involved in evaluating proposals.

**Two-year stream considerations:** The possibility of varying budgets across years (e.g., 600k for year one, 400k for year two) would require more detailed breakdowns in proposals and complicate stream management.

---

I’m only judging the mechanisms and their externalities—nothing else than that.

The current amendment already addresses delegates’ needs effectively: it’s straightforward, introduces no negative game theory changes compared to the original proposal and has achieved consensus during discussion calls. It’s already implemented, tested, and being adopted by UI providers. I see no compelling reason to pursue a different solution when we have one that works and requires minimal effort from all involved parties.

About the voting UI, blockful is happy to build toward whatever solution the DAO decides, but we are also focusing on our other deliverables as well while reallocating the team to solve and test this asap, from our resources. I believe I shared my perspective based on extensive simulations and consideration of the different mechanisms, and I appreciate everyone’s thoughtful engagement on this topic. At this point, I’ll be engaging only when the DAO has decided which mechanism to use, as Blockful needs to direct our attention to other deliverables.

---

# Post #42 by AvsA
Posted at: 2025-04-11T16:26:42.011Z

I’ve attempted to clarify [@nick.eth](/u/nick.eth)’s proposal in a form that could be used directly for a Snapshot vote. Nick, let me know if this reflects your intent.

---

### 1. Proposals

Teams can propose a **basic budget**, and optionally an **extended budget**, which is listed as the **extra amount** they’d like on top of the basic. The ballot would include all budget options as independent entries to be ranked independently.

Candidates will have a chance to edit their proposal, but as it stands, these are the current asks:

| Company | Basic Scope | Extra Ask |
| --- | --- | --- |
| **AlphaGrowth** | $400,000 | +$400,000 |
| **ZK.Email** | $400,000 | +$400,000 |
| **Blockful** | $400,000 | +$300,000 |
| **Unruggable** | $400,000 | +$300,000 |
| **3DNS** | $500,000 | +$200,000 |
| **Ethereum.Identity.Foundation** | $500,000 | +$200,000 |
| **JustaName** | $400,000 | +$200,000 |
| **NameHash.Labs** | $1,100,000 | +$200,000 |
| **Namespace** | $400,000 | +$200,000 |
| **Agora** | $300,000 | +$100,000 |
| **dWeb.host** | $300,000 | +$100,000 |
| **EthLimo** | $700,000 | +$100,000 |
| **Wildcard.Labs** | $300,000 | +$100,000 |
| **Curia.Lab** | $300,000 | – |
| **Decent** | $300,000 | – |
| **Enscribe** | $400,000 | – |
| **GovPal** | $300,000 | – |
| **Lighthouse\_Labs** | $400,000 | – |
| **Namestone** | $800,000 | – |
| **PYOR** | $300,000 | – |
| **Tally** | $300,000 | – |
| **Unicorn.eth** | $300,000 | – |
| **Web3bio** | $500,000 | – |
| **WebHash** | $300,000 | – |
| **x23.ai** | $300,000 | – |

---

### 2. Preprocessing Ballots

Before counting, each ballot is checked: if a voter ranks a team’s extra budget above its basic, the basic entry is moved directly above the extra. No changes are made otherwise.

---

### 3. Creating the Rank

Each entry is treated as a separate candidate and ranked using the **Copeland method**. If two entries have the same number of match victories, **average support** is used as a tiebreaker.

---

### 4. Budget Allocation

Once ranking is complete, entries are evaluated in order, using a **total budget of $4.5 million**:

1. Assign an entry to the **2-year stream** if it is a **current service provider**, ranked in the **top 10**, *and* assigning it would **not cause the total allocated to 2-year grants to exceed $1.5 million**.
2. If those conditions aren’t met, assign the entry to the **1-year stream** if its budget fits within the **remaining total budget** (regardless of the 2-year cap).

---

# Post #43 by nick.eth
Posted at: 2025-04-11T17:47:00.832Z

Yes, that sounds correct. I would expect UIs that support this would prevent users from ranking the extra ask above the basic budget; this makes the new preprocessing rule a safety net for UIs that don’t enforce it.

We could also choose to let candidates specify >2 budgets; I’d be curious to hear if any are interested in doing that.

Finally, the rules should specify that unused 2 year budget gets added to the 1 year stream.

---

# Post #44 by AvsA
Posted at: 2025-04-11T18:11:12.445Z

![](https://discuss.ens.domains/user_avatar/discuss.ens.domains/nick.eth/48/712_2.png) nick.eth:
> Finally, the rules should specify that unused 2 year budget gets added to the 1 year stream.

It does. I’ve reworded the rules to simplify them: instead of there being 2 budgets that there are rules to move one to the other, I think it’s easier to think about one big 4.5M budget, but at most 1.5 of these can be used for the 2y stream. The result is the same, but there needs less rules.

![](https://discuss.ens.domains/user_avatar/discuss.ens.domains/avsa/48/1689_2.png) AvsA:
> Once ranking is complete, entries are evaluated in order, using a **total budget of $4.5 million**:
> 
> 1. Assign an entry to the **2-year stream** if it is a **current service provider**, ranked in the **top 10**, *and* assigning it would **not cause the total allocated to 2-year grants to exceed $1.5 million**.
> 2. If those conditions aren’t met, assign the entry to the **1-year stream** if its budget fits within the **remaining total budget** (regardless of the 2-year cap).
> 3. Stop the evaluation if the **$4.5M total budget** has been fully allocated, if there are **no more valid candidates**, *or* if **“None Below”** is reached.

I also made an example interface, based on [spp.vote](https://spp.vote/) website. Votes would start by simply dragging candidates from the bottom of None Below to the top, and then if a user wanted they could click expand on the budget to separate it. The enforcement of the “Basic above extended” could be soft, we allow them to drag anything anywhere and if they accidentally made a non compliant vote we just would fix it on the UI.

[![Screenshot 2025-04-11 at 12.09.24 PM](https://discuss.ens.domains/uploads/db9688/optimized/2X/d/d2886506954c06b2a3c141d918c068cde5080070_2_690x446.jpeg)Screenshot 2025-04-11 at 12.09.24 PM1920×1243 120 KB](https://discuss.ens.domains/uploads/db9688/original/2X/d/d2886506954c06b2a3c141d918c068cde5080070.jpeg "Screenshot 2025-04-11 at 12.09.24 PM")

Another great UI that some of the teams working on this should look at is the [Pairwise Vote app](https://app.pairwise.vote/), that has been used to define the Optimism Retro funding. They show two projects and allow the voter to pick one. This could easily be done to make a “pre-ballot” game, in which the user plays the game for a few round, forcing them to be familiarized with the actual proposals, and after they were done, we would show them a ballot based on their choices in which they can then edit.

[![Screenshot 2025-04-10 at 6.09.08 PM](https://discuss.ens.domains/uploads/db9688/optimized/2X/7/77841ab7839087f3c7c9fc79182340b66567bbe5_2_690x477.jpeg)Screenshot 2025-04-10 at 6.09.08 PM4054×2808 1.09 MB](https://discuss.ens.domains/uploads/db9688/original/2X/7/77841ab7839087f3c7c9fc79182340b66567bbe5.jpeg "Screenshot 2025-04-10 at 6.09.08 PM")

---

# Post #45 by 5pence.eth
Posted at: 2025-04-11T20:36:05.019Z

[@nick.eth](/u/nick.eth) - I’m worried that having the UIs do an automatic reordering of a voter’s selection because their vote isn’t complaint with the algorithm is evidence that the approach would be too complex.  

I also worry this will lead to voter confusion and dissatisfaction with the voting process in general.

James’ amendment maintained the properties of the original process of ordering applicants, while only adding an overlay of the budget selection on top of the applicant. It was backwards compatible to the original plan.

Your approach isn’t without merit, but it doesn’t retain the original properties of ordering the applicants. I’m worried that it crosses a line since the applications have already been received.

Can you help articulate the value of your approach vs. James initial amendment specifically? What would be a sub-optimal outcome scenario that is remedied by your approach?

---

# Post #46 by nick.eth
Posted at: 2025-04-12T08:48:56.205Z

![](https://discuss.ens.domains/user_avatar/discuss.ens.domains/5pence.eth/48/10424_2.png) 5pence.eth:
> I’m worried that having the UIs do an automatic reordering of a voter’s selection because their vote isn’t complaint with the algorithm is evidence that the approach would be too complex.

Personally I think that it makes more sense for UIs to not allow you to create an invalid ballot in the first place, rather than correcting it for you if you do, for exactly this reason.

![](https://discuss.ens.domains/user_avatar/discuss.ens.domains/5pence.eth/48/10424_2.png) 5pence.eth:
> Can you help articulate the value of your approach vs. James initial amendment specifically? What would be a sub-optimal outcome scenario that is remedied by your approach?

I think I explained this in my earlier message: if a candidate has a basic scope that includes very high importance work, and an extended scope that has work that is more “nice to have”, I’m forced to either vote for the smaller scope, or to effectively rank the extended scope above other, more important work. Looking at existing proposals I expect this to be a common pattern.

---

# Post #47 by Arnold
Posted at: 2025-04-12T10:54:39.247Z

I really like idea of comparing options but I think this would need to be in the *later* bucket.

Practically the amount of “pre-ballot” games needed to build out the ballot *fairly* would be large.

Sampling only a subset would introduce bias.

The intended process of creating a ranked ballot and how it gets built up, through:

* Ranking or;
* iterating though; pairwise comparisons

Would need to be extremely clear.

---

# Post #48 by 5pence.eth
Posted at: 2025-04-12T13:57:25.168Z

![](https://discuss.ens.domains/user_avatar/discuss.ens.domains/nick.eth/48/712_2.png) nick.eth:
> if a candidate has a basic scope that includes very high importance work, and an extended scope that has work that is more “nice to have”, I’m forced to either vote for the smaller scope, or to effectively rank the extended scope above other, more important work.

You’re absolutely right about this tradeoff. The current system in SPP Season 2 is designed to rank providers first, not individual projects or budgets. This was the explicit intent stated in [[EP 6.3]](https://snapshot.box/#/s:ens.eth/proposal/0x0cca1cf36731203e235b0e2de9041be3a16d9cdeadff6e15e1f1215c611e12ef).

The original amendment operates within this provider-first paradigm. Rather than automatically defaulting to extended budgets, it adds the explicit choice between basic and extended budgets on an applicant - while preserving the core principle of ranking providers as the primary selection criteria.

I understand your position that ranking providers first might be sub-optimal in some cases. I can easily get behind the appeal of a deliverables-based system where we vote for tasks with price tags. If that’s what we want, let’s not stop at your suggestion - let’s actually do it by removing the min-max amounts, allowing any applicant to propose any number of tasks that are rankable in the vote, and really coming up with a selection mechanism that works for that system. We could even give them guidance using an RFP method for the desired projects (as has been suggested).

But making it deliverables-based or project-based would require us to rethink some fundamental aspects like KPIs. What if a team learns that their granted project isn’t going to bear fruit? After all, it was the project that was funded, not the team, so do we need to stop the funding of that project? This would also require a different application process than what we just went through.

That’s why I think the original amendment is the way to go. It’s straightforward, people will get it, and it keeps what works within the current system while giving us some of the requested budget choice that was asked for.

Again, I love your suggestions for next year, or for this year if everyone agrees to really run it back and rethink the process holistically.

Final comment - There’s a danger we push this conversation too far, if we haven’t already. Just to reiterate, we’ve had unanimous support for the original amendment in every interactive call that metagov has hosted, so it’s really hard not to believe this is the DAO’s preference. To date, you are the only delegate who has openly stated they don’t support it.

---

# Post #49 by AvsA
Posted at: 2025-04-12T17:11:01.576Z

![](https://discuss.ens.domains/user_avatar/discuss.ens.domains/5pence.eth/48/10424_2.png) 5pence.eth:
> I’m worried that having the UIs do an automatic reordering of a voter’s selection because their vote isn’t complaint with the algorithm is evidence that the approach would be too complex.  
> 
> I also worry this will lead to voter confusion and dissatisfaction with the voting process in general.
> 
> James’ amendment maintained the properties of the original process of ordering applicants, while only adding an overlay of the budget selection on top of the applicant. It was backwards compatible to the original plan.

James amendment also reorders votes: the UI (and the algorithm behind it) is always moving the votes so the two budgets are kept together. The difference is that nicks algorithm only does it when basic is under extended. Netto’s UI had a switch that was just reordering votes behind the scenes.

Maybe it’s because “reordering votes” seems bad because people think about altering a ballot. You could say simply that “the algorithm considers that if the top most ranked vote for a project is its extra amount, then it considers there was a vote for the project itself”

Regarding the UI itself, I think it will be quite straightforward. I’ll do my best to get a working demo somehow

---

# Post #50 by 5pence.eth
Posted at: 2025-04-12T17:33:46.402Z

Geez, okay, let’s dig in… ![:grinning:](https://discuss.ens.domains/images/emoji/twitter/grinning.png?v=12 ":grinning:")

![](https://discuss.ens.domains/user_avatar/discuss.ens.domains/avsa/48/1689_2.png) AvsA:
> James amendment also reorders votes: the UI (and the algorithm behind it) is always moving the votes so p

In the new proposed UIs for the original amendment, the budget options cannot be separated. There is one row for the provider. You simply also specify you budget preference.  

[![telegram-cloud-photo-size-1-5161271790721413114-y](https://discuss.ens.domains/uploads/db9688/optimized/2X/d/d98826aab100af78cae6fee17758e8655fab3fb4_2_690x261.jpeg)telegram-cloud-photo-size-1-5161271790721413114-y1280×485 44.3 KB](https://discuss.ens.domains/uploads/db9688/original/2X/d/d98826aab100af78cae6fee17758e8655fab3fb4.jpeg "telegram-cloud-photo-size-1-5161271790721413114-y")

In the example you used as to how we would support Nick’s suggestion, the budgets can be separated but then automatically reordered certain ways that are compliant. You have tool tips of a sort explaining this in your image.

[![image](https://discuss.ens.domains/uploads/db9688/optimized/2X/f/f3d61f652c9cd58b20ebc131890a6edfb624663f_2_690x424.jpeg)image1920×1182 109 KB](https://discuss.ens.domains/uploads/db9688/original/2X/f/f3d61f652c9cd58b20ebc131890a6edfb624663f.jpeg "image")

That seems like a different voter experience that includes complexity that will be tough to track if you haven’t been deeply involved in this thread.

---

I understand that your statement on re-ordering is correct in terms of the interpretation of the results from Snapshot as the source of truth, I was referring to the UI/UX voters will experience in the UIs we’re recommending they use.

That better? ![:slight_smile:](https://discuss.ens.domains/images/emoji/twitter/slight_smile.png?v=12 ":slight_smile:")

---

# Post #51 by AvsA
Posted at: 2025-04-12T17:57:47.908Z

Sorry my comment was posted too soon. There’s a complete one now available

---

# Post #52 by AvsA
Posted at: 2025-04-12T17:58:50.489Z

![](https://discuss.ens.domains/user_avatar/discuss.ens.domains/5pence.eth/48/10424_2.png) 5pence.eth:
> That seems like a different voter experience that includes complexity that will be tough to track if you haven’t been deeply involved in this thread.

I’m confident it won’t be that complicated once you get to play with it.

---

# Post #53 by 5pence.eth
Posted at: 2025-04-12T19:12:26.346Z

![](https://discuss.ens.domains/user_avatar/discuss.ens.domains/avsa/48/1689_2.png) AvsA:
> I’m confident it won’t be that complicated once you get to play with it.

Thanks Alex. I’m not doubting your ability to build something great.

I do think we’re [jumping the shark](https://en.wikipedia.org/wiki/Jumping_the_shark) with continuing past the consensus we formed on the amendment. I’ll step back a bit from this thread though as I’ve already shared my view above in [this post](https://discuss.ens.domains/t/temp-check-social-service-provider-season-2-vote-amendment-proposal/20526/48).

Appreciate all the hard work everyone has put into this discussion so far. It’s been awesome to see all the participation. ![:tada:](https://discuss.ens.domains/images/emoji/twitter/tada.png?v=12 ":tada:")

I hope we see the amendment at the top of the thread go up for a vote.

---

# Post #54 by AvsA
Posted at: 2025-04-12T19:23:40.602Z

I made a quick and dirty prototype that can help visualize how it would behave:

[claude.site](https://claude.site/artifacts/b902de08-f6e2-4978-82aa-b2ef5b64a8b3)

![](https://discuss.ens.domains/uploads/db9688/original/2X/5/575c48378e016c679706ffc6c01215feedd4b1f7.png)
### [Claude Artifact](https://claude.site/artifacts/b902de08-f6e2-4978-82aa-b2ef5b64a8b3)

Try out Artifacts created by Claude users

![](https://discuss.ens.domains/user_avatar/discuss.ens.domains/5pence.eth/48/10424_2.png) 5pence.eth:
> I hope we see the amendment at the top of the thread go up for a vote.

I believe Nick’s proposal satisfies the initial demands of delegates for more detailed expressivity but with simpler rules. If this idea had been presented first, I find it hard to believe we would even consider switching to the much more complicated amendment presented at the top of the thread.

The process isn’t a jump the shark but rather the proper way a debate should happen: delegates asked a feature, we came up with a solution, then it became optimized and streamlined into a simpler solution

---

# Post #55 by jefflau.eth
Posted at: 2025-04-13T05:09:04.750Z

![](https://discuss.ens.domains/user_avatar/discuss.ens.domains/5pence.eth/48/10424_2.png) 5pence.eth:
> so it’s really hard not to believe this is the DAO’s preference. To date, you are the only delegate who has openly stated they don’t support it.

Just to clear: I have a small amount of votes and I don’t support it. Thomas also stated he would prefer something simpler, which implies not supporting it. And Alex who was at first against, has now come around.

![](https://discuss.ens.domains/user_avatar/discuss.ens.domains/avsa/48/1689_2.png) AvsA:
> The process isn’t a jump the shark but rather the proper way a debate should happen: delegates asked a feature, we came up with a solution, then it became optimized and streamlined into a simpler solution

Absolutely agree with this. Saying that because no one initially disagreed in the initial calls that were created with 24-48 hours notice does not mean it’s the “DAO’s preference”. That is exactly what this discussion over many more days on the forums is for.

---

# Post #44 by AvsA
Posted at: 2025-04-11T18:11:12.445Z

![](https://discuss.ens.domains/user_avatar/discuss.ens.domains/nick.eth/48/712_2.png) nick.eth:
> Finally, the rules should specify that unused 2 year budget gets added to the 1 year stream.

It does. I’ve reworded the rules to simplify them: instead of there being 2 budgets that there are rules to move one to the other, I think it’s easier to think about one big 4.5M budget, but at most 1.5 of these can be used for the 2y stream. The result is the same, but there needs less rules.

![](https://discuss.ens.domains/user_avatar/discuss.ens.domains/avsa/48/1689_2.png) AvsA:
> Once ranking is complete, entries are evaluated in order, using a **total budget of $4.5 million**:
> 
> 1. Assign an entry to the **2-year stream** if it is a **current service provider**, ranked in the **top 10**, *and* assigning it would **not cause the total allocated to 2-year grants to exceed $1.5 million**.
> 2. If those conditions aren’t met, assign the entry to the **1-year stream** if its budget fits within the **remaining total budget** (regardless of the 2-year cap).
> 3. Stop the evaluation if the **$4.5M total budget** has been fully allocated, if there are **no more valid candidates**, *or* if **“None Below”** is reached.

I also made an example interface, based on [spp.vote](https://spp.vote/) website. Votes would start by simply dragging candidates from the bottom of None Below to the top, and then if a user wanted they could click expand on the budget to separate it. The enforcement of the “Basic above extended” could be soft, we allow them to drag anything anywhere and if they accidentally made a non compliant vote we just would fix it on the UI.

[![Screenshot 2025-04-11 at 12.09.24 PM](https://discuss.ens.domains/uploads/db9688/optimized/2X/d/d2886506954c06b2a3c141d918c068cde5080070_2_690x446.jpeg)Screenshot 2025-04-11 at 12.09.24 PM1920×1243 120 KB](https://discuss.ens.domains/uploads/db9688/original/2X/d/d2886506954c06b2a3c141d918c068cde5080070.jpeg "Screenshot 2025-04-11 at 12.09.24 PM")

Another great UI that some of the teams working on this should look at is the [Pairwise Vote app](https://app.pairwise.vote/), that has been used to define the Optimism Retro funding. They show two projects and allow the voter to pick one. This could easily be done to make a “pre-ballot” game, in which the user plays the game for a few round, forcing them to be familiarized with the actual proposals, and after they were done, we would show them a ballot based on their choices in which they can then edit.

[![Screenshot 2025-04-10 at 6.09.08 PM](https://discuss.ens.domains/uploads/db9688/optimized/2X/7/77841ab7839087f3c7c9fc79182340b66567bbe5_2_690x477.jpeg)Screenshot 2025-04-10 at 6.09.08 PM4054×2808 1.09 MB](https://discuss.ens.domains/uploads/db9688/original/2X/7/77841ab7839087f3c7c9fc79182340b66567bbe5.jpeg "Screenshot 2025-04-10 at 6.09.08 PM")

---

# Post #45 by 5pence.eth
Posted at: 2025-04-11T20:36:05.019Z

[@nick.eth](/u/nick.eth) - I’m worried that having the UIs do an automatic reordering of a voter’s selection because their vote isn’t complaint with the algorithm is evidence that the approach would be too complex.  

I also worry this will lead to voter confusion and dissatisfaction with the voting process in general.

James’ amendment maintained the properties of the original process of ordering applicants, while only adding an overlay of the budget selection on top of the applicant. It was backwards compatible to the original plan.

Your approach isn’t without merit, but it doesn’t retain the original properties of ordering the applicants. I’m worried that it crosses a line since the applications have already been received.

Can you help articulate the value of your approach vs. James initial amendment specifically? What would be a sub-optimal outcome scenario that is remedied by your approach?

---

# Post #46 by nick.eth
Posted at: 2025-04-12T08:48:56.205Z

![](https://discuss.ens.domains/user_avatar/discuss.ens.domains/5pence.eth/48/10424_2.png) 5pence.eth:
> I’m worried that having the UIs do an automatic reordering of a voter’s selection because their vote isn’t complaint with the algorithm is evidence that the approach would be too complex.

Personally I think that it makes more sense for UIs to not allow you to create an invalid ballot in the first place, rather than correcting it for you if you do, for exactly this reason.

![](https://discuss.ens.domains/user_avatar/discuss.ens.domains/5pence.eth/48/10424_2.png) 5pence.eth:
> Can you help articulate the value of your approach vs. James initial amendment specifically? What would be a sub-optimal outcome scenario that is remedied by your approach?

I think I explained this in my earlier message: if a candidate has a basic scope that includes very high importance work, and an extended scope that has work that is more “nice to have”, I’m forced to either vote for the smaller scope, or to effectively rank the extended scope above other, more important work. Looking at existing proposals I expect this to be a common pattern.

---

# Post #47 by Arnold
Posted at: 2025-04-12T10:54:39.247Z

I really like idea of comparing options but I think this would need to be in the *later* bucket.

Practically the amount of “pre-ballot” games needed to build out the ballot *fairly* would be large.

Sampling only a subset would introduce bias.

The intended process of creating a ranked ballot and how it gets built up, through:

* Ranking or;
* iterating though; pairwise comparisons

Would need to be extremely clear.

---

# Post #48 by 5pence.eth
Posted at: 2025-04-12T13:57:25.168Z

![](https://discuss.ens.domains/user_avatar/discuss.ens.domains/nick.eth/48/712_2.png) nick.eth:
> if a candidate has a basic scope that includes very high importance work, and an extended scope that has work that is more “nice to have”, I’m forced to either vote for the smaller scope, or to effectively rank the extended scope above other, more important work.

You’re absolutely right about this tradeoff. The current system in SPP Season 2 is designed to rank providers first, not individual projects or budgets. This was the explicit intent stated in [[EP 6.3]](https://snapshot.box/#/s:ens.eth/proposal/0x0cca1cf36731203e235b0e2de9041be3a16d9cdeadff6e15e1f1215c611e12ef).

The original amendment operates within this provider-first paradigm. Rather than automatically defaulting to extended budgets, it adds the explicit choice between basic and extended budgets on an applicant - while preserving the core principle of ranking providers as the primary selection criteria.

I understand your position that ranking providers first might be sub-optimal in some cases. I can easily get behind the appeal of a deliverables-based system where we vote for tasks with price tags. If that’s what we want, let’s not stop at your suggestion - let’s actually do it by removing the min-max amounts, allowing any applicant to propose any number of tasks that are rankable in the vote, and really coming up with a selection mechanism that works for that system. We could even give them guidance using an RFP method for the desired projects (as has been suggested).

But making it deliverables-based or project-based would require us to rethink some fundamental aspects like KPIs. What if a team learns that their granted project isn’t going to bear fruit? After all, it was the project that was funded, not the team, so do we need to stop the funding of that project? This would also require a different application process than what we just went through.

That’s why I think the original amendment is the way to go. It’s straightforward, people will get it, and it keeps what works within the current system while giving us some of the requested budget choice that was asked for.

Again, I love your suggestions for next year, or for this year if everyone agrees to really run it back and rethink the process holistically.

Final comment - There’s a danger we push this conversation too far, if we haven’t already. Just to reiterate, we’ve had unanimous support for the original amendment in every interactive call that metagov has hosted, so it’s really hard not to believe this is the DAO’s preference. To date, you are the only delegate who has openly stated they don’t support it.

---

# Post #49 by AvsA
Posted at: 2025-04-12T17:11:01.576Z

![](https://discuss.ens.domains/user_avatar/discuss.ens.domains/5pence.eth/48/10424_2.png) 5pence.eth:
> I’m worried that having the UIs do an automatic reordering of a voter’s selection because their vote isn’t complaint with the algorithm is evidence that the approach would be too complex.  
> 
> I also worry this will lead to voter confusion and dissatisfaction with the voting process in general.
> 
> James’ amendment maintained the properties of the original process of ordering applicants, while only adding an overlay of the budget selection on top of the applicant. It was backwards compatible to the original plan.

James amendment also reorders votes: the UI (and the algorithm behind it) is always moving the votes so the two budgets are kept together. The difference is that nicks algorithm only does it when basic is under extended. Netto’s UI had a switch that was just reordering votes behind the scenes.

Maybe it’s because “reordering votes” seems bad because people think about altering a ballot. You could say simply that “the algorithm considers that if the top most ranked vote for a project is its extra amount, then it considers there was a vote for the project itself”

Regarding the UI itself, I think it will be quite straightforward. I’ll do my best to get a working demo somehow

---

# Post #50 by 5pence.eth
Posted at: 2025-04-12T17:33:46.402Z

Geez, okay, let’s dig in… ![:grinning:](https://discuss.ens.domains/images/emoji/twitter/grinning.png?v=12 ":grinning:")

![](https://discuss.ens.domains/user_avatar/discuss.ens.domains/avsa/48/1689_2.png) AvsA:
> James amendment also reorders votes: the UI (and the algorithm behind it) is always moving the votes so p

In the new proposed UIs for the original amendment, the budget options cannot be separated. There is one row for the provider. You simply also specify you budget preference.  

[![telegram-cloud-photo-size-1-5161271790721413114-y](https://discuss.ens.domains/uploads/db9688/optimized/2X/d/d98826aab100af78cae6fee17758e8655fab3fb4_2_690x261.jpeg)telegram-cloud-photo-size-1-5161271790721413114-y1280×485 44.3 KB](https://discuss.ens.domains/uploads/db9688/original/2X/d/d98826aab100af78cae6fee17758e8655fab3fb4.jpeg "telegram-cloud-photo-size-1-5161271790721413114-y")

In the example you used as to how we would support Nick’s suggestion, the budgets can be separated but then automatically reordered certain ways that are compliant. You have tool tips of a sort explaining this in your image.

[![image](https://discuss.ens.domains/uploads/db9688/optimized/2X/f/f3d61f652c9cd58b20ebc131890a6edfb624663f_2_690x424.jpeg)image1920×1182 109 KB](https://discuss.ens.domains/uploads/db9688/original/2X/f/f3d61f652c9cd58b20ebc131890a6edfb624663f.jpeg "image")

That seems like a different voter experience that includes complexity that will be tough to track if you haven’t been deeply involved in this thread.

---

I understand that your statement on re-ordering is correct in terms of the interpretation of the results from Snapshot as the source of truth, I was referring to the UI/UX voters will experience in the UIs we’re recommending they use.

That better? ![:slight_smile:](https://discuss.ens.domains/images/emoji/twitter/slight_smile.png?v=12 ":slight_smile:")

---

# Post #51 by AvsA
Posted at: 2025-04-12T17:57:47.908Z

Sorry my comment was posted too soon. There’s a complete one now available

---

# Post #52 by AvsA
Posted at: 2025-04-12T17:58:50.489Z

![](https://discuss.ens.domains/user_avatar/discuss.ens.domains/5pence.eth/48/10424_2.png) 5pence.eth:
> That seems like a different voter experience that includes complexity that will be tough to track if you haven’t been deeply involved in this thread.

I’m confident it won’t be that complicated once you get to play with it.

---

# Post #53 by 5pence.eth
Posted at: 2025-04-12T19:12:26.346Z

![](https://discuss.ens.domains/user_avatar/discuss.ens.domains/avsa/48/1689_2.png) AvsA:
> I’m confident it won’t be that complicated once you get to play with it.

Thanks Alex. I’m not doubting your ability to build something great.

I do think we’re [jumping the shark](https://en.wikipedia.org/wiki/Jumping_the_shark) with continuing past the consensus we formed on the amendment. I’ll step back a bit from this thread though as I’ve already shared my view above in [this post](https://discuss.ens.domains/t/temp-check-social-service-provider-season-2-vote-amendment-proposal/20526/48).

Appreciate all the hard work everyone has put into this discussion so far. It’s been awesome to see all the participation. ![:tada:](https://discuss.ens.domains/images/emoji/twitter/tada.png?v=12 ":tada:")

I hope we see the amendment at the top of the thread go up for a vote.

---

# Post #54 by AvsA
Posted at: 2025-04-12T19:23:40.602Z

I made a quick and dirty prototype that can help visualize how it would behave:

[claude.site](https://claude.site/artifacts/b902de08-f6e2-4978-82aa-b2ef5b64a8b3)

![](https://discuss.ens.domains/uploads/db9688/original/2X/5/575c48378e016c679706ffc6c01215feedd4b1f7.png)
### [Claude Artifact](https://claude.site/artifacts/b902de08-f6e2-4978-82aa-b2ef5b64a8b3)

Try out Artifacts created by Claude users

![](https://discuss.ens.domains/user_avatar/discuss.ens.domains/5pence.eth/48/10424_2.png) 5pence.eth:
> I hope we see the amendment at the top of the thread go up for a vote.

I believe Nick’s proposal satisfies the initial demands of delegates for more detailed expressivity but with simpler rules. If this idea had been presented first, I find it hard to believe we would even consider switching to the much more complicated amendment presented at the top of the thread.

The process isn’t a jump the shark but rather the proper way a debate should happen: delegates asked a feature, we came up with a solution, then it became optimized and streamlined into a simpler solution

---

# Post #55 by jefflau.eth
Posted at: 2025-04-13T05:09:04.750Z

![](https://discuss.ens.domains/user_avatar/discuss.ens.domains/5pence.eth/48/10424_2.png) 5pence.eth:
> so it’s really hard not to believe this is the DAO’s preference. To date, you are the only delegate who has openly stated they don’t support it.

Just to clear: I have a small amount of votes and I don’t support it. Thomas also stated he would prefer something simpler, which implies not supporting it. And Alex who was at first against, has now come around.

![](https://discuss.ens.domains/user_avatar/discuss.ens.domains/avsa/48/1689_2.png) AvsA:
> The process isn’t a jump the shark but rather the proper way a debate should happen: delegates asked a feature, we came up with a solution, then it became optimized and streamlined into a simpler solution

Absolutely agree with this. Saying that because no one initially disagreed in the initial calls that were created with 24-48 hours notice does not mean it’s the “DAO’s preference”. That is exactly what this discussion over many more days on the forums is for.

---

# Post #56 by nick.eth
Posted at: 2025-04-13T06:49:10.781Z

![](https://discuss.ens.domains/user_avatar/discuss.ens.domains/5pence.eth/48/10424_2.png) 5pence.eth:
> I understand your position that ranking providers first might be sub-optimal in some cases. I can easily get behind the appeal of a deliverables-based system where we vote for tasks with price tags. If that’s what we want, let’s not stop at your suggestion - let’s actually do it by removing the min-max amounts, allowing any applicant to propose any number of tasks that are rankable in the vote, and really coming up with a selection mechanism that works for that system. We could even give them guidance using an RFP method for the desired projects (as has been suggested).
> 
> But making it deliverables-based or project-based would require us to rethink some fundamental aspects like KPIs. What if a team learns that their granted project isn’t going to bear fruit? After all, it was the project that was funded, not the team, so do we need to stop the funding of that project? This would also require a different application process than what we just went through.

That is absolutely not what is happening in the version most recently suggested by me and expanded on by Alex. Delegates are still voting for teams, just now with the flexibility to consider the extended budget as a separate line item to the base budget. It doesn’t require any structural changes from metagov or the program, and it doesn’t require any changes from delegates beyond any tweaks they were considering to the allocation between basic and extended scope as a result of the wider discussion.

It seems like a bad idea to me to pick a more complex and risky algorithm that’s less expressive simply because it came first; iteration is how we find the best ideas. Rushing to adopt the first solution seems to me like an organizational version of the risks of doing things under urgency that I raised concerns about earlier.

---

# Post #57 by James
Posted at: 2025-04-13T10:29:32.626Z

![](https://discuss.ens.domains/user_avatar/discuss.ens.domains/jefflau.eth/48/1850_2.png) jefflau.eth:
> Absolutely agree with this. Saying that because no one initially disagreed in the initial calls that were created with 24-48 hours notice does not mean it’s the “DAO’s preference”. That is exactly what this discussion over many more days on the forums is for.

**Just to be clear about timelines:**

* There was the first ever delegate all hands metagov call where all delegates were encouraged to join that was announced a month in advanced. [See here.](https://discuss.ens.domains/t/delegate-all-hands-new-focus-for-first-metagov-call-each-month/20346)
* On this call it was highlighted that delegates should be able to express a vote on basic vs extended scopes.
* This was discussed for the week, the amendment above was created.
* There was another metagov call a week after the all hands where again the amendment was discussed and there was **agreement** that as long as the UI providers were confident/happy this would go to a vote.

Forum discussion has of course continued but that doesn’t change the outcome from the last metagov call, as such the proposal is [now live.](https://snapshot.box/#/s:ens.eth/proposal/0xf0c3a2fe4bd085ea74a072cafb830aaadb4830b557a3d122eab36058a17c1860)

---

# Post #58 by 5pence.eth
Posted at: 2025-04-13T13:28:43.157Z

![](https://discuss.ens.domains/user_avatar/discuss.ens.domains/jefflau.eth/48/1850_2.png) jefflau.eth:
> Saying that because no one initially disagreed in the initial calls that were created with 24-48 hours notice does not mean it’s the “DAO’s preference”. That is exactly what this discussion over many more days on the forums is for.

[@jeff](/u/jeff), This amendment was built in 3 different synchronous meetings across an 8 - 10 day period. The meetings were announced a month in advance and open to all. The meetings were hours long, and during that 10 day period we had constant collaborative communication across the multiple teams building prototype UIs to support the amendment, and we supported many teams who were curious how the outcome would change things for them.

A great deal of work was put into it by a lot of people, and it was universally supported. There wasn’t a single conversation participant who had a concern that wasn’t met and/or discussed, and not a single participant in the calls said they wouldn’t vote for it. It was honestly a really impressive show of governance coordination, and I think all who participated were impressed with the teamwork.

That’s the reason for the statement you quoted here, and I still stand by it.

![](https://discuss.ens.domains/user_avatar/discuss.ens.domains/jefflau.eth/48/1850_2.png) jefflau.eth:
> ![](https://discuss.ens.domains/user_avatar/discuss.ens.domains/5pence.eth/48/10424_2.png) 5pence.eth:
> > so it’s really hard not to believe this is the DAO’s preference. To date, you are the only delegate who has openly stated they don’t support it.
> 
> Just to clear: I have a small amount of votes and I don’t support it. Thomas also stated he would prefer something simpler, which implies not supporting it. And Alex who was at first against, has now come around.

My statement about only Nick dissenting was inaccurate. You’re right, you had expressed a preference for Nick’s plan after he announced it.

Yes, I’m, sure more ideas can be found and proposed, as Alex has now done. But we’re really arguing about some tiny nuance here when we had a perfectly good solution that had consensus.

Are these outcomes really so different that it requires this competition of ideas? Does the 2nd amendment really have so much difference that we’re going through this duel?  

The difference is under the covers mostly, which leads me to believe we’re pushing too far in continuing to try to come up with different ways to count the same votes.

---

# Post #59 by nick.eth
Posted at: 2025-04-14T09:41:38.893Z

![](https://discuss.ens.domains/user_avatar/discuss.ens.domains/5pence.eth/48/10424_2.png) 5pence.eth:
> This amendment was built in 3 different synchronous meetings across an 8 - 10 day period. The meetings were announced a month in advance and open to all.

To the best of my knowledge, no agenda was published ahead of time, meaning there was no way to know that this would be a topic of discussion. The second meeting was scheduled for the same time the following day, with less than 24 hours’ notice. I’m not sure when this third meeting was, because despite being actively involved in the conversation as soon as I was aware of it, I don’t appear to have received an invite.

So pointing at the 3 week notice that was given for the “All Hands” call with no agenda as evidence that there was plenty of time to participate does not give an accurate picture of the situation.

The process to build out this new UI appears to have started as soon as the first meeting was concluded, without any attempt to determine what people who were not present in the meeting thought of the idea.

![](https://discuss.ens.domains/user_avatar/discuss.ens.domains/5pence.eth/48/10424_2.png) 5pence.eth:
> A great deal of work was put into it by a lot of people, and it was universally supported. There wasn’t a single conversation participant who had a concern that wasn’t met and/or discussed, and not a single participant in the calls said they wouldn’t vote for it.

I have been present in the Telegram discussions since I became aware this was being discussed. I had concerns that were not met, and said I would not vote for it, so this is untrue.

![](https://discuss.ens.domains/user_avatar/discuss.ens.domains/5pence.eth/48/10424_2.png) 5pence.eth:
> Yes, I’m, sure more ideas can be found and proposed, as Alex has now done. But we’re really arguing about some tiny nuance here when we had a perfectly good solution that had consensus.

The distinction between the proposals is far from a “tiny nuance”. The originally proposed solution significantly complicates the voting algorithm and introduces new risks, and the rush with which it has been pushed through really concerns me.

![](https://discuss.ens.domains/user_avatar/discuss.ens.domains/5pence.eth/48/10424_2.png) 5pence.eth:
> Are these outcomes really so different that it requires this competition of ideas? Does the 2nd amendment really have so much difference that we’re going through this duel?  
> 
> The difference is under the covers mostly, which leads me to believe we’re pushing too far in continuing to try to come up with different ways to count the same votes.

Yes. The alternative proposal better allows delegates to express their preferences in what I expect is a really common situation - where a provider puts their most essential work in the basic scope, and less essential work in an extended scope. More importantly, it’s significantly less complex and risky to implement.

The fact that one idea was proposed a few days before the other should not be material here, and we should not be trying to rush through significant changes without giving them careful consideration. The fact you’re trying to cite the first proposal’s primacy as a reason to bypass discussion on the second proposal demonstrates that your claim this is not controversial is inaccurate, too.

---

# Post #60 by nick.eth
Posted at: 2025-04-14T09:49:08.087Z

FYI delegates: Last night [@James](/u/james) put forward the proposal discussed in this thread to Snapshot for a yes/no vote, bypassing the general consensus amongst participants that both proposals were going to be discussed at the next Metagov meeting.

In response, Alex has written up and put forward the second proposal for its own vote. He has written it such that whichever of the two proposals receives the larger number of votes (presuming both reach quorum) will be accepted.

I’m sorry this has put additional burden on delegates to now evaluate and consider two separate proposals, rather than giving the working group time to either consider and adopt a single proposal, or to put forward a multiple-choice option for voting.

James’s proposal is [here](https://snapshot.box/#/s:ens.eth/proposal/0xf0c3a2fe4bd085ea74a072cafb830aaadb4830b557a3d122eab36058a17c1860).  

The proposal from Alex and I is [here](https://snapshot.box/#/s:ens.eth/proposal/0x60c95ab69a427ce263f4c3c950df8da1134e96a3e76d139c8dac366271009530).

Please vote on whichever of the two you believe should be enacted - or ‘no’ on both if you are happy with the current rules.

---

# Post #61 by James
Posted at: 2025-04-14T10:17:58.617Z

![](https://discuss.ens.domains/user_avatar/discuss.ens.domains/nick.eth/48/712_2.png) nick.eth:
> bypassing the general consensus amongst participants

This is the crux of the discussion Nick.

Your disagreeing with MetaGov stewards, disagreeing with service providers and delegates that have been engaging in discussion. I think Spence summed it up well here:

![](https://discuss.ens.domains/user_avatar/discuss.ens.domains/5pence.eth/48/10424_2.png) 5pence.eth:
> Does the 2nd amendment really have so much difference that we’re going through this duel?

If anyone else was engaging in the way you are it would have already been disregarded. We all know you founded ENS, but let the DAO have some ability to engage in genuine discourse (like we have over the passed 2 weeks over multiple open calls that you choose not to join).

---

# Post #62 by nick.eth
Posted at: 2025-04-14T10:19:22.797Z

![](https://discuss.ens.domains/user_avatar/discuss.ens.domains/james/48/506_2.png) James:
> If anyone else was engaging in the way you are it would have already been disregarded. We all know you founded ENS, but let the DAO have some ability to engage in genuine discourse (like we have over the passed 2 weeks over multiple open calls that you choose not to join).

“Let[ting] the DAO have some ability to engage in genuine discourse” is exactly what I am trying to do - by putting forward an alternate proposal and discussing it - and what you are trying to circumvent by starting a vote on your proposal while it is still being actively discussed.

---

# Post #63 by AvsA
Posted at: 2025-04-14T16:08:02.745Z

I’ve made an updated [Voting Demo for voting with EP6.5](https://claude.site/artifacts/f8c81d83-5c1f-4ab9-8b76-a13a1f5d0252):

[![Screenshot 2025-04-14 at 1.06.37 PM](https://discuss.ens.domains/uploads/db9688/optimized/2X/7/7d005249996f6f1a80d83567473338a46142d102_2_428x500.png)Screenshot 2025-04-14 at 1.06.37 PM1596×1862 268 KB](https://discuss.ens.domains/uploads/db9688/original/2X/7/7d005249996f6f1a80d83567473338a46142d102.png "Screenshot 2025-04-14 at 1.06.37 PM")

I am now very confident that this solution can be both simple to use and expressive, specially if combined with a [Pairwisevote](http://app.pairwise.vote) style match to create a “pre-ballot”.

---

