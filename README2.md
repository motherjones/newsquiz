# **NewsQuiz.js** (spreadsheet to quiz!)

**NewsQuiz.js** turns data from a Google Spreadsheet into a nice quiz, with lots of flexible options and a fluid layout. It's easy!

[Working demo:](https://docs.google.com/spreadsheet/ccc?key=0Arenb9rAosmbdG5GWHFXbWJlN1hTR2ZmN3lZMVZkOHc#gid=0)

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
    
	(Don't sweat if you want to include extra goodies like images, videos, or additional titles—we'll get to that later).

Write in all of your questions and answers. Want to include links? Write them in using anchor tags. 

You can see a demo Google Spreadsheet [here](https://docs.google.com/spreadsheet/ccc?key=0Arenb9rAosmbdG5GWHFXbWJlN1hTR2ZmN3lZMVZkOHc#gid=0).
  
In Google Docs, go up to the `File` menu and pick `Publish to the web`. Fiddle with whatever you want, then click `Start publishing`. A URL will appear, something like `https://docs.google.com/spreadsheet/pub?key=0Arenb9rAosmbdG5GWHFXbWJlN1hTR2ZmN3lZMVZkOHc&output=html`

Copy that! In theory you're interested in the part between `key=` and `&` but you can use the whole thing if you want.

[Demo sheet](https://docs.google.com/spreadsheet/ccc?key=0Arenb9rAosmbdG5GWHFXbWJlN1hTR2ZmN3lZMVZkOHc#gid=0)

### 2) Set up your html page

Try the following, substituting your URL for `public_spreadsheet_url`

		<html>
		<head>
			<script src="../libs/jquery/jquery.js"></script>
			<script src="../libs/tabletop.js"></script>
			<script src="../src/GDoc-Powered-Quiz.js"></script>      
			<link href="css/bootstrap.min.css" rel="stylesheet" media="screen">
			<link href="css/bootstrap-responsive.css" rel="stylesheet" media="screen">
			<link href="css/bootstrap-jaeah.css" rel="stylesheet" media="screen">
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

See a demo of an advanced quiz with extra bells and whistles [here](https://docs.google.com/spreadsheet/ccc?key=0Arenb9rAosmbdG5GWHFXbWJlN1hTR2ZmN3lZMVZkOHc#gid=0). The spreadsheet driving this demo is [here](https://docs.google.com/spreadsheet/ccc?key=0Arenb9rAosmbdG5GWHFXbWJlN1hTR2ZmN3lZMVZkOHc#gid=0).

### Reference

`question title` is 

`question text` is

`question middle image` is

`question bottom image` is

`question background image` is

`question youtube` is

## Strange behavior

**Empty tables are trouble.** We can't get column names from them (c'mon, Google!), so don't be too confused when a table with 0 rows is coming back with an empty `.column_names` or your code starts throwing weird errors when processing the results.

## If you are having trouble

Turn on debugging by passing `debug: true` when you initialize Tabletop. Check out the console, I try to keep my error messages chatty and informative.

## NewsQuiz.js in the wild

**The more examples the better, right?** Feel free to fork or contact me if you have a good example of something you've done.


## Credits

[Ben Breedlove](http://twitter.com/bdbreedlove), TK he built it.

[Jaeah Lee](http://twitter.com/jeaahjlee), TK she designed and implemented fluid layout.

[Tasneem Raja](http://twitter.com/tasneemraja), who headbangs to Fleetwood Mac 'Rhiannon' while writing documentation.