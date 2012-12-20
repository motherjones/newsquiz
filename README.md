# GDoc Powered Quiz

Creates a quiz from a google spreadsheet.

## Getting Started
Download the [production version][min] or the [development version][max].

[min]: https://raw.github.com/motherjones/GDoc-Powered-Quiz/master/dist/GDoc-Powered-Quiz.min.js
[max]: https://raw.github.com/motherjones/GDoc-Powered-Quiz/master/dist/GDoc-Powered-Quiz.js

In your web page:

```html
<script src="jquery.js"></script>
<script src="libs/tabletop.js"></script>
<script src="dist/GDoc-Powered-Quiz.min.js"></script>


<div id="quiz_container"></div>

<script>
jQuery(function($) {
  $('#quiz_container').quiz(YOUR_SPREADSHEET_KEY); //Yeah, the hard part is making the quiz.
});
</script>
```

Then all you have to do is actually write your quiz.

## Writing your quiz in a spreadsheet

The spreadsheet powering this should look something like the one here: https://docs.google.com/spreadsheet/pub?key=0Arenb9rAosmbdG5GWHFXbWJlN1hTR2ZmN3lZMVZkOHc&output=html

Each row will become a new question.  Each question requires two parts, the question being asked, and the possible answers. We allow an arbitrary number of answers, but I suggest between 2 and 5.

The columns that control the quesiton are question title, question text, question subhed, question top image, question middle image, question youtube, question bottom image, and question background image. I recommend a title, a text, and only one of top image, middle image, background image, or youtube.

Forming the columns that control the possibl answers are a little trickier. Answers which are correct start with 'right' and answers which are incorrect start with 'wrong'. The columns which control the answers are the same as the columns which control the quesiton (title, text, subhed, top image, middle image, background image, bottom image, youtube), but also MUST include a column which includes the answer as it is displayed as an option, labeled simply right or wrong. So for example if you wanted an correct answer which displays as "Mary Harris Jones", you would add a column titled "right", with the value "Mary Harris Jones".

To add additional correct or incorrect answers, add a number between 0 and 9 after "right" or "wrong". So in order to have a third wrong answer, you would have columns "wrong 2", "wrong 2 title", "wrong 2 text", and so on.

## Writing your quiz in JSON

Writing your quiz in JSON is supported, though discouraged if you don't know JSON. The quiz object is formed like this
```
[
    {
        possible_answers: [
            {
                answer: 'Newt Gingrich',
                backgroundimage: '',
                bottomimage: '',
                correct: true,
                middleimage: '',
                subhed: 'Correct!',
                text : 'This is from a <a href="http://books.google.com/books?id=K19JlQ3ZsSkC&pg=PA257&lpg=PA257&dq=If+combat+means+living+in+a+ditch,+females+have+biological+problems+staying+in+a+ditch+for+thirty+days+because+they+get+infections+and+they+don%27t+have+upper+body+strength.+I+mean,+some+do,+but+they%27re+relatively+rare.+On+the+other+hand,+men+are+basically+little+piglets,+you+drop+them+in+the+ditch,+they+roll+around+in+it,+doesn%27t+matter,+you+know.+These+things+are+very+real.+On+the+other+hand,+if+combat+means+being+on+an+Aegis-class+cruiser+managing+the+computer+controls+for+twelve+ships+and+their+rockets,+a+female+may+be+again+dramatically+better+than+a+male+who+gets+very,+very+frustrated+sitting+in+a+chair+all+the+time+because+males+are+biologically+driven+to+go+out+and+hunt+giraffes.&source=bl&ots=50_wPjH9uW&sig=zBLha-mcVau4vaimBVsL6Ve93TQ&hl=en&sa=X&ei=ZiwwT7C9KcOWiQL_3I3hCg&ved=0CDsQ6AEwBA#v=onepage&q=If%20combat%20means%20living%20in%20a%20ditch%2C%20females%20have%20biological%20problems%20staying%20in%20a%20ditch%20for%20thirty%20days%20because%20they%20get%20infections%20and%20they%20don\'t%20have%20upper%20body%20strength.%20I%20mean%2C%20some%20do%2C%20but%20they\'re%20relatively%20rare.%20On%20the%20other%20hand%2C%20men%20are%20basically%20little%20piglets%2C%20you%20drop%20them%20in%20the%20ditch%2C%20they%20roll%20around%20in%20it%2C%20doesn\'t%20matter%2C%20you%20know.%20These%20things%20are%20very%20real.%20On%20the%20other%20hand%2C%20if%20combat%20means%20being%20on%20an%20Aegis-class%20cruiser%20managing%20the%20computer%20controls%20for%20twelve%20ships%20and%20their%20rockets%2C%20a%20female%20may%20be%20again%20dramatically%20better%20than%20a%20male%20who%20gets%20very%2C%20very%20frustrated%20sitting%20in%20a%20chair%20all%20the%20time%20because%20males%20are%20biologically%20driven%20to%20go%20out%20and%20hunt%20giraffes.&f=false">controversial lecture</a> on the military that Gingrich delivered while teaching at Reinhardt College. He also said that "females have biological problems staying in a ditch for thirty days because they get infections and they don\'t have upper body strength," when referring to women participating in combat missions.',
                title: "1. Who said it?",
                topimage: '',
                youtube: 'DpS9Z3dj2To'
            }
        ],
        question: {
            backgroundimage: '',
            bottomimage: '',
            middleimage: '',
            subhed: '',
            text: '"Men are basically little piglets...Males are biologically driven to go out and hunt giraffes."',
            title: '1. Who said it?',
            topimage: '',
            youtube: 'DpS9Z3dj2To'
        }
    }
]
```
You can pass that in as an argument instead of a google spreadsheet key, if you'd like.


