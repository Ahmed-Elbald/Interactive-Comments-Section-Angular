![Design preview for the Multi-step form coding challenge](./design/desktop-preview.jpg)

<h1 align="center">Frontend Mentor - Interactive Comments Section</h1>

<h3 align="center">
   <a href="https://www.frontendmentor.io/challenges/interactive-comments-section-iG1RugEG9/hub">Challenge</a>
   <span>|</span>
   <a href="https://www.frontendmentor.io/solutions/interactive-comments-section-with-angular-2z4ED9cPld">My Solution</a>
</h3>
<br>
<br>

## Built With

- HTML
- SCSS
- Typescript
- Angular v17
- NgRx Component Store
- RxJs

_\*In this project, and since comments and replies are almost the same, I have decided to give both of them the term 'Interaction'. That makes it easier to build shared models and components._

_\*Regarding the structure of each feature's folder, I took that from
[Joshua Morony's video](https://youtu.be/7SDpTOLeqHE?si=wTS9S5t-O4tRaJ_t) about structuring Angular projects._

## App Features

I've implemented all the features required by the original challenge, thus the user can:

- Create, Read, Update, and Delete Interactions
- Upvote and downvote Interactions
- View the optimal layout for the app depending on the device's screen size
- See hover states for all interactive elements on the page

In addition, I've added some other important features like:

- Having nested replies
- Preventing the user from upvoting/downvoting their own interactions
- Preventing the user from upvoting/downvoting an interaction more than once
- See alert messages whenever there's a change or an error
- See animation effects when adding/deleting interactions

## Intro

Interactive Comments Section: One of my preferred challenges in Frontend Mentor. I really enjoyed doing that challenge despite the difficulties I encountered. This challenge was done as part of practicing my skills in Angular.

## Hard Decisions I Had To Make

I've added some features to the original challenge. As a result, there was a few decisions I had to make on my own concerning those new features besides the ones related to the original challenge:

1. **What should be the shared name for a comment and a reply**

   Figuring out that comments and replies are almost the same, which directed me into creating shared models and components for them, was easy. However, Giving a name for those shared _models and components_ was not easy at all. A couple of words were suggested: thread, thread response, response, interaction. In the end, I opted for 'Interaction'. IDK why, but I just did not feel the other words.

2. **How to deal with the provided (fetched) data**

   The fetched data is not normalized (replies are nested into comments in the same object). This form of data structure is not preferable when it comes to managing the state as it makes it hard to do any changes. Therefore, I decided to normailze the fetched data to store it in the app state. When displaying the data to the user, I just denormalize it.

## What I Learned

In order to complete this challenge, I learned some Angular techniques and programming concepts I didn't know about like:

1. Learning about the concepts of normalizing and denormalizing.
2. Using Injection Tokens to provide the `LocalStorage`

## Contribution

If you want to make any suggestions, feel free to do that in the [discussions section](https://github.com/Ahmed-Elbald/Interactive-Comments-Section-Angular/discussions). Also, feel free to clone the repo and play around with the source could.
