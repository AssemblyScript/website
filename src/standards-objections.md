# Standards objections

In extraordinary circumstances, when collaboration towards eventual resolution is no longer deemed possible, AssemblyScript may object to individual efforts in context of WebAssembly standardization. This page covers our objections and their relevant context.

## W3C WebAssembly Working and Community Group

After thorough consideration, AssemblyScript considers WASI, derived proposals, the W3C's endorsement of its subgroup and the Bytecode Alliance's practices, that not all of their respective members necessarily are aware and/or approve of, harmful to open standards in general and the WebAssembly specification in particular.

### WASI, 2022-09

[WASI](https://github.com/WebAssembly/WASI/) is a POSIX-like import namespace for non-Web WebAssembly that provides a [set of external functions](https://github.com/WebAssembly/WASI/blob/main/phases/snapshot/witx/wasi_snapshot_preview1.witx) such as `fd_write` inspired by a low-level layer exposed in systems programming languages such as C++ and Rust, but not on the Web platform. WASI, which is [marketed as](https://wasi.dev/) [a standard](https://bytecodealliance.org/) in close proximity to an official W3C standardization effort, has little overlap with [WebAssembly's scope](https://www.w3.org/2020/03/webassembly-wg-charter#scope) and [high-level goals](https://webassembly.org/docs/high-level-goals/), and is governed by a powerful and largely independent-acting W3C subgroup working towards [select custom goals](https://github.com/WebAssembly/WASI#wasi-high-level-goals). Over time, the WASI subgroup has expanded its scope, devising [its own proposals](https://github.com/WebAssembly/WASI/blob/main/Proposals.md) that in part compete with established or currently devised Web standards, nowadays promoting fragmentation in tension with the purpose of standards. As part of the disconnect, we have been exposed to a modus operandi of abuse of power when voicing concerns, where our representatives have been systematically discriminated and their concerns silenced, for example by the WASI chair [under a pretense with appended derogatory retrospective](https://github.com/WebAssembly/WASI/issues/401#issuecomment-918476260), with the outcome that concerns expressed remain unaddressed.

All in all, WASI and the WASI group make it almost impossible for other participants to [pursue](https://github.com/AssemblyScript/universal-strings) [efforts](https://github.com/AssemblyScript/system-essentials) aligned with WebAssembly's goals, many of which solely exist on paper today to the broader community's astonishment, while WASI's concepts and ideas continue to diffuse into everything WebAssembly, progressing a premature ecosystem split that is ironically mediated via the standard itself.

Our assessment of WASI's relation to several of [WebAssembly's high-level goals](https://webassembly.org/docs/high-level-goals/) and values is as follows:

| Communicated technical goal                                                                  | Assessment
|----------------------------------------------------------------------------------------------|-------------
| **Portable**<br />While it can be [polyfilled](https://wasi.dev/polyfill/polyfill.js), WASI is not a reasonably portable abstraction for high-level languages / the Web. | <Badge text="In violation" type="error"/>
| **Support for languages other than C/C++** (and Rust)<br />Languages that would naturally fit the Web platform not only are overlooked, but WASI's self-imposed abstinence of Web concepts undermines other languages' interoperability potential with JS and the Web platform specifically. | <Badge text="In violation" type="error"/>
| **Execute within and integrate well with the existing Web platform**<br />WASI does not integrate with the existing Web platform but fundamentally competes with it. | <Badge text="In violation" type="error"/>
| **Maintain the versionless, feature-tested and backwards-compatible evolution story of the Web**<br />WASI's concepts are not [backwards-compatible](https://www.w3.org/People/Bos/DesignGuide/compatibility.html) with Web platform concepts. | <Badge text="In violation" type="error"/>
| **Execute in the same semantic universe as JavaScript**<br/> WASI's semantics fundamentally differ from JavaScript's, effectively establishing an alternative universe. | <Badge text="In violation" type="error"/>
| **Access browser functionality through the same Web APIs that are accessible to JavaScript**<br />WASI is unconcerned with Web APIs and JavaScript and its group refuses to take their existence into account. | <Badge text="In violation" type="error"/>
| **Promote other compilers and tools targeting WebAssembly**<br />WASI stifles other compilers and breaks other languages through introduction of inefficiency and incompatibility. | <Badge text="In violation" type="error"/>

| Communicated organizational value                              | Assessment
|----------------------------------------------------------------|-------------
| [Charter](https://www.w3.org/2020/03/webassembly-wg-charter)<br />WASI's adherence to scope, participation, communication and decision policy is generally questionable. Specifically, WASI's deliverables certainly do not "interoperate gracefully with JavaScript and the Web".| <Badge text="In violation" type="error"/>
| [CEPC](https://www.w3.org/Consortium/cepc/)<br />The WASI group systematically abuses the CEPC to "win" losing arguments. | <Badge text="In violation" type="error"/>

Summarized, WASI has little overlap with technical goals and organizational values in Web standards in general and the WebAssembly specification in particular. Its subgroup nourishes a discriminatory and exclusionary environment to its own advantage which lopsidedly reinforces its technical bias. It is our impression that the WASI group deliberately applies said practices in order to [strongly disadvantage its competitors](https://en.wikipedia.org/wiki/Embrace,_extend,_and_extinguish), willingly taking chances that the overall standardization effort is profoundly damaged.

Concrete technical or related concerns we have voiced that remained unaddressed are:

* For languages that are a natural fit for the Web platform, WASI leads to a [shim in Wasm](https://github.com/AssemblyScript/wasi-shim) and, lacking alternatives, a polyfill in JS, with conceptional breakage in between, indicating that it is not the right abstraction to support many programming languages well.
* WASI mandates concepts uncommon on the Web (for e.g. [strings](./stdlib/string.md#considerations)) that are fundamentally incompatible with Java-like languages and JavaScript, indicating that it is not a reasonable abstraction when compatibility with the existing Web platform is the goal.
  <p align="center"><img src="/images/wasi-mismatch.svg" alt="Diagram of cause and effect of WASI's choices." /></p>
* WASI introduces redundancy where functionality available on the Web platform is eagerly implemented differently on top of WASI.
* Overuse of WASI leads to code bloat in WebAssembly on the Web / in browsers, where code size arguably matters the most.
* WASI promotes fragmentation by introducing the requirement to recompile modules for different environments.
* WASI promotes fragmentation through eagerly extending its scope and independently devising competing APIs.

Nonetheless, we are open to consider re-engagement with WASI as a custom effort given that the following conditions are met:

* Relocation of WASI repositories and venues out of the W3C / WebAssembly organization to
  * a) clearly indicate its not necessarily aligned non-polyglot, non-Web approach and
  * b) end the detrimental effects of endorsement over all other efforts.
* Clear communication that WASI is unconcerned with many of WebAssembly's overall goals and the existing Web platform.
* An acknowledgement of wrongdoing and sincere apology to lessen the suffering of those discriminated, discredited and excluded.
* The presence of well-intention and honesty and the absence of political finesse when addressing the conditions.

We recommend to the WebAssembly CG to ensure that the first condition is fulfilled in any case as we expect that failure to do so will prolong the endorsement's emergent political properties that run counter to rational and constructive technical discourse.

### Component Model, 2022-09

The same considerations as for WASI apply to its [Component Model](https://github.com/WebAssembly/component-model), a proposal to define "portable, virtualizable, statically-analyzable, capability-safe, language-agnostic interfaces, *especially those being defined by WASI*" for all of WebAssembly, that, even though it does not make the connection obvious, is aptly named the "WASI Component Model" by those in the know <sup>[1](https://github.com/WebAssembly/meetings/pull/1042) [2](https://twitter.com/ralph_squillace/status/1557052975318704128) [3](https://twitter.com/cohix/status/1522390993689092103)</sup>. The Component Model not only cements WASI's preferences as the standard's foundation, but has almost silently replaced long awaited proposals such as [JS+DOM](https://github.com/WebAssembly/interface-types/blob/939e521fd1863710bcab588c0da83b130a6d562b/proposals/jsdom/Overview.md), [WebIDL bindings](https://github.com/WebAssembly/interface-types/blob/1c46f9fe30143867545c9747fa8a94b72e5d9737/proposals/webidl-bindings/Explainer.md) and [Interface Types](https://github.com/WebAssembly/interface-types), even though improvements to Wasm/JS interoperability are commonly considered obvious wins yet surprisingly remain absent from the WebAssembly platform. So far we haven't seen any credible evidence that would support the drift away from bindings to the differently scoped Component Model, and suspect strategical reasons.

Our assessment of the Component Model's relation to several of WebAssembly's high-level goals and values is identical to our [assessment on WASI above](#wasi-2022-09), whereas the Component Model affects all of WebAssembly while violating important properties such as compatibility and security. Our assessment of the Component Model's relation to several of [its own goals](https://github.com/WebAssembly/component-model/blob/main/design/high-level/Goals.md) is as follows:

| Communicated technical goal                            | Assessment
|--------------------------------------------------------|-------------
| **Portable, cross-language composition**<br />Works if all languages involved are Rust-like. Breaks in all other cases, incl. when interfacing with JS / Web APIs. | <Badge text="In violation" type="error"/>
| **Language neutrality**<br />The Component Model only supports one family of programming languages — the exact bias it claims to avoid. | <Badge text="In violation" type="error"/>
| **Formal semantics**<br />The Component Model is not defined in the same semantic framework as core Wasm, which is the Web platform. | <Badge text="In violation" type="error"/>
| **Web platform integration**<br />The Component Model undermines Web platform integration for languages that would otherwise be a natural fit. | <Badge text="In violation" type="error"/>

Concrete technical or related concerns we have voiced that remained unaddressed are:

* The Component Model unnecessarily restricts its concepts (for e.g. [strings](./stdlib/string.md#considerations)), introducing incompatibility and security issues via target-oriented design choices like its "canonical ABI" or a questionable distinction between "external" and "internal" function calls, where the distinction conveniently does not make a difference for WASI's audience yet "external" calls break Web-, JS- and self-interop for any language that would naturally fit the Web platform. Support for affected use cases is not proposed by the Component Model.
  <p align="center"><img src="/images/component-mismatch.svg" alt="Diagram of cause and effect of the Component Model's choices." /></p>
* The Component Model proposes Rust/non-Web concepts exclusively, with Java-like/Web platform concepts nowhere to be found.
* The Component Model's chosen "canonical ABI" needlessly biases WebAssembly against the Web platform in favor of C++ and Rust.
* The Component Model states the goals of "language neutrality" and "Web platform integration", which it exactly does not honor.
* Using the Component Model for ESM-integration will break the Web platform on the fundamental level of function calls, say when JavaScript modules, including transparently in dependencies, are upgraded to or otherwise replaced with WebAssembly modules.

Various process discrepancies respectively violations have been observed over the course of the Component Model being established:

* In May 2020, the champion of the Component Model proposal (Interface Types at the time) [acknowledged](https://github.com/WebAssembly/interface-types/issues/13#issuecomment-629551175) that Interface Types' preferred choice of semantics does not match Java-like languages, including JavaScript, and that it would be technically trivial to support Java-like respectively Web platform semantics as well. The group signaled support for the resolution. However, in a later rebase commit that didn't indicate a connection, the [exact opposite](https://github.com/WebAssembly/interface-types/commit/0aff42835d21da9eff76e453ffd10059bdf1b2b2#diff-c72566c5d5642f33f2456d620cca134ddab373743a9b9eda227941792db5e57aR849-R856) was committed and justified with nonsensical prose:
  > While the canonical representation of all the numeric types are obvious, due to their fixed-power-of-2 sizes, `char` requires the proposal to choose an arbitrary character encoding. To match the core wasm spec's [choice of UTF-8](https://webassembly.github.io/spec/core/binary/values.html#binary-utf8), and the more general trend of ["UTF-8 Everywhere"](http://utf8everywhere.org/), this proposal also chooses UTF-8. By choosing a canonical string encoding happy path while providing a graceful fallback to efficient transcoding, Interface Types provides a gentle pressure to eventually converge without performance cliffs in the meantime.

  First, there is a better than an arbitrary choice: Do what the Web platform does. Second, a file format's choice has little to do with the requirements of API calls. Third, "UTF-8 Everywhere" is an opinion piece by people who publicly state that JavaScript, still WebAssembly's primary interop language, is harmful. Fourth, there is no "happy path", no "graceful fallback" and no "efficient transcoding" for Java-like languages and JavaScript interop. Fifth, it is not any proposal's business to provide pressure against the Web platform. Sixth, eventual convergence is impossible due to hard backwards-compatibility constraints. Seventh, surely there will be performance cliffs, even worse incompatibility, not just in the meantime, but forever if the most fundamental building block, the `char` type, is already artificially restricted. Unicode code points would instead have been a compatible choice.

* In May 2021, a series of polls [was proposed](https://github.com/WebAssembly/meetings/pull/772) to the CG's meeting agenda to establish the Component Model. The [accompanying presentation](https://docs.google.com/presentation/d/1PSC3Q5oFsJEaYyV5lNJvVgh-SNxhySWUqZ6puyojMi8) contained inaccurate "Proposed next steps" to justify a single "canonical ABI" that would inscribe WASI's semantic choices, calling anything else "just an optimization", which is obviously untrue, while sidestepping "hard design questions", which, also given the prior acknowledgement, is a stretch. A clarifying presentation to inform the group about the implications [was proposed](https://github.com/WebAssembly/meetings/pull/775) by AssemblyScript, which was simply rejected to be given before the polls would take place.
* AssemblyScript nonetheless hurried to publish an [issue with the presentation attached](https://github.com/WebAssembly/design/issues/1419) the weekend before the polls would take place. Issue and presentation remained unaddressed until the polls had passed. In the [discussion before the polls](https://github.com/WebAssembly/meetings/blob/main/main/2021/CG-05-25.md#proposals-and-discussions), the concerns were mentioned, but the line of thought harshly interrupted mid-sentence by an Interface Types champion so the concern was not adequately discussed. The polls subsequently passed with the WASI lobby voting in favor. The AssemblyScript representative voted "against" as he was advised by a member of the WebAssembly WG to not vote strongly. It was said doing so would be considered bad practice. During the discussion, an Interface Types champion clarified upon request by another member that the poll would not prescribe specific semantics, which later turned out to be untrue, yet likely convinced more people to vote neutral or in favor.
* In preparation for their presentation, the AssemblyScript representative requested an ongoing invite to the WASI subgroup's meetings, where Interface Types' and later the Component Model's design choices are first presented. He was first not admitted based on vague conduct accusations by the WASI chair, and after politely agreeing to special rules was only admitted to a single meeting and discouraged from speaking up, with the WASI chair stating that the concerns were uninteresting and nobody would address them anyhow. Meanwhile, one day after proposing the Component Model, the WASI subgroup had [declared itself an equal part](https://github.com/WebAssembly/meetings/pull/773) of the standardization process regardless of the many prior process and organizational discrepancies its endorsement had already fueled. Other chairs ignored the recent incident when the AssemblyScript representative asked for help when suspecting foul play. Eventually, the WASI chair suggested publicly that the male individual might have made her [uncomfortable on her personal Twitter account](https://github.com/WebAssembly/interface-types/issues/135#issuecomment-881549609), a potentially career-ending move, even though there has never been a personal correspondence.
* After the polls, in June 2021, a Google employee authored [two](https://github.com/w3ctag/design-principles/issues/323) [threads](https://github.com/w3ctag/design-principles/issues/322) in the W3C Technical Architecture Group that would break JavaScript string semantics and thus compatibility with the Web platform by design principle. Only days later, the existence of the threads was used as part of a [list of similarly natured arguments](https://github.com/WebAssembly/interface-types/issues/135) to justify breaking with JavaScript/Web platform semantics.
* In a discussion slot nonetheless requested in a later meeting in June 2021, an Interface Types champion [filibustered](https://github.com/WebAssembly/meetings/blob/main/main/2021/CG-06-22.md#discussion-webassembly-unicode-and-the-web-platform-pre-recorded-see-linked-issue-slides-20-mins). When time ran out, a CG chair suggested a follow-up meeting. The follow-up meeting was cancelled shortly after, stating "reluctance". The group was not informed, even though requested. An orderly Interface Types subgroup was not established, even though suggested, so both Interface Types and the Component Model remain specified in the largely independent-acting WASI subgroup until today.
* For an August 2021 meeting, a [summary and hard-to-grasp poll](https://github.com/WebAssembly/meetings/pull/820) were added to the CG meeting agenda by the Component Model champion. AssemblyScript [requested](https://github.com/WebAssembly/meetings/pull/830) to clarify the poll's text by at least referencing the respective WebIDL concepts so more people would understand what is voted for, which was collectively rejected by WG members and chairs. Our renewed [concerns and suggestions](https://github.com/WebAssembly/interface-types/issues/135#issuecomment-890743678) were [cleverly bypassed](https://github.com/WebAssembly/meetings/blob/main/main/2021/CG-08-03.md#discussions) during the final decision process (see next item).
* In the August 2021 meeting, the Component Model champion did not present [a summary according to their agenda item](https://github.com/WebAssembly/meetings/blob/main/main/2021/CG-08-03.md#agenda-items) but one-sided [arguments in favor](https://docs.google.com/presentation/d/1qVbBsDFmremBGVKiOAzRk7svjinNq6LXfJ1DzeFwKtc), even though it was [clarified beforehand](https://github.com/WebAssembly/meetings/pull/845) that the champion would summarize. The May 2021 poll, that was said to not prescribe specific semantics, was used as an argument to decide for specific semantics. The polls then passed, with the WASI lobby voting in favor. Two members disagreed strongly this time and were ridiculed by the group for voicing frustration at the end of the meeting. Their strong votes made no difference. Other AssemblyScript contributors later voiced that they didn't understand what was being voted for respectively were surprised by the one-sided presentation.
* In September 2021, the Component Model repository was created, ironically [stating the goals](https://github.com/WebAssembly/component-model/blob/d334e4db4a1cef4902871555cf4283e4114fefa5/design/high-level/Goals.md) of "language neutrality" and "Web platform integration", both of which are exactly not being honored respectively undermined by the Component Model.
* Also in September 2021, a [big picture discussion](https://github.com/WebAssembly/WASI/issues/401#issuecomment-918476260) in context of WASI and in spirit of this objection was closed and locked under a pretense, the latter of which is untypical, by the WASI chair. An unsolicited retrospective was attached, painting the AssemblyScript representative, who cannot respond, in a bad light. The representative later complained to the [W3C ombuds](https://www.w3.org/Consortium/pwe/#ombuds) about the action. The ombuds didn't respond, instead the chairs disregarded the complaint, the WASI chair edited and doubled-down on their closing comment, and when finally voicing major frustration regarding the series of process violations and discrepancies the AssemblyScript representative was banned from participating in the WebAssembly organization in all forms by the W3C CEO upon request of the WASI chair. A list of foregoing process and conduct violations similar to this one was provided in response, but was disregarded.

As such, we have reason to believe that the events surrounding the Component Model are politically motivated, whereas technical facts have either been misrepresented or ignored, and people been discouraged, discriminated and excluded with the intent to silence them.

Even though we consider the process and conduct violations in context of the Component Model extraordinarily serious and the amount of technical disinformation and bias unacceptable, we are open to a constructive re-engagement with a revised Component Model proposal given that the following conditions are met:

* Freezing the Component Model proposal until Wasm/JS interoperability has been significantly improved, mitigating risks of premature standardization ahead of the market respectively in dangerous contradiction to WebAssembly's overall goals.
* A firmly established commitment to [consider compatibility with the Open Web Platform critically important](https://github.com/WebAssembly/design/issues/1407).
* An acknowledgement of wrongdoing and actual adherence to Wasm's and the Component Model's communicated goals.
* The presence of well-intention and honesty and the absence of political finesse when addressing the conditions.

If not possible or refused, we recommend to the WebAssembly CG to delegitimize the Component Model proposal and to not advance it any further, since standardizing it would prematurely bias WebAssembly against the existing Web platform respectively against exactly those programming languages that would fit the Web platform by design, which is, given the power constellation and consequent experience, almost certainly forever, and as such would set a fatal precedent that politically undermining purpose and goals of W3C standardization efforts with questionable practices is a viable and, even worse, legitimate strategy.

### Notes on the W3C

Even though the W3C is undoubtedly aware, its role in context of the events remains unclear to us. Regardless of our bad experience, we obviously agree that a respectable standardization body should responsibly shepherd the WebAssembly standardization effort, and we are open to extend our engagement with the W3C given that the following conditions are met:

* Relocation of WASI repositories and venues out of the W3C / WebAssembly organization to end the detrimental endorsement.
* The appointment of reasonably neutral and responsible chairs to re-establish trust into the W3C's processes and values.
* Removal of members who have abused the CEPC to discriminate and exclude members for voicing their opinion.
* A firmly established commitment to [consider compatibility with the Open Web Platform critically important](https://github.com/WebAssembly/design/issues/1407).
* An acknowledgement of wrongdoing and sincere apology to lessen the suffering of those systematically mistreated.
* The presence of well-intention and honesty and the absence of political finesse when addressing the conditions.

If not possible or refused, we recommend to the community to investigate whether Ecma would be a more suitable venue. We recognize that there is no such path if the browser vendors have an interest to leave the situation suboptimal at their discretion.

### Notes on the Bytecode Alliance

We are skeptical of a re-engagement with the Bytecode Alliance, a coalition of several tech giants and select collaborators [that is](https://bytecodealliance.org) "dedicated to creating … *new* software foundations, building on *standards* such as … *WASI*". Its founding members [describe](https://bytecodealliance.org/press/formation) the dawn of WebAssembly as an "opportunity to fix what’s broken" (presumably the Web), "build new foundations for native development" (presumably a non-Web), while taking "*deliberate*, cross-industry action to ensure this happens in *the right way*" (likely explaining the political properties). Subsequently, from what we've witnessed, it appears to selectively empower respectively weaken players in the WebAssembly space, applies questionable [process values](https://bytecodealliance.org/mission#process-values) such as "disagree and commit" that are, realistically, suitable to break anything, including its own [technical values](https://bytecodealliance.org/mission#technical-values), solely by authoritative claim, and, if our experience with its management-level figures taught us anything, operates well beyond the limits of its purported [social values](https://bytecodealliance.org/mission#social-values) of "collaboration", "inclusiveness" and "openness". Given its not strictly necessary but remarkable concentration of power, and that its members' actions in context of a supposedly open and collaborative standardization effort speak a very clear language, we'd like to caution the public to keep an eye on potential anti-competitive practices that would indicate the need for antitrust legislation to step in. We recognize that not all members of the Bytecode Alliance necessarily are aware and/or approve of its surface-level actions, since several of them have engaged with us in good faith, even though the Bytecode Alliance's representatives have not. All in all we believe that WebAssembly, and in turn the Web, would be better off without it, since realistically, the processes and venues to drive its ideas already exist, but now are at risk to be rendered dysfunctional by the deliberateness of its operation.

### Ecosystem considerations

We believe that the WebAssembly standard, its ecosystem, the Web platform, its stakeholders and the public would benefit immensely from [compatibility of WebAssembly with the existing Web platform](https://github.com/WebAssembly/design/issues/1407) while putting an emphasis on fostering a truly open and collaborative space where everyone can participate without fear of harassment, so ideas can be exchanged, many more programming languages and use cases become viable and the Web's principles and values are adhered to. We see negative value in an arbitrarily neutered technology that was taken over by politics while ignoring technical concerns, well-established facts and broad public interest. No amount of creative marketing and political finesse will make up for the enormous damage a select few's divisive efforts are doing to the WebAssembly technology that amazed us with the promise to bring many programming languages and use cases not only to the Web but their people closer together. Given that use cases that would fit the Web platform are artificially disadvantaged, while hard to pick up programming languages and often metered use cases with diverging concepts are irrationally advantaged, we thus look with sorrow not only towards the future of the Web platform but also towards the various new endeavors in the WebAssembly space, since, in its current politically constrained form that is stripping Wasm of its true potential while simultaneously introducing portability, compatibility and security problems, the market will likely not grow large enough soon enough to support them all. As such we believe that it is in almost everyone's best interest to ensure that purpose, goals and values of open Web standards are honored, which currently is, frankly, not the case — and sadly, the situation is reinforced by many who put almost religious programming language preference, predatory business practices in support of non-Web use cases or the interplay of both over a once so promising vision.

---

We hope that we managed to express our objections clearly and in sufficient detail. Thank you for your consideration.