# **NewsQuiz.js** 

## Spreadsheet to quiz!

**NewsQuiz.js** turns data from a Google Spreadsheet into a nice quiz, with lots of flexible options and a fluid layout. Uses Tabletop, Bootstrap, jQuery, and Google Spreadsheets. It's easy! 

The quiz looks like this:

[Basic Demo](http://motherjones.github.com/newsquiz/index-basic.html)

[Advanced Demo](http://motherjones.github.com/newsquiz/index-advanced.html)

### Like how easy?

    <div id="quiz_container"></div>

	<script>
		jQuery(function($) {
	  		$('#quiz_container').quiz(YOUR_SPREADSHEET_KEY); //The hard part: writing the actual quiz.
		});
	</script>
	
The hard part: writing the actual quiz.

# Getting Started: Make a Really Basic Quiz

### 1) Set up a Google Spreadsheet

Start a new Google Spreadsheet with the following column headers:

    question title	question text	right	right text	wrong	wrong text
    
(Don't sweat if you want to include extra goodies like images, videos, or additional titles—we'll get to that [later](https://github.com/motherjones/newsquiz#advanced-quiz)).

Write in all of your questions and answers. Want to include links? Stick anchor tags right in the cells.
  
In Google Docs, go up to the `File` menu and pick `Publish to the web`. Fiddle with whatever you want, then click `Start publishing`. A URL will appear, something like `https://docs.google.com/spreadsheet/pub?key=0Arenb9rAosmbdG5GWHFXbWJlN1hTR2ZmN3lZMVZkOHc&output=html`

Copy that! In theory you're interested in the part between `key=` and `&` but you can use the whole thing if you want.

[Demo spreadsheet](https://docs.google.com/spreadsheet/ccc?key=0Arenb9rAosmbdG5GWHFXbWJlN1hTR2ZmN3lZMVZkOHc#gid=0)

### 2) Set up your index.html page

Try the following, substituting your URL for `public_spreadsheet_url`

		<html>
		<head>
			<script src="js/jquery.js"></script>
			<script src="js/tabletop.js"></script>
			<script src="js/newsquiz.min.js"></script>      
			<link href="css/bootstrap.min.css" rel="stylesheet" media="screen">
			<link href="css/bootstrap-responsive.css" rel="stylesheet" media="screen">
			<link href="css/style.css" rel="stylesheet" media="screen">
		</head>
		<body>
			<div id="quiz_container"></div>
				<script type="text/javascript">
					var quiz = jQuery('#quiz_container').quiz('public_spreadsheet_url');
				</script>
		</body>
		</html>

Load your index.html page in a browser, and check it out! **Pretty rad!** 

# Advanced Quiz
## Let's get fancy.

Want to mix pictures and video into your questions and answers? Want to add an extra title to some of your answers, but not all? We've included lots of flexible features.

See a demo of an advanced quiz with extra bells and whistles [here](http://motherjones.github.com/newsquiz/index-advanced.html). The spreadsheet driving this advanced demo is [here](https://docs.google.com/spreadsheet/ccc?key=0AuHOPshyxQGGdFM5ZWR6ajdzQ1Y5dFFZand1eS1MYmc#gid=0).

### Reference

Add **question**, **answer**, **right**, or **wrong** before any of these options in your column headers to apply to the right portion of your quiz item. See the [demo spreadsheet](https://docs.google.com/spreadsheet/ccc?key=0AuHOPshyxQGGdFM5ZWR6ajdzQ1Y5dFFZand1eS1MYmc#gid=0) to see these options in action. You don't have to include all of these values for each item; see the section on Defaulting below.

`top image` puts an image above the title.

`top video embed` puts a video embed above the title, but below the top image, if you have one

`title` is the headline of each item.

`middle image` puts an image below the title.

`middle video embed` puts a video embed above the text, but below the middle image, if you have one

`text` is a blurb.

`bottom image` put an image below the text.

`bottom video embed` puts a video embed below the text

`background image` puts an image behind the text.

## Multiple wrong (or right) answers

If you want to have more than two possible answers, you can define multiple wrong or right answers in your spreadsheet.  Fill them out as before, but add a number, 0-9 after **right** or **wrong**. So for instance you'd have **wrong 7** or **right 1 top video embed**

## On Defaulting

Since it is a huge hassle to have to fill in multiple cells with the same information, we fail over to more generic cells if a specific value is not filled in.

**right 0-9** defaults to **right**, and **wrong 0-9** defaults to **wrong** value. Both **right** and **wrong** will default to **answer**, and **answer** will default to **question**. 

While this makes writing the quiz significantly less tedious, this does mean that you should bear the following in mind: 

**Do Not Mix Different Types of Image Values for a Single Question.**

If you do you will find yourself in the ugly position of having multiple images all over your answer. Yuck.

**How to Turn Off Defaulting**

There are two ways to do it.

1) To turn off defaulting for the entire quiz: In your project, add an options object as the second argument in your call to create the quiz. In the options argument, have the key `defaulting_behavior_on` set to `false`.

```
var quiz = jQuery('#quiz_container').quiz('public_spreadsheet_url', {defaulting_behavior_on : false});

```

2) To turn off defaulting for a single cell in your spreadsheet (or JSON), or turn on defaulting for a single cell if you've turned off defaulting for the whole quiz, simply enter the value `!default`. In other words, `!default` operates like a switch that enables or disables defaulting for a single cell depending on the defaulting status of your entire quiz.

If you don't care for the term `!default`, you can change the flag like so:

```
var quiz = jQuery('#quiz_container').quiz('public_spreadsheet_url', {defaulting_flag : 'REPLACE !DEFAULT HERE'});

```

## Writing your quiz in JSON

Writing your quiz in JSON is supported, though discouraged if you don't know JSON. The quiz object is formed like this:
```
[
    {
        possible_answers: [
            {
                answer: 'Newt Gingrich',
                backgroundimage: '',
                bottomimage: '',
                bottomvideoembed: '',
                correct: true,
                middleimage: '',
                middlevideoembed: '',
                subhed: 'Correct!',
                text : 'This is from a <a href="http://books.google.com/books?id=K19JlQ3ZsSkC&pg=PA257&lpg=PA257&dq=If+combat+means+living+in+a+ditch,+females+have+biological+problems+staying+in+a+ditch+for+thirty+days+because+they+get+infections+and+they+don%27t+have+upper+body+strength.+I+mean,+some+do,+but+they%27re+relatively+rare.+On+the+other+hand,+men+are+basically+little+piglets,+you+drop+them+in+the+ditch,+they+roll+around+in+it,+doesn%27t+matter,+you+know.+These+things+are+very+real.+On+the+other+hand,+if+combat+means+being+on+an+Aegis-class+cruiser+managing+the+computer+controls+for+twelve+ships+and+their+rockets,+a+female+may+be+again+dramatically+better+than+a+male+who+gets+very,+very+frustrated+sitting+in+a+chair+all+the+time+because+males+are+biologically+driven+to+go+out+and+hunt+giraffes.&source=bl&ots=50_wPjH9uW&sig=zBLha-mcVau4vaimBVsL6Ve93TQ&hl=en&sa=X&ei=ZiwwT7C9KcOWiQL_3I3hCg&ved=0CDsQ6AEwBA#v=onepage&q=If%20combat%20means%20living%20in%20a%20ditch%2C%20females%20have%20biological%20problems%20staying%20in%20a%20ditch%20for%20thirty%20days%20because%20they%20get%20infections%20and%20they%20don\'t%20have%20upper%20body%20strength.%20I%20mean%2C%20some%20do%2C%20but%20they\'re%20relatively%20rare.%20On%20the%20other%20hand%2C%20men%20are%20basically%20little%20piglets%2C%20you%20drop%20them%20in%20the%20ditch%2C%20they%20roll%20around%20in%20it%2C%20doesn\'t%20matter%2C%20you%20know.%20These%20things%20are%20very%20real.%20On%20the%20other%20hand%2C%20if%20combat%20means%20being%20on%20an%20Aegis-class%20cruiser%20managing%20the%20computer%20controls%20for%20twelve%20ships%20and%20their%20rockets%2C%20a%20female%20may%20be%20again%20dramatically%20better%20than%20a%20male%20who%20gets%20very%2C%20very%20frustrated%20sitting%20in%20a%20chair%20all%20the%20time%20because%20males%20are%20biologically%20driven%20to%20go%20out%20and%20hunt%20giraffes.&f=false">controversial lecture</a> on the military that Gingrich delivered while teaching at Reinhardt College. He also said that "females have biological problems staying in a ditch for thirty days because they get infections and they don\'t have upper body strength," when referring to women participating in combat missions.',
                title: "1. Who said it?",
                topimage: '',
                topvideoembed: '<iframe width="420" height="315" src="http://www.youtube.com/embed/8txk6EhYZKA" frameborder="0" allowfullscreen></iframe>'
            }
        ],
        question: {
            backgroundimage: '',
            bottomimage: '',
            bottomvideoembed: '',
            middleimage: '',
            middlevideoembed: '',
            subhed: '',
            text: '"Men are basically little piglets...Males are biologically driven to go out and hunt giraffes."',
            title: '1. Who said it?',
            topimage: '',
            topvideoembed: '<iframe width="420" height="315" src="http://www.youtube.com/embed/8txk6EhYZKA" frameborder="0" allowfullscreen></iframe>'
        }
    }
]
```
You can pass that in as an argument instead of a Google Spreadsheet key, if you prefer.

## Customizing the end-of-quiz message

If you don't like the default result messages, you can change them. Create a second worksheet with the special name, `Results`. The first column should be `number of right answers` and the second should be `html`. Then add one row per potential number of correct answers: `0`, `1`, ... up to the total number of questions.

If you're using JSON to set your quiz data, and you want to use custom results, then pass them as the second argument when you create your quiz. For instance:

```javascript
$("#my-element').quiz(quiz_data, [ 'all wrong', 'one right', 'two right', ... ], options);
```

## End-of-quiz message before the quiz is finished

You may want to hide the end-of-quiz message until the user has completed it. Alternatively, you may want to show a prompt, such as "keep answering questions!".

Use the option `not_finished_html`. That is, pass an options hash like: `{ not_finished_html: "" }`, or `{ not_finished_html: "keep answering questions!" }`.

The default is `undefined`, which means the result messages will always be displayed.

## Accommodating cheaters

Some people like to cheat: they'll answer incorrectly and then change their minds.

Befriend them with the option `cheating` (default `false`). When it's `true`, the end-of-quiz message will pretend their final answers were the ones they entered all along.

## Strange behavior

**Empty tables are trouble.** We can't get column names from them (c'mon, Google!), so don't be too confused when a table with 0 rows is coming back with an empty `.column_names` or your code starts throwing weird errors when processing the results.

## NewsQuiz.js in the wild

Coming soon.

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [grunt](https://github.com/cowboy/grunt).

### Important notes
Please don't edit files in the `dist` subdirectory as they are generated via grunt. You'll find source code in the `src` subdirectory!

While grunt can run the included unit tests via PhantomJS, this shouldn't be considered a substitute for the real thing. Please be sure to test the `test/*.html` unit test file(s) in _actual_ browsers.

### Installing grunt
_This assumes you have [node.js](http://nodejs.org/) and [npm](http://npmjs.org/) installed already._

1. Test that grunt is installed globally by running `grunt --version` at the command-line.
1. If grunt isn't installed globally, run `npm install -g grunt-cli` to install the latest version. _You may need to run `sudo npm install -g grunt`._
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

## Credits

[Ben Breedlove](http://twitter.com/bdbreedlove) built it.

[Jaeah Lee](http://twitter.com/jaeahjlee) designed it and implemented the fluid layout.

[Tasneem Raja](http://twitter.com/tasneemraja), who headbangs to Fleetwood Mac _Rhiannon_ while writing documentation, edited it.
