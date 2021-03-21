var base = [
    {
        id: 1,
        title: "Cracking the Coding Interview",
        author: "Gayle Laakmann McDowell",
        cover: "https://images-na.ssl-images-amazon.com/images/I/410hiaPGyCL._SX348_BO1,204,203,200_.jpg",
        since: 2011
    },
    {
        id: 2,
        title: "Compilers: Principles, Techniques, and Tools (Second Edition)",
        author: "Alfred Aho",
        cover: "https://images-na.ssl-images-amazon.com/images/I/41yj7k3l45L._SX328_BO1,204,203,200_.jpg",
        since: 2003
    },
    {
        id: 3,
        title: "Be Obsessed or Be Average",
        author: "Grant Cardone",
        cover: "https://images-na.ssl-images-amazon.com/images/I/515BVQBNQVL._SX329_BO1,204,203,200_.jpg",
        since: 2016
    },
    {
        id: 4,
        title: "The 10x Rule: The Only Difference Between Success and Failure",
        author: "Grant Cardone",
        cover: "https://images-na.ssl-images-amazon.com/images/I/41wkGWTxo7L._SX329_BO1,204,203,200_.jpg",
        since: 2011
    },
    {
        id: 5,
        title: "Extreme Ownership",
        author: "Jocko Willink",
        cover: "https://images-na.ssl-images-amazon.com/images/I/41wsgvkoW2L._SX331_BO1,204,203,200_.jpg",
        since: 2015
    },
    {
        id: 6,
        title: "Good Days Start With Gratitude: A 52 Week Guide To Cultivate An Attitude Of Gratitude: Gratitude Journal",
        author: "Pretty Simple Press",
        cover: "https://images-na.ssl-images-amazon.com/images/I/51VkB7O0v4L._SX331_BO1,204,203,200_.jpg",
        since: 2017
    },
    {
        id: 7,
        title: "How to Fail at Almost Everything and Still Win Big: Kind of the Story of My Life",
        author: "Scott Adams",
        cover: "https://m.media-amazon.com/images/I/51sqVXNWHhL.jpg",
        since: 2013
    },
    {
        id: 8,
        title: "The Pragmatic Programmer: From Journeyman to Master",
        author: "Andrew Hunt",
        cover: "https://images-na.ssl-images-amazon.com/images/I/41as+WafrFL._SX396_BO1,204,203,200_.jpg",
        since: 1999
    },
    {
        id: 9,
        title: "Working Effectively With Legacy Code",
        author: "Michael C. Feathers",
        cover: "https://images-na.ssl-images-amazon.com/images/I/41Fh9iUog4L._SX376_BO1,204,203,200_.jpg",
        since: 2004
    },
    {
        id: 10,
        title: "The Clean Coder: A Code of Conduct for Professional Programmers",
        author: "Robert Martin",
        cover: "https://images-na.ssl-images-amazon.com/images/I/51g4CmfldDL._SX383_BO1,204,203,200_.jpg",
        since: 2011
    },
    {
        id: 11,
        title: "Extreme Programming Explained: Embrace Change, Second Edition",
        author: "Kent Beck",
        cover: "https://images-na.ssl-images-amazon.com/images/I/41b11Tipy0L._SX396_BO1,204,203,200_.jpg",
        since: 2004
    },
    {
        id: 12,
        title: "Fuck This Shit Show: A Gratitude Journal for Tired-Ass Women (Cuss Words Make Me Happy)",
        author: "Crazy Tired Beetches",
        cover: "https://images-na.ssl-images-amazon.com/images/I/51pyEPBoU9L._SX331_BO1,204,203,200_.jpg",
        since: 2018
    },
    {
        id: 13,
        title: "Code Complete: A Practical Handbook of Software Construction, Second Edition",
        author: "Steve McConnell",
        cover: "https://images-na.ssl-images-amazon.com/images/I/41JOmGowq-L._SX408_BO1,204,203,200_.jpg",
        since: 2004
    },
    {
        id: 14,
        title: "The Obstacle Is the Way: The Timeless Art of Turning Trials into Triumph",
        author: "Ryan Holiday",
        cover: "https://images-na.ssl-images-amazon.com/images/I/41d+aa6UYCL._SX352_BO1,204,203,200_.jpg",
        since: 2014
    },
    {
        id: 15,
        title: "The War of Art",
        author: "Steven Pressfield",
        cover: "https://m.media-amazon.com/images/I/41ET8OFVFCL.jpg",
        since: 2011
    },
    {
        id: 16,
        title: "Head First Design Patterns",
        author: "Eric Freeman",
        cover: "https://images-na.ssl-images-amazon.com/images/I/61APhXCksuL._SX258_BO1,204,203,200_.jpg",
        since: 2004
    },
    {
        id: 17,
        title: "The Complete Software Developer’s Career Guide",
        author: "John Sonmez",
        cover: "https://m.media-amazon.com/images/I/51yr12gkjRL.jpg",
        since: 2017
    },
    {
        id: 18,
        title: "Soft Skills: The Software Developer’s Life Manual",
        author: "John Sonmez",
        cover: "https://images-na.ssl-images-amazon.com/images/I/51WiLueukSL._SX396_BO1,204,203,200_.jpg",
        since: 2015
    },
    {
        id: 19,
        title: "What the F*@# Should I Make for Dinner?: The Answers to Life’s Everyday Question (in 50 F*@#ing Recipes)",
        author: "Zach Golden",
        cover: "https://images-na.ssl-images-amazon.com/images/I/51r2t-dlYgL._SX378_BO1,204,203,200_.jpg",
        since: 2011
    },
    {
        id: 20,
        title: "How to Win Friends and Influence People",
        author: "Dale Carnegie",
        cover: "https://images-na.ssl-images-amazon.com/images/I/51X7dEUFgoL._SX320_BO1,204,203,200_.jpg",
        since: 1998
    },
    {
        id: 21,
        title: "As a Man Thinketh",
        author: "James Allen",
        cover: "https://images-na.ssl-images-amazon.com/images/I/51pfiCxOPgL._SX331_BO1,204,203,200_.jpg",
        since: 2006
    },
    {
        id: 22,
        title: "Calm the F*ck Down: An Irreverent Adult Coloring Book (Irreverent Book Series)",
        author: "Sasha O'Hara",
        cover: "https://images-na.ssl-images-amazon.com/images/I/61v1R2x49YL._SX384_BO1,204,203,200_.jpg",
        since: 2016
    },
    {
        id: 23,
        title: "Dad Jokes: Terribly Good Dad Jokes",
        author: "Share The Love Gifts",
        cover: "https://images-na.ssl-images-amazon.com/images/I/41A8tcQS7tL._SX331_BO1,204,203,200_.jpg",
        since: 2017
    },
    {
        id: 24,
        title: "Rework",
        author: "Jason Fried",
        cover: "https://images-na.ssl-images-amazon.com/images/I/41woojfwaaL._SX329_BO1,204,203,200_.jpg",
        since: 2010
    },
    {
        id: 25,
        title: "Structure and Interpretation of Computer Programs, Second Edition",
        author: "Harold Abelson",
        cover: "https://images-na.ssl-images-amazon.com/images/I/41RJ4IO1HRL._SX343_BO1,204,203,200_.jpg",
        since: 1996
    },
    {
        id: 26,
        title: "What If?: Serious Scientific Answers to Absurd Hypothetical Question",
        author: "Randall Munroe",
        cover: "https://images-na.ssl-images-amazon.com/images/I/41KMpZ11ssL._SX373_BO1,204,203,200_.jpg",
        since: 2014
    },
    {
        id: 27,
        title: "Strange Planet",
        author: "Nathan W. Pyle",
        cover: "https://images-na.ssl-images-amazon.com/images/I/41s6P2iCzVL._SX258_BO1,204,203,200_.jpg",
        since: 2019
    },
    {
        id: 28,
        title: "The Giver of Stars",
        author: "Jojo Moyes",
        cover: "https://images-na.ssl-images-amazon.com/images/I/51aQGTp2VfL._SX338_BO1,204,203,200_.jpg",
        since: 2019
    },
    {
        id: 29,
        title: "Zen as F*ck: A Journal for Practicing the Mindful Art of Not Giving a Sh*t (Zen as F*ck Journals)",
        author: "Monica Sweeney",
        cover: "https://images-na.ssl-images-amazon.com/images/I/514B7Y42PML._SX365_BO1,204,203,200_.jpg",
        since: 2018
    },
    {
        id: 30,
        title: "Agile Estimating and Planning",
        author: "Mike Cohn",
        cover: "https://images-na.ssl-images-amazon.com/images/I/413u4bsN1GL._SX361_BO1,204,203,200_.jpg",
        since: 2005
    },
    {
        id: 31,
        title: "Clean Code: A Handbook of Agile Software Craftsmanship",
        author: "Robert C. Martin",
        cover: "https://images-na.ssl-images-amazon.com/images/I/41-+g1a2Y1L._SX375_BO1,204,203,200_.jpg",
        since: 2008
    },
    {
        id: 32,
        title: "Guts",
        author: "Raina Telgemeier",
        cover: "https://images-na.ssl-images-amazon.com/images/I/41xRHCt6eTL._SX342_BO1,204,203,200_.jpg",
        since: 2019
    },
    {
        id: 33,
        title: "Agile Software Development, Principles, Patterns, and Practices",
        author: "Robert Martin",
        cover: "https://images-na.ssl-images-amazon.com/images/I/51yHf-4GaSL._SX393_BO1,204,203,200_.jpg",
        since: 2002
    },
    {
        id: 34,
        title: "Seven Languages in Seven Weeks: A Pragmatic Guide to Learning Programming Languages (Pragmatic Programmers)",
        author: "Bruce Tate",
        cover: "https://images-na.ssl-images-amazon.com/images/I/51LZT+tSrTL._SX415_BO1,204,203,200_.jpg",
        since: 2010
    },
    {
        id: 35,
        title: "Patterns of Enterprise Application Architecture",
        author: "Martin Fowler",
        cover: "https://images-na.ssl-images-amazon.com/images/I/51IuDvAU1CL._SX387_BO1,204,203,200_.jpg",
        since: 2002
    },
    {
        id: 36,
        title: "Talking to Strangers: What We Should Know about the People We Don't Know",
        author: "Malcolm Gladwell",
        cover: "https://images-na.ssl-images-amazon.com/images/I/4186LIB65oL._SX334_BO1,204,203,200_.jpg",
        since: 2019
    },
    {
        id: 37,
        title: "Refactoring: Improving the Design of Existing Code",
        author: "Martin Fowler",
        cover: "https://images-na.ssl-images-amazon.com/images/I/51k+BvsOl2L._SX392_BO1,204,203,200_.jpg",
        since: 1999
    },
    {
        id: 38,
        title: "Programming Pearls, Second Edition",
        author: "Jon Bentley",
        cover: "https://images-na.ssl-images-amazon.com/images/I/31lzzhRbNJL._SX338_BO1,204,203,200_.jpg",
        since: 1999
    },
    {
        id: 39,
        title: "The Passionate Programmer: Creating a Remarkable Career in Software Development",
        author: "Chad Fowler",
        cover: "https://images-na.ssl-images-amazon.com/images/I/51m3yzmDFCL._SX331_BO1,204,203,200_.jpg",
        since: 2009
    },
    {
        id: 40,
        title: "Enterprise Integration Patterns: Designing, Building, and Deploying Messaging Solutions",
        author: "Gregor Hohpe",
        cover: "https://images-na.ssl-images-amazon.com/images/I/51SO8Sn59NL._SX376_BO1,204,203,200_.jpg",
        since: 2003
    },
    {
        id: 41,
        title: "Domain-Driven Design: Tackling Complexity in the Heart of Software",
        author: "Eric Evans",
        cover: "https://images-na.ssl-images-amazon.com/images/I/51sZW87slRL._SX375_BO1,204,203,200_.jpg",
        since: 2003
    },
    {
        id: 42,
        title: "User Stories Applied: For Agile Software Development",
        author: "Mike Cohn",
        cover: "https://images-na.ssl-images-amazon.com/images/I/51lh9U+MtOL._SX376_BO1,204,203,200_.jpg",
        since: 2004
    },
    {
        id: 43,
        title: "How to Draw Cool Stuff: A Drawing Guide for Teachers and Students",
        author: "Catherine V Holmes",
        cover: "https://images-na.ssl-images-amazon.com/images/I/518psLZ8SuL._SX398_BO1,204,203,200_.jpg",
        since: 2014
    },
    {
        id: 44,
        title: "Design Patterns: Elements of Reusable Object-Oriented Software",
        author: "Erich Gamma",
        cover: "https://images-na.ssl-images-amazon.com/images/I/51szD9HC9pL._SX395_BO1,204,203,200_.jpg",
        since: 1994
    },
    {
        id: 45,
        title: "The Guardians",
        author: "John Grisham",
        cover: "https://images-na.ssl-images-amazon.com/images/I/518n8X9DFcL._SX341_BO1,204,203,200_.jpg",
        since: 2019
    },
    {
        id: 46,
        title: "Refactoring to Patterns",
        author: "Joshua Kerievsky",
        cover: "https://images-na.ssl-images-amazon.com/images/I/515omKbeNTL._SX352_BO1,204,203,200_.jpg",
        since: 2004
    },
    {
        id: 47,
        title: "The Mythical Man Month",
        author: "Frederick Brooks Jr.",
        cover: "https://images-na.ssl-images-amazon.com/images/I/51U7pYWTaML._SX334_BO1,204,203,200_.jpg",
        since: 1995
    }
];

