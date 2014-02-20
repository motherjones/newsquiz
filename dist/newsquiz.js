/*! GDoc Powered Quiz - v0.1.0 - 2012-12-12
* https://github.com/motherjones/GDoc-Powered-Quiz
* Copyright (c) 2012 Ben Breedlove; Licensed MIT, GPL */

(function($) {

    $.quiz = function(quiz_data, options) {
        var container_elem;
        var that;
        var answer_tracking = [];
        var correct_answers_element;

        var quiz = {
            container : 'quiz_container',
            init : function(quiz_data, options) {

                that = this;
                if (options) {
                    for ( var option in options ) {
                        that[option] = options[option];
                    }
                }

                if (typeof(quiz_data) === 'string') {
                    //is a google spreadsheet
                    that.make_quiz_from_google_spreadsheet(quiz_data);
                    return that;
                }
                that.quiz_data = quiz_data;
                    
                that.create_cover();

                for ( var i = 0; i < that.quiz_data.length; i++ ) {
                    that.append_question(i);
                }

                that.append_how_you_did_section();

                return that;
            },
            append_how_you_did_section: function() {
                correct_answers_element = jQuery('<span class="correct_answers">0</span>');
                var how_you_did_element = jQuery('<p class="how_you_did"></p>');
                how_you_did_element.append(jQuery('<span>You got </span>'));
                how_you_did_element.append(correct_answers_element);
                how_you_did_element.append(jQuery('<span> correct answers out of ' + that.quiz_data.length + ' questions</span>'));
                cover.append(how_you_did_element);
                cover.append(jQuery('<p class="small">on your first attempt. No fair changing your answers after you found out you were wrong</p>'));
            },

            make_quiz_from_google_spreadsheet: function(spreadsheet_id) {
                Tabletop.init({ 
                    key: spreadsheet_id,
                    callback: function(data) {
                        var quiz_data = that.make_quiz_data_from_spreadsheet_data(data);
                        that.init(quiz_data, options);
                    },
                    simpleSheet: true
                });
            },
            _pull_answer_value_from_spreadsheet : function(row, value, wrong_number, correct) {
                var correct = correct ? 'right' : 'wrong';
                return (row[correct + wrong_number + value]
                        ?  row[correct + wrong_number + value]
                        : (row[correct + value]
                               ? row[correct + value]
                               : ( row['answer' + value]
                                    ? row['answer' + value]
                                    : row['question' + value]
                                 )
                           )
                    );
            },
            get_possible_answers : function(row, is_correct) {
                var possible_answers = [];
                var right_or_wrong = (is_correct ? 'right' : 'wrong');
                if (row[right_or_wrong]) {
                    possible_answers.push(that.make_possible_answer(row, '', is_correct));
                }
                for (var i = 0; i < 10; i++ ) {
                    if (row[right_or_wrong + i]) {
                        possible_answers.push(that.make_possible_answer(row, i, is_correct));
                    }
                }
                return possible_answers;
            },
            make_possible_answer: function(row, i, is_correct) {
                var right_or_wrong = (is_correct ? 'right' : 'wrong');
                return {
                    answer: row[right_or_wrong + i],
                    correct: is_correct,
                    title: that._pull_answer_value_from_spreadsheet(row, 'title', i, is_correct),
                    text : that._pull_answer_value_from_spreadsheet(row, 'text', i, is_correct),
                    topimage: that._pull_answer_value_from_spreadsheet(row, 'topimage', i, is_correct),
					middleimage: that._pull_answer_value_from_spreadsheet(row, 'middleimage', i, is_correct),
					youtube: that.pull_youtube_id(that._pull_answer_value_from_spreadsheet(row, 'youtube', i, is_correct)),
                    bottomimage: that._pull_answer_value_from_spreadsheet(row, 'bottomimage', i, is_correct),
                    backgroundimage: that._pull_answer_value_from_spreadsheet(row, 'backgroundimage', i, is_correct)
                };
            },
            make_quiz_data_from_spreadsheet_data: function(data) {
                var quiz = [];
                for (var i = 0; i < data.length; i++) {
                    var row = data[i];
                    var possible_wrong_answers = that.get_possible_answers(row, false);
                    var possible_right_answers = that.get_possible_answers(row, true);

                    var right_answer_placement = [];
                    for (var j = 0; j < possible_right_answers.length; j++) {
                        right_answer_placement.push(
                            Math.floor(Math.random() * possible_wrong_answers.length)
                        );
                    }
                    // IMPORTANT TO SORT THIS. rather than check if a value is in, we only check the first
                    right_answer_placement.sort();

                    var possible_answers= [];
                    var right_answers_placed = 0;
                    for (var j = 0; j < possible_wrong_answers.length; j++) {
                        while (j === right_answer_placement[right_answers_placed]) {
                            //push right answer
                            possible_answers.push(possible_right_answers[right_answers_placed]);
                            right_answers_placed++;
                        }
                        possible_answers.push(possible_wrong_answers[j]);
                    }

                    var question = {
                        question : {
                                       title: row.questiontitle,
                                       text : row.questiontext,
                                       topimage: row.questiontopimage,
									   middleimage: row.questionmiddleimage,
									   youtube: that.pull_youtube_id(row.questionyoutube),
                                       bottomimage: row.questionbottomimage,
                                       backgroundimage: row.questionbackgroundimage
                        },
                        possible_answers : possible_answers,
                        rowNumber : row.rowNumber - 1
                    };
                    //do stuff to turn data into quiz acceptable json
                    quiz.push(question);
                }
                return quiz;
            },
            pull_youtube_id : function(youtube_url) {
                youtube_id = youtube_url.match(/=.*?$/);
                return youtube_id ? youtube_id[0].replace('=', '') : '';
            },
            append_question : function(question_index) {
                var question_data = that.quiz_data[question_index]
                var question_container = jQuery('<li class="question_container row-fluid question_'
                        + question_index
                        + '"></li>'
                );
                question_container.append( that.build_question_element_from_row(question_data) );
                question_container.append( that.build_revealed_answer_element_from_row(question_data) );
                question_container.append( that.build_possible_answer_elements_from_row(question_data, question_index) );
                container_elem.append(question_container);
            },
            build_question_element_from_row: function(row) {
                var question = row.question;
                return jQuery('<div class="question col-12 show" '
                    + ( question.backgroundimage 
                            ? 'style="background-image: url(\'' + question.backgroundimage + '\');">' 
                            : '>' )
                    + ( question.topimage 
                            ? '<img src="' + question.topimage + '" class="topimage"></img>' 
                            : ''  )
                    + ( question.title 
                            ? '<h1>' + question.title + '</h1>' 
                            : ''  )
                   	+ ( question.middleimage 
		                    ? '<img src="' + question.middleimage + '" class="middleimage"></img>' 
                            : ''  )                    
                    + ( question.youtube 
                        ? '<div class="youtube"><iframe width="420" height="315" src="http://www.youtube.com/embed/'
                        + '' + question.youtube + ''
                        + '" frameborder="0" allowfullscreen></iframe></div>' 
                        : ''  )
					+ '<p>' + question.text + '</p>'
                    + ( question.bottomimage 
                            ? '<img src="' + question.bottomimage + '" class="topimage"></img>' 
                            : ''  )
                    + '</div>');
            },
            build_revealed_answer_element_from_row: function(row) {
              var revealed_answers_container = jQuery('<div class="revealed_answers_container_' + row.rowNumber + '"></div>');
              for ( var i = 0; i < row.possible_answers.length; i++) {
                  answer = row.possible_answers[i];
                  revealed_answers_container.append(
                          jQuery('<div class="revealed_answer_' + i
                              + ' revealed_answer col-12 hide" '
                              + ( answer.backgroundimage 
                                  ? 'style="background-image: url(\'' + answer.backgroundimage + '\');">' 
                                  : '>' )
                              + ( answer.topimage 
                                  ? '<img src="' + answer.topimage + '" class="topimage"></img>' 
                                  : ''  )
                              + ( answer.title 
                                  ? '<h1>' + answer.title + '</h1>' 
                                  : ''  )
			                  + ( answer.middleimage 
					              ? '<img src="' + answer.middleimage + '" class="middleimage"></img>' 
					              : ''  )
			                  + ( answer.youtube 
					              ? '<div class="youtube"><iframe width="420" height="315" src="http://www.youtube.com/embed/' +
                                  + answer.youtube
                                  + '" frameborder="0" allowfullscreen></iframe></div>' 
					              : ''  )
                              + '<p>' + answer.text + '</p>'
                              + ( answer.bottomimage 
                                  ? '<img src="' + answer.bottomimage + '" class="topimage"></img>' 
                                  : ''  )
                              + '</div>')
                          );
              }
              return revealed_answers_container;
            },
            build_possible_answer_elements_from_row : function(question, question_index) {
                var answers_container = jQuery('<ul class="col-12 possible_answers possible_answers_'
                    + question_index + '"></ul>');
                for (var i = 0; i < question.possible_answers.length; i++) {
                    var answer_data = question.possible_answers[i];
                    var possible_answer = jQuery('<li class="possible_answer col-12 answer_' 
                        + i
                        + '">'
                        + answer_data.answer
                        + '</li>');
                    (function(question_index, answer_index, possible_answer) {
                        possible_answer.bind('click', function() {
                            answers_container.find('.selected').removeClass('selected');
                            $(this).addClass('selected');
                            var was_correct = that.quiz_data[question_index].possible_answers[answer_index].correct;
                            if ( typeof(answer_tracking[question_index]) === 'undefined' ) {
                                answer_tracking[question_index] = was_correct;
                                that.update_correct_answers_element();
                                cover.find('.question_' + question_index).addClass(
                                    'first_guess_'
                                    + ( was_correct
                                        ? 'right'
                                        : 'wrong'
                                      )
                                );
                            }
                            answers_container
                                .find('.answer_' + answer_index)
                                .addClass( 
                                    was_correct
                                        ? 'correct_answer'
                                        : 'wrong_answer'
                                );
                            that.display_answer(question_index, answer_index, was_correct);
                        });
                    })(question_index, i, possible_answer);
                    answers_container.append(possible_answer);
                }
                return answers_container;
            },
            display_answer : function(question_index, answer_index, was_correct) {
                container_elem
                    .find('.question_' + question_index + ' .question').
                    removeClass('show')
                    .addClass('hide');
                container_elem
                    .find('.question_' + question_index + ' .revealed_answer').
                    removeClass('show')
                    .addClass('hide');

                container_elem
                    .find('.question_' + question_index + ' .revealed_answer_' + answer_index).
                    removeClass('hide')
                    .addClass('show');
            },
            create_cover : function() {
                cover = $('#' + that.container);
                container_elem = jQuery('<ul></ul>');
                cover.append(container_elem);
                container_elem.addClass('quiz_container');
                container_elem.css('padding', '0px');
            },
            update_correct_answers_element: function() {
                var right_answers = 0;
                for (var i = 0; i < that.quiz_data.length; i++) {
                    if (answer_tracking[i]) {
                        right_answers++;
                    }
                }
                correct_answers_element.text(right_answers);
            }
        };
        return quiz.init(quiz_data, options);
    };

    $.fn.quiz = function(quiz_data, options) {
        options = options || {};
        options.container = this.attr('id');
        this.quiz = $.quiz(quiz_data, options);
        return this;
    };
}(jQuery));
