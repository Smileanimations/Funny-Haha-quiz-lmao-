# Monster Hunter Guessing Game

---

### About the Project

Monster Hunter Guessing Game is a passion project I made because I am a big fan of the franchise Monster Hunter and saw other fandoms create "guessing games" along the likes of this one and wanted to try it myself.

It is entirely client side, built with Javascript and Node. It currently has 2 stand-alone games:

**Monstie Guesser** - A Wordle-style guessing game where a random monster is selected on load and you narrow it down using hints like generation, monster type, species, element, and ailment. Colour-coded feedback (green, red, and yellow for partial matches) guides you to the answer, with no guess limit and the option to give up whenever the hunt gets too tough.

**Master Hunter** - A challenge mode where your goal is simple: name every monster. Sort the grid alphabetically, by generation, or by class to make the hunt a little more manageable.

The project isnt hosted yet, you can find how to run it further in the readme.

---

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
In this game there is just one simple task: Name Every Monster. That's it! 
You can change the display so that it shows you every class instead of every generation if you prefer. You can also filter the results with the following options:
1. Sorted Alphabetically
2. Sorted based on Generation
3. Sorted based on Class


## How to get started
Since this website isn't hosted you'll have to run it yourself which shouldn't be too hard
1. Clone the repository (https://github.com/Smileanimations/Funny-Haha-quiz-lmao-.git),
2. Make sure you have [Node.js](https://nodejs.org/en) installed, you can find out by running `node -v` in your terminal
3. Open a terminal in the root of the project and run `npm install` which will install all the dependencies
4. After that you can run `npm start` or `node server.js` to host on `http://localhost:3000`
