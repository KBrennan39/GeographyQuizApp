This project was definitely a bit of a challenge for me, as I was not familiar with RESTful APIs and Node.js before this project so understanding the backend/frontend interaction took significant effort. An additional difficulty was using the right API, as trivia db has a call limit that I wasn’t aware of so it stopped making calls at a certain point. I ultimately used The Trivia API instead, which worked similarly except it does not have a query function for geography related questions, requiring me to make more api calls and filter the questions by category. 

One of the unique features of my game is the option to play against a computer opponent that simulates answers that are less accurate for questions with higher difficulty. There is also a fifteen second timer for each question, and a hint functionality that eliminates one of the incorrect answer options.

Overall I enjoyed this project, because I learned a lot through the process. Specifically, when the initial API stopped working, debugging my code forced me to deeply understand the inner workings of the React framework and how use effects and use states can control the flow of a web application. If I had more time I would definitely incorporate component libraries to style my website, and include a database in the backend to permanently store user scores.

How do robots eat pizza? One byte at a time.

