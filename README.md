# Assignment 5 --> Github Issue Tracker

## 1. What is the difference between var, let, and const?

- **var:** This is the old way to declare variables. It is function-scoped (not block-scoped) and can be re-declared, which can cause bugs.
- **let:** We use this for variables that might change later. It is block-scoped, meaning it only lives inside the curly braces { } where it was defined.
- **const:** We use this for values that should not change. It is also block-scoped, but once assigned, you cannot reassign it.

## 2. What is the spread operator (...)?

The spread operator is written as three dots (...). It allows us to spread or unpack elements from an array or object into individual pieces.

It is commonly used to:
- Copy an array easily without changing the original one.
- Merge two arrays together.
- Pass elements of an array as arguments to a function.

## 3. What is the difference between map(), filter(), and forEach()?

- **map():** It loops through an array, does something to every item, and returns a **new array** with the updated values.
- **filter():** It checks a condition on every item and returns a **new array** containing only the items that passed the test (true).
- **forEach():** It simply loops through the array to run a piece of code (like logging to the console), but it **does not** return a new array.

## 4. What is an arrow function?

An arrow function is a shorter, cleaner way to write functions introduced in ES6.

Instead of typing function, we use the "fat arrow" symbol (=>).
Example: const myFunc = () => { ... }.
It saves time and makes the code look much simpler.

## 5. What are template literals?

Template literals are a way to create strings using backticks ( `` ` `` ) instead of quotes.

- We can put variables directly inside the string using ${variableName}.
- We don't have to use the + sign to join strings together anymore.
- They allow us to write multi-line strings easily.