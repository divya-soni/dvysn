---
title: I Attempted to Build the Cursor for Reading
date: 2026-04-05
excerpt: I got the idea watching my sister study. She would read a dense textbook, get stuck, grab her phone, take a photo of the page, upload it to ChatGPT, ask for an explanation, then return to reading.
---

I got the idea watching my sister study. She would read a dense textbook, get stuck, grab her phone, take a photo of the page, upload it to ChatGPT, ask for an explanation, then return to reading. Ten minutes later, she would do it again.

It looked exhausting. Every question meant stopping, switching devices, taking a photo, uploading it, and writing a prompt. Copying text was not much better either. ChatGPT would miss context from diagrams, charts, equations, and layout, which are often the parts that make textbooks understandable.

I wanted something closer to what tools like Cursor do for programmers: an AI that sits beside you, understands the context on screen, and helps instantly. Except instead of code, it would work for reading textbooks. That is how Mira, a sort of “Cursor for reading,” was born.

## The Aha Moment: Let the LLM See the Page

My first instinct was the standard approach: parse the textbook, split it into chunks, then retrieve relevant pieces when a student asks a question. In other words, a typical Retrieval Augmented Generation (RAG) setup.

But textbooks are not just text. They are diagrams, equations, tables, and dense layouts. Extracting all of that reliably is hard, and even strong PDF parsers often fail to reconstruct formulas and visuals accurately.

The breakthrough was simple. For this use case, the AI did not need a perfect parse. It just needed to see what the student was seeing. So instead of extracting text, Mira sends a screenshot of the exact page the student is reading. Modern vision-capable models can interpret diagrams, formulas, and tables directly from the image, and across many textbook pages the explanations were consistently accurate enough for studying.

This also came with an unexpected optimization. Parsing a page and sending both text and images can be token-heavy, but sending a single page image costs roughly ~250 input tokens. The vision-first approach was simpler and significantly cheaper.

## The Interface: A Textbook With a Built-In Tutor

The interface is intentionally simple. Mira looks like a normal PDF reader with a chat window on the side, similar to how AI copilots appear in modern tools.

As a student reads, they can ask questions about the page in front of them. Under the hood, each page maintains its own context. When a question is asked, Mira sends the model a screenshot of the current page and the previous messages in that page’s chat. In effect, each page becomes its own conversation thread, which keeps the AI grounded in the exact material being read.

## Making the AI Feel More Human

One small detail changed the feel of the product. When an LLM answers, it often returns a single large block of text. Even when the answer is good, reading a long paragraph for a simple question adds friction.

So after the LLM generates a response, Mira runs it through a transformation step that splits the answer into smaller messages. One explanation might become four or five short chat bubbles delivered sequentially. The content is the same, but it feels more natural, like texting someone for help rather than reading an AI essay.

## Letting Students Listen Instead of Read

I also experimented with letting students listen to explanations. After the LLM generates text, Mira can send it to a text-to-speech model and return both the written explanation and a playable voice response.

I tested several APIs before settling on Kokoro, an open-source model that produced natural voices at a much lower cost than most commercial options. The flow was straightforward: the LLM generates the explanation, the text is sent to Kokoro (hosted on Replicate), Kokoro generates audio, and the app returns both text and audio.

The tradeoff was latency. Students had to wait for both text generation and audio synthesis, so I eventually made audio optional and only enabled when a student wanted it.

## Answering Questions About the Whole Document

Most questions are page-specific. But sometimes students ask broader prompts like “Summarize this chapter” or “What are the main ideas in this document?” For those, Mira switches modes and sends the entire PDF to the model so it can reason across the full document.

## What I Learned

Building Mira taught me that building an AI app is not really about calling a model. That part is easy. The real engineering work is everything around it: file uploads, fast page screenshotting, per-page conversation state, enforcing structured outputs, and keeping latency low enough for the interface to feel responsive.

Even small product choices ripple into architecture. Mira relied on splitting answers into structured chat messages, storing separate chat histories per page, optionally routing output through text-to-speech, and optimizing token usage by sending page images instead of parsed text.

One lasting takeaway was that vision-capable models can simplify systems dramatically. Letting the model interpret page images avoided a fragile parsing pipeline, and it was both simpler and cheaper. I also had ideas I would have explored with more time, like better caching of page context, faster streaming responses, and stronger document-level understanding across pages.

I polished the interface enough to host Mira online for a while, but eventually other priorities took over and I decided to sunset the project. Still, it was a fun system to build and I learned a lot from the process. The code now lives quietly in my GitHub repository as a small experiment in what a Cursor-like experience for reading might look like.