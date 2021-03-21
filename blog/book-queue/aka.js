var books = [
    {
        title: "Rework"
    },
    {
        title: "Head First Design Patterns"
    },
    {
        title: "Extreme Ownership"
    },
    {
        title: "Cracking the Coding Interview"
    },
    {
        title: "Strange Planet"
    },
    {
        title: "The Guardians"
    },
    {
        title: "What If?: Serious Scientific Answers to Absurd Hypothetical Question"
    },
    {
        title: "Talking to Strangers: What We Should Know about the People We Don't Know"
    },
    {
        title: "The Giver of Stars"
    },
    {
        title: "Dad Jokes: Terribly Good Dad Jokes"
    },
    {
        title: "Good Days Start With Gratitude: A 52 Week Guide To Cultivate An Attitude Of Gratitude: Gratitude Journal"
    },
    {
        title: "Guts"
    },
    {
        title: "Zen as F*ck: A Journal for Practicing the Mindful Art of Not Giving a Sh*t (Zen as F*ck Journals)"
    },
    {
        title: "Calm the F*ck Down: An Irreverent Adult Coloring Book (Irreverent Book Series)"
    },
    {
        title: "How to Draw Cool Stuff: A Drawing Guide for Teachers and Students"
    },
    {
        title: "Be Obsessed or Be Average"
    },
    {
        title: "The 10x Rule: The Only Difference Between Success and Failure"
    },
    {
        title: "The Obstacle Is the Way: The Timeless Art of Turning Trials into Triumph"
    },
    {
        title: "How to Fail at Almost Everything and Still Win Big: Kind of the Story of My Life"
    },
    {
        title: "As a Man Thinketh"
    },
    {
        title: "The War of Art"
    },
    {
        title: "How to Win Friends and Influence People"
    },
    {
        title: "Soft Skills: The Software Developer’s Life Manual"
    },
    {
        title: "Seven Languages in Seven Weeks: A Pragmatic Guide to Learning Programming Languages (Pragmatic Programmers)"
    },
    {
        title: "Programming Pearls, Second Edition"
    },
    {
        title: "Extreme Programming Explained: Embrace Change, Second Edition"
    },
    {
        title: "User Stories Applied: For Agile Software Development"
    },
    {
        title: "Agile Estimating and Planning"
    },
    {
        title: "Agile Software Development, Principles, Patterns, and Practices"
    },
    {
        title: "Refactoring to Patterns"
    },
    {
        title: "Enterprise Integration Patterns: Designing, Building, and Deploying Messaging Solutions"
    },
    {
        title: "Patterns of Enterprise Application Architecture"
    },
    {
        title: "Domain-Driven Design: Tackling Complexity in the Heart of Software"
    },
    {
        title: "The Mythical Man Month"
    },
    {
        title: "The Passionate Programmer: Creating a Remarkable Career in Software Development"
    },
    {
        title: "The Clean Coder: A Code of Conduct for Professional Programmers"
    },
    {
        title: "The Pragmatic Programmer: From Journeyman to Master"
    },
    {
        title: "The Complete Software Developer’s Career Guide"
    },
    {
        title: "Compilers: Principles, Techniques, and Tools (Second Edition)"
    },
    {
        title: "Working Effectively With Legacy Code"
    },
    {
        title: "Refactoring: Improving the Design of Existing Code"
    },
    {
        title: "Design Patterns: Elements of Reusable Object-Oriented Software"
    },
    {
        title: "Structure and Interpretation of Computer Programs, Second Edition"
    },
    {
        title: "Clean Code: A Handbook of Agile Software Craftsmanship"
    },
    {
        title: "Code Complete: A Practical Handbook of Software Construction, Second Edition"
    },
    {
        title: "What the F*@# Should I Make for Dinner?: The Answers to Life’s Everyday Question (in 50 F*@#ing Recipes)"
    },
    {
        title: "Fuck This Shit Show: A Gratitude Journal for Tired-Ass Women (Cuss Words Make Me Happy)"
    }
];
var len = books.length;

(function(){
    for (var i = len - 1; i > 0; --i) {
        var r = Math.floor(Math.random()*i);
        var t = books[i];
        books[i] = books[r];
        books[r] = t;
    }
})();

var kickin = function() {
    var box = document.getElementById("box");
    box.innerHTML = "";
    for (var i = 0; i < len; ++i) {
        box.innerHTML += '<li>'+books[i].title+'</li>'
    }
};

window.onload = kickin;

