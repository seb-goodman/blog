---
title: "Cargo, and My Rust Security Misconceptions"
description: ""
date: ""
draft: true
---

I realise I'm late to the party, but I've been learning Rust recently. As many seem to recommend, I've started with The Book. It's an approachable and straightforward read.

While I've enjoyed learning, I have to admit that in hindsight that my motivations were naive. I started to learn Rust because I had a massive misconception about the language, perhaps one that others share (or used to share): that it would help me to write more secure software. I am coming to realise that this may not be the case.

Much has already been written about about the security that Rust provides in the language itself. The ownership and lifetime models which guarantee memory-safety and thread-safety are just amazing. I can see how you can effectively eliminate many classes of bugs and vulnerabilities at compile-time. While there are still ways to write unsafe Rust (and these are also [well-documented](https://doc.rust-lang.org/nomicon/references.html)), Rust goes further than any other low-level language I've come across to keep these options as far out of developers' reach as possible.

What does concern me - and what I had barely grasped before embarking on my Rust journey - is the huge ecosystem which underpins the majority of production Rust code: Crates. Writing just about anything of any significance in Rust requires a Crate. Writing something insignificant also requires a Crate. As I've subsequently discovered, this is a fairly common complaint.

I've seen a trio of recurring rebuttals to this: the first is that, as a Rust programmer, your reliance on external dependencies is [basically the same as if you were to code in another popular languages](https://users.rust-lang.org/t/cargo-dependency-hell/13124/2) as if you were to code in other popular languages. This is somewhat true, although it's fair to say Rust is especially reliant on external libraries. Even JavaScript, which is renowned for its dependency hell, comes with a [regex library](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions) as part of its standard library.

The second is that Rust's reputation for dependency-heavy code stems partly from how the language makes dependencies so glaringly obvious to those writing it. In C++, for example, dependencies are [often transitive](<(https://wiki.alopex.li/LetsBeRealAboutDependencies)>), and perusing a CMakeLists find_package doesn't reveal how much foreign code is actually sitting in your codebase.

The third is that Rusts' good package management makes it [so easy to add dependencies](https://news.ycombinator.com/item?id=41053987), and that this reduced friction naturally leads Rust software to consume more dependencies.

These last two arguments are accurate, but they also do nothing to ease my frustration with the crates ecosystem. It's not that I think Rust has too many dependencies. It's that if I want to produce useful software, I have to rely on _untrusted_ dependencies when coding in Rust.

A large OSS ecosystem is fine _if_ it's responsibly managed to reduce the security risks when that system is scaled. Dockerhub _also_ boasts a large ecosystem of potentially malicious things that I can unleash on my machine. The difference is that it runs a [trusted content](https://docs.docker.com/docker-hub/image-library/trusted-content/) scheme, which provides a curated selection of images designed to give developers a basic level of confidence in the images they are pulling.

The issue is that the Rust ecosystem puts the burden of auditing firmly on its users. The overwhelming majority of companies will not be doing their due diligence on this. And I imagine it will put off more security-minded companies entirely. After all, why would they develop new software in a language for memory and thread safety if a bad actor can simply waltz in via a dependency's backdoor? Attacks like these have happened [before](https://snyk.io/blog/malicious-code-found-in-npm-package-event-stream/), and given the opportunity, they're bound to happen again.

I assume the reason behind this lack of auditing is related to limited resources and funding, which is understandable, but sad. It creates a crack in Rust's otherwise solid value proposition. While the language succeeds brilliantly at making your own code safer, but it hasn't started to protect you from the code you didn't write.