## On Defaulting

Since it is a huge hassle to have to fill in multiple cells with the same information, we fail over to reasonable other cells if a cell is not filled in.

right 0-9 value defaults to right value, and wrong 0-9 value defaults to wrong value. Both right value and wrong value will default to answer value, and answer value will default to question value. 

While this makes writing the quiz significantly less tedious, this does mean that you should bear the following in mind: Do Not Mix Different Types of Image Values for a single question. If you do you will find yourself in the ugly position of having multiple images on your answer display. Yuck.

## Examples
_(Coming soon)_

## License
Copyright (c) 2012 Ben Breedlove  
Licensed under the MIT, GPL licenses.

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [grunt](https://github.com/cowboy/grunt).

### Important notes
Please don't edit files in the `dist` subdirectory as they are generated via grunt. You'll find source code in the `src` subdirectory!

While grunt can run the included unit tests via PhantomJS, this shouldn't be considered a substitute for the real thing. Please be sure to test the `test/*.html` unit test file(s) in _actual_ browsers.

### Installing grunt
_This assumes you have [node.js](http://nodejs.org/) and [npm](http://npmjs.org/) installed already._

1. Test that grunt is installed globally by running `grunt --version` at the command-line.
1. If grunt isn't installed globally, run `npm install -g grunt` to install the latest version. _You may need to run `sudo npm install -g grunt`._
1. From the root directory of this project, run `npm install` to install the project's dependencies.

### Installing PhantomJS

In order for the qunit task to work properly, [PhantomJS](http://www.phantomjs.org/) must be installed and in the system PATH (if you can run "phantomjs" at the command line, this task should work).

Unfortunately, PhantomJS cannot be installed automatically via npm or grunt, so you need to install it yourself. There are a number of ways to install PhantomJS.

* [PhantomJS and Mac OS X](http://ariya.ofilabs.com/2012/02/phantomjs-and-mac-os-x.html)
* [PhantomJS Installation](http://code.google.com/p/phantomjs/wiki/Installation) (PhantomJS wiki)

Note that the `phantomjs` executable needs to be in the system `PATH` for grunt to see it.

* [How to set the path and environment variables in Windows](http://www.computerhope.com/issues/ch000549.htm)
* [Where does $PATH get set in OS X 10.6 Snow Leopard?](http://superuser.com/questions/69130/where-does-path-get-set-in-os-x-10-6-snow-leopard)
* [How do I change the PATH variable in Linux](https://www.google.com/search?q=How+do+I+change+the+PATH+variable+in+Linux)
