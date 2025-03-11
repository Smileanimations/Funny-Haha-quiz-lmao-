# Monster Hunter Guessing Game

## About the Project
This is a small on-going project i am working mostly because i am very bored, but also because I love Monster Hunter!!! Most of the website is inspired by [Monkepo](https://monkepo.online/), and you will notice many similarities. I will most likely work on this project on and off. maybe one day i'll host this website when i know more about web development and hosting. currently this is mostly something to learn Javascript. and if you take a gander, you'll see that its mostly just raw JS (because i am simply quirky like that). 

## Monstie Guesser
When you load/refresh the page a random monster is chosen and you can start guessing! Simply type in your guess and use the information given to guess the chosen monster. You have an unlimited amount of attempts and can give up any time. 

   ### What does the info tell you?
   When you click on a monster it'll show you:
   - Its name
   - Its original generation from when it first appeared.
   - What type of monster it is (Flying Wyvern, Elder Dragon, etc).
   - What type of species it is (Original, Subspecies, Deviant).
   - The element it uses. This was tricky since monsters like Tigrex's rocks can give an element based on their environment, but I mostly assigned elements to monsters with an actual element.
   - Lastly, the ailment it can inflict. This was also tricky, especially with the stun ailment, since every monster can stun you, but some monsters have attacks that will stun you guaranteed (except when nullified with a skill, of course). I left out stun since it felt too broad to give out as a hint.

   ### What does Yellow mean?
   A hint will mostly show up green or red, indicating correct or incorrect, but there are cases where it will appear yellow (mostly in element or ailment cases) this means that your guess is partially correct. So if you pick a monster with multiple elements for example and it turns yellow it means that either one of them can be correct. Or you pick a monster with one element and it turns yellow it means the random monster includes that element. 

   Another rare case is when you have everything correct except it doesn't show you the result. This is indicated with a yellow line under the monster's name and means that you indeed have all the hints correct but not the right monster. For example, Rathian and Rathalos practically have the same hints but are not the same monster.

## Master Hunter
Also ripped off of Monkepo is Master Hunter! In this game there is just one simple task: Name Every Monster. That's it! 
You can change the display so that it shows you every class instead of every generation if you prefer. You can also filter the results with the following options:
1. Sorted Alphabetically
2. Sorted based on Generation
3. Sorted based on Class

This way you'll get an less overwhelming grid and make it a little easier to guess missing monsters.

## How to get started
Since this website isn't hosted you'll have to run it yourself which shouldn't be too hard
1. Clone the repository (https://github.com/Smileanimations/Funny-Haha-quiz-lmao-.git),
2. In VSCode use the Live Server extension (Or any other method you know that'll make it work, i just use this one),
3. And start playing! 